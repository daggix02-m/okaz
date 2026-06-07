import { v } from "convex/values";
import { query, mutation, internalMutation, QueryCtx } from "./_generated/server";
import { ConvexError } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

const userProfileValidator = v.object({
  _id: v.id("users"),
  _creationTime: v.number(),
  tokenIdentifier: v.string(),
  email: v.string(),
  name: v.string(),
  phone: v.optional(v.string()),
  role: v.union(
    v.literal("customer"),
    v.literal("vendor"),
    v.literal("delivery"),
    v.literal("admin"),
  ),
  avatarStorageId: v.optional(v.id("_storage")),
  referralCode: v.optional(v.string()),
  referredBy: v.optional(v.id("users")),
  referralCount: v.number(),
  couponActive: v.boolean(),
});

export async function getUser(ctx: QueryCtx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .first();
}

export async function getUserOrThrow(ctx: QueryCtx): Promise<Doc<"users">> {
  const user = await getUser(ctx);
  if (!user) throw new ConvexError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  return user;
}

export const currentUser = query({
  args: {},
  returns: v.union(userProfileValidator, v.null()),
  handler: async (ctx) => {
    return await getUser(ctx);
  },
});

export const getById = query({
  args: { userId: v.id("users") },
  returns: v.union(userProfileValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get("users", args.userId);
  },
});

export const getReferralStats = query({
  args: {},
  returns: v.union(
    v.object({
      referralCount: v.number(),
      couponActive: v.boolean(),
      referralCode: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return null;
    return {
      referralCount: user.referralCount,
      couponActive: user.couponActive,
      referralCode: user.referralCode,
    };
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    const user = await getUserOrThrow(ctx);
    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.phone !== undefined) updates.phone = args.phone;
    if (Object.keys(updates).length > 0) {
      await ctx.db.patch("users", user._id, updates);
    }
    return user._id;
  },
});

export const trackReferral = mutation({
  args: { referralCode: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const referrer = await ctx.db
      .query("users")
      .withIndex("by_referral_code", (q) => q.eq("referralCode", args.referralCode))
      .first();

    if (!referrer) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Invalid referral code" });
    }

    const newCount = referrer.referralCount + 1;
    await ctx.db.patch("users", referrer._id, {
      referralCount: newCount,
      couponActive: newCount >= 20,
    });
    return null;
  },
});

export const claimCoupon = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const user = await getUserOrThrow(ctx);
    if (!user.couponActive) {
      throw new ConvexError({ code: "FORBIDDEN", message: "No coupon available" });
    }
    await ctx.db.patch("users", user._id, { couponActive: false, referralCount: 0 });
    return null;
  },
});

export const _onUserCreate = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.string(),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    const referralCode = `OKZ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    return await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      email: args.email,
      name: args.name,
      role: args.role as Doc<"users">["role"],
      referralCode,
      referralCount: 0,
      couponActive: false,
    });
  },
});
