import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getUserOrThrow } from "./users";

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("categories"),
      _creationTime: v.number(),
      name: v.string(),
      icon: v.string(),
      slug: v.string(),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    icon: v.string(),
  },
  returns: v.id("categories"),
  handler: async (ctx, args) => {
    const user = await getUserOrThrow(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({ code: "FORBIDDEN", message: "Only admins can create categories" });
    }
    return await ctx.db.insert("categories", {
      name: args.name,
      icon: args.icon,
      slug: args.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    });
  },
});
