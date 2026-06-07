import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getUserOrThrow } from "./users";

const riderValidator = v.object({
  _id: v.id("riders"),
  _creationTime: v.number(),
  userId: v.id("users"),
  vehicleType: v.string(),
  plateNumber: v.string(),
  status: v.union(v.literal("idle"), v.literal("delivering")),
  rating: v.float64(),
  totalEarnings: v.number(),
  currentLat: v.float64(),
  currentLng: v.float64(),
  lastLocationUpdate: v.number(),
});

export const list = query({
  args: {},
  returns: v.array(riderValidator),
  handler: async (ctx) => {
    return await ctx.db.query("riders").collect();
  },
});

export const getAvailable = query({
  args: {},
  returns: v.array(riderValidator),
  handler: async (ctx) => {
    return await ctx.db
      .query("riders")
      .withIndex("by_status", (q) => q.eq("status", "idle"))
      .collect();
  },
});

export const getCurrentRider = query({
  args: {},
  returns: v.union(riderValidator, v.null()),
  handler: async (ctx) => {
    const user = await getUserOrThrow(ctx);
    return await ctx.db
      .query("riders")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
  },
});

export const register = mutation({
  args: {
    vehicleType: v.string(),
    plateNumber: v.string(),
  },
  returns: v.id("riders"),
  handler: async (ctx, args) => {
    const user = await getUserOrThrow(ctx);
    if (user.role !== "delivery") {
      throw new ConvexError({ code: "FORBIDDEN", message: "Only delivery agents can register" });
    }

    const existing = await ctx.db
      .query("riders")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (existing) {
      throw new ConvexError({ code: "CONFLICT", message: "Rider already registered" });
    }

    return await ctx.db.insert("riders", {
      userId: user._id,
      vehicleType: args.vehicleType,
      plateNumber: args.plateNumber,
      status: "idle",
      rating: 5.0,
      totalEarnings: 0,
      currentLat: 9.03,
      currentLng: 38.74,
      lastLocationUpdate: Date.now(),
    });
  },
});

export const updateLocation = mutation({
  args: {
    lat: v.float64(),
    lng: v.float64(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getUserOrThrow(ctx);
    const rider = await ctx.db
      .query("riders")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (!rider) throw new ConvexError({ code: "NOT_FOUND", message: "Rider not found" });

    // Throttle: minimum 5 seconds between updates
    if (Date.now() - rider.lastLocationUpdate < 5000) return null;

    await ctx.db.patch("riders", rider._id, {
      currentLat: args.lat,
      currentLng: args.lng,
      lastLocationUpdate: Date.now(),
    });
    return null;
  },
});
