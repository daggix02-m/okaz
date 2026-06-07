import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getUserOrThrow, getUser } from "./users";
import { Doc } from "./_generated/dataModel";

const storeValidator = v.object({
  _id: v.id("stores"),
  _creationTime: v.number(),
  ownerId: v.id("users"),
  name: v.string(),
  description: v.optional(v.string()),
  imageStorageId: v.optional(v.id("_storage")),
  category: v.string(),
  locationName: v.string(),
  lat: v.float64(),
  lng: v.float64(),
  isApproved: v.boolean(),
  isFeatured: v.boolean(),
  isSponsored: v.boolean(),
  subscriptionActive: v.boolean(),
  subscriptionMonth: v.number(),
  rating: v.float64(),
  reviewCount: v.number(),
  salesVolume: v.number(),
});

export const listApproved = query({
  args: {},
  returns: v.array(storeValidator),
  handler: async (ctx) => {
    return await ctx.db
      .query("stores")
      .withIndex("by_approved", (q) => q.eq("isApproved", true))
      .collect();
  },
});

export const getById = query({
  args: { storeId: v.id("stores") },
  returns: v.union(storeValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get("stores", args.storeId);
  },
});

export const getByOwner = query({
  args: {},
  returns: v.array(storeValidator),
  handler: async (ctx) => {
    const user = await getUserOrThrow(ctx);
    return await ctx.db
      .query("stores")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
  },
});

export const register = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    locationName: v.string(),
    lat: v.float64(),
    lng: v.float64(),
  },
  returns: v.id("stores"),
  handler: async (ctx, args) => {
    const user = await getUserOrThrow(ctx);
    if (user.role !== "vendor") {
      throw new ConvexError({ code: "FORBIDDEN", message: "Only vendors can register stores" });
    }

    return await ctx.db.insert("stores", {
      ownerId: user._id,
      name: args.name,
      description: args.description,
      category: args.category,
      locationName: args.locationName,
      lat: args.lat,
      lng: args.lng,
      isApproved: false,
      isFeatured: false,
      isSponsored: false,
      subscriptionActive: true,
      subscriptionMonth: 1,
      rating: 5.0,
      reviewCount: 0,
      salesVolume: 0,
    });
  },
});

export const updateMeta = mutation({
  args: {
    storeId: v.id("stores"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    locationName: v.optional(v.string()),
    lat: v.optional(v.float64()),
    lng: v.optional(v.float64()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const store = await ctx.db.get("stores", args.storeId);
    if (!store) throw new ConvexError({ code: "NOT_FOUND", message: "Store not found" });

    const user = await getUserOrThrow(ctx);
    if (store.ownerId !== user._id) {
      throw new ConvexError({ code: "FORBIDDEN", message: "Not your store" });
    }

    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;
    if (args.locationName !== undefined) updates.locationName = args.locationName;
    if (args.lat !== undefined) updates.lat = args.lat;
    if (args.lng !== undefined) updates.lng = args.lng;

    await ctx.db.patch("stores", store._id, updates);
    return null;
  },
});

export const approve = mutation({
  args: { storeId: v.id("stores") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getUserOrThrow(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({ code: "FORBIDDEN", message: "Only admins can approve stores" });
    }

    const store = await ctx.db.get("stores", args.storeId);
    if (!store) throw new ConvexError({ code: "NOT_FOUND", message: "Store not found" });

    await ctx.db.patch("stores", store._id, { isApproved: true });
    return null;
  },
});

export const toggleFeatured = mutation({
  args: { storeId: v.id("stores") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getUserOrThrow(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({ code: "FORBIDDEN", message: "Only admins" });
    }
    const store = await ctx.db.get("stores", args.storeId);
    if (!store) throw new ConvexError({ code: "NOT_FOUND", message: "Store not found" });

    await ctx.db.patch("stores", store._id, { isFeatured: !store.isFeatured });
    return null;
  },
});

export const paySubscription = mutation({
  args: { storeId: v.id("stores") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const store = await ctx.db.get("stores", args.storeId);
    if (!store) throw new ConvexError({ code: "NOT_FOUND", message: "Store not found" });

    const user = await getUserOrThrow(ctx);
    if (store.ownerId !== user._id) {
      throw new ConvexError({ code: "FORBIDDEN", message: "Not your store" });
    }

    await ctx.db.patch("stores", store._id, {
      subscriptionActive: true,
      subscriptionMonth: store.subscriptionMonth + 1,
    });
    return null;
  },
});

export const requestSponsorship = mutation({
  args: { storeId: v.id("stores") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const store = await ctx.db.get("stores", args.storeId);
    if (!store) throw new ConvexError({ code: "NOT_FOUND", message: "Store not found" });

    const user = await getUserOrThrow(ctx);
    if (store.ownerId !== user._id) {
      throw new ConvexError({ code: "FORBIDDEN", message: "Not your store" });
    }

    await ctx.db.patch("stores", store._id, {
      isSponsored: true,
      isFeatured: true,
    });
    return null;
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  returns: v.array(storeValidator),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stores")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});
