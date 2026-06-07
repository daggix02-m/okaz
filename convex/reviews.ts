import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getUserOrThrow } from "./users";

const reviewValidator = v.object({
  _id: v.id("reviews"),
  _creationTime: v.number(),
  authorId: v.id("users"),
  authorName: v.string(),
  targetType: v.union(v.literal("product"), v.literal("store")),
  targetId: v.string(),
  rating: v.number(),
  text: v.string(),
  imageStorageId: v.optional(v.id("_storage")),
});

export const getByTarget = query({
  args: {
    targetType: v.union(v.literal("product"), v.literal("store")),
    targetId: v.string(),
  },
  returns: v.array(reviewValidator),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_target", (q) =>
        q.eq("targetType", args.targetType).eq("targetId", args.targetId),
      )
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    targetType: v.union(v.literal("product"), v.literal("store")),
    targetId: v.string(),
    rating: v.number(),
    text: v.string(),
  },
  returns: v.id("reviews"),
  handler: async (ctx, args) => {
    const user = await getUserOrThrow(ctx);

    if (args.rating < 1 || args.rating > 5) {
      throw new ConvexError({ code: "INVALID", message: "Rating must be between 1 and 5" });
    }

    const reviewId = await ctx.db.insert("reviews", {
      authorId: user._id,
      authorName: user.name,
      targetType: args.targetType,
      targetId: args.targetId,
      rating: args.rating,
      text: args.text,
    });

    // OCC: Recalculate average rating for product or store
    if (args.targetType === "product") {
      const productId = args.targetId as unknown as import("./_generated/dataModel").Id<"products">;
      const product = await ctx.db.get("products", productId);
      if (product) {
        const newCount = product.reviewCount + 1;
        const newRating =
          Math.round(((product.rating * product.reviewCount + args.rating) / newCount) * 10) / 10;
        await ctx.db.patch("products", product._id, {
          rating: newRating,
          reviewCount: newCount,
        });
      }
    } else {
      const storeId = args.targetId as unknown as import("./_generated/dataModel").Id<"stores">;
      const store = await ctx.db.get("stores", storeId);
      if (store) {
        const newCount = store.reviewCount + 1;
        const newRating =
          Math.round(((store.rating * store.reviewCount + args.rating) / newCount) * 10) / 10;
        await ctx.db.patch("stores", store._id, {
          rating: newRating,
          reviewCount: newCount,
        });
      }
    }

    return reviewId;
  },
});
