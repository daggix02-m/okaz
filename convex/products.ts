import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getUserOrThrow } from "./users";

const productValidator = v.object({
  _id: v.id("products"),
  _creationTime: v.number(),
  storeId: v.id("stores"),
  name: v.string(),
  description: v.string(),
  imageStorageId: v.optional(v.id("_storage")),
  price: v.number(),
  stock: v.number(),
  category: v.string(),
  isFeatured: v.boolean(),
  salesCount: v.number(),
  rating: v.float64(),
  reviewCount: v.number(),
});

export const list = query({
  args: {
    category: v.optional(v.string()),
    storeId: v.optional(v.id("stores")),
    featured: v.optional(v.boolean()),
  },
  returns: v.array(productValidator),
  handler: async (ctx, args) => {
    const { storeId, featured, category } = args;
    if (storeId !== undefined) {
      return await ctx.db
        .query("products")
        .withIndex("by_store", (q) => q.eq("storeId", storeId))
        .collect();
    }
    if (featured === true) {
      return await ctx.db
        .query("products")
        .withIndex("by_featured", (q) => q.eq("isFeatured", true))
        .collect();
    }
    if (category !== undefined) {
      return await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", category))
        .collect();
    }
    return await ctx.db.query("products").collect();
  },
});

export const search = query({
  args: { query: v.string() },
  returns: v.array(productValidator),
  handler: async (ctx, args) => {
    const q = args.query.toLowerCase();
    const all = await ctx.db.query("products").collect();
    return all.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  },
});

export const getById = query({
  args: { productId: v.id("products") },
  returns: v.union(productValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get("products", args.productId);
  },
});

export const create = mutation({
  args: {
    storeId: v.id("stores"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    stock: v.number(),
    category: v.string(),
    isFeatured: v.optional(v.boolean()),
  },
  returns: v.id("products"),
  handler: async (ctx, args) => {
    const user = await getUserOrThrow(ctx);
    if (user.role !== "vendor") {
      throw new ConvexError({ code: "FORBIDDEN", message: "Only vendors can create products" });
    }

    return await ctx.db.insert("products", {
      storeId: args.storeId,
      name: args.name,
      description: args.description,
      price: args.price,
      stock: args.stock,
      category: args.category,
      isFeatured: args.isFeatured ?? false,
      salesCount: 0,
      rating: 5.0,
      reviewCount: 0,
    });
  },
});

export const update = mutation({
  args: {
    productId: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    stock: v.optional(v.number()),
    category: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const product = await ctx.db.get("products", args.productId);
    if (!product) throw new ConvexError({ code: "NOT_FOUND", message: "Product not found" });

    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;
    if (args.price !== undefined) updates.price = args.price;
    if (args.stock !== undefined) updates.stock = args.stock;
    if (args.category !== undefined) updates.category = args.category;
    if (args.isFeatured !== undefined) updates.isFeatured = args.isFeatured;

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch("products", product._id, updates);
    }
    return null;
  },
});

export const remove = mutation({
  args: { productId: v.id("products") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const product = await ctx.db.get("products", args.productId);
    if (!product) throw new ConvexError({ code: "NOT_FOUND", message: "Product not found" });
    await ctx.db.delete("products", product._id);
    return null;
  },
});
