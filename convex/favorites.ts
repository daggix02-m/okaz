import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getUserOrThrow } from "./users";

export const getProductFavorites = query({
  args: {},
  returns: v.array(v.id("products")),
  handler: async (ctx) => {
    const user = await getUserOrThrow(ctx);
    const favs = await ctx.db
      .query("productFavorites")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    return favs.map((f) => f.productId);
  },
});

export const getStoreFavorites = query({
  args: {},
  returns: v.array(v.id("stores")),
  handler: async (ctx) => {
    const user = await getUserOrThrow(ctx);
    const favs = await ctx.db
      .query("storeFavorites")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    return favs.map((f) => f.storeId);
  },
});

export const toggleProductFavorite = mutation({
  args: { productId: v.id("products") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await getUserOrThrow(ctx);
    const existing = await ctx.db
      .query("productFavorites")
      .withIndex("by_user_product", (q) =>
        q.eq("userId", user._id).eq("productId", args.productId),
      )
      .first();

    if (existing) {
      await ctx.db.delete("productFavorites", existing._id);
      return false;
    } else {
      await ctx.db.insert("productFavorites", {
        userId: user._id,
        productId: args.productId,
      });
      return true;
    }
  },
});

export const toggleStoreFavorite = mutation({
  args: { storeId: v.id("stores") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await getUserOrThrow(ctx);
    const existing = await ctx.db
      .query("storeFavorites")
      .withIndex("by_user_store", (q) =>
        q.eq("userId", user._id).eq("storeId", args.storeId),
      )
      .first();

    if (existing) {
      await ctx.db.delete("storeFavorites", existing._id);
      return false;
    } else {
      await ctx.db.insert("storeFavorites", {
        userId: user._id,
        storeId: args.storeId,
      });
      return true;
    }
  },
});
