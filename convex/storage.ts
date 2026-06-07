import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getUserOrThrow } from "./users";

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    await getUserOrThrow(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveProductImage = mutation({
  args: {
    storageId: v.id("_storage"),
    productId: v.id("products"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch("products", args.productId, {
      imageStorageId: args.storageId,
    });
    return null;
  },
});

export const saveStoreImage = mutation({
  args: {
    storageId: v.id("_storage"),
    storeId: v.id("stores"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch("stores", args.storeId, {
      imageStorageId: args.storageId,
    });
    return null;
  },
});

export const saveAvatar = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getUserOrThrow(ctx);
    await ctx.db.patch("users", user._id, {
      avatarStorageId: args.storageId,
    });
    return null;
  },
});

export const getImageUrl = query({
  args: {
    storageId: v.optional(v.id("_storage")),
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    if (!args.storageId) return null;
    return await ctx.storage.getUrl(args.storageId);
  },
});
