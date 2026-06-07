import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getUserOrThrow, getUser } from "./users";

const orderValidator = v.object({
  _id: v.id("orders"),
  _creationTime: v.number(),
  orderId: v.string(),
  customerId: v.id("users"),
  storeId: v.id("stores"),
  riderId: v.optional(v.id("users")),
  status: v.union(
    v.literal("pending"),
    v.literal("confirmed"),
    v.literal("packed"),
    v.literal("assigned"),
    v.literal("on_the_way"),
    v.literal("delivered"),
  ),
  subtotal: v.number(),
  deliveryFee: v.number(),
  total: v.number(),
  paymentMethod: v.union(v.literal("telebirr"), v.literal("cbe"), v.literal("chapa")),
  paymentStatus: v.union(v.literal("pending"), v.literal("paid")),
  deliveryAddress: v.string(),
  deliveryLat: v.float64(),
  deliveryLng: v.float64(),
  chapaTxRef: v.optional(v.string()),
  items: v.array(
    v.object({
      productId: v.id("products"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
      imageStorageId: v.optional(v.id("_storage")),
    }),
  ),
});

const statusOrder = ["pending", "confirmed", "packed", "assigned", "on_the_way", "delivered"] as const;

export const create = mutation({
  args: {
    storeId: v.id("stores"),
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
      }),
    ),
    subtotal: v.number(),
    deliveryFee: v.number(),
    total: v.number(),
    paymentMethod: v.union(v.literal("telebirr"), v.literal("cbe"), v.literal("chapa")),
    deliveryAddress: v.string(),
    deliveryLat: v.float64(),
    deliveryLng: v.float64(),
    couponApplied: v.optional(v.boolean()),
  },
  returns: v.id("orders"),
  handler: async (ctx, args) => {
    const user = await getUserOrThrow(ctx);

    // OCC: Read products, verify stock, compute new values, then patch
    for (const item of args.items) {
      const product = await ctx.db.get("products", item.productId);
      if (!product) {
        throw new ConvexError({ code: "NOT_FOUND", message: `Product not found` });
      }
      if (product.stock < item.quantity) {
        throw new ConvexError({
          code: "OUT_OF_STOCK",
          message: `${product.name} has only ${product.stock} left`,
        });
      }
      await ctx.db.patch("products", item.productId, {
        stock: product.stock - item.quantity,
        salesCount: product.salesCount + item.quantity,
      });
    }

    // Increment store sales volume
    const store = await ctx.db.get("stores", args.storeId);
    if (store) {
      const totalItems = args.items.reduce((sum, i) => sum + i.quantity, 0);
      await ctx.db.patch("stores", args.storeId, {
        salesVolume: store.salesVolume + totalItems,
      });
    }

    const orderId = `OKZ-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalTotal = args.couponApplied ? Math.round(args.total * 0.7) : args.total;

    // Use coupon if active
    if (args.couponApplied && user.couponActive) {
      await ctx.db.patch("users", user._id, { couponActive: false, referralCount: 0 });
    }

    return await ctx.db.insert("orders", {
      orderId,
      customerId: user._id,
      storeId: args.storeId,
      riderId: undefined,
      status: "pending",
      subtotal: args.subtotal,
      deliveryFee: args.deliveryFee,
      total: finalTotal,
      paymentMethod: args.paymentMethod,
      paymentStatus: "paid",
      deliveryAddress: args.deliveryAddress,
      deliveryLat: args.deliveryLat,
      deliveryLng: args.deliveryLng,
      items: args.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  },
});

export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("confirmed"),
      v.literal("packed"),
      v.literal("assigned"),
      v.literal("on_the_way"),
      v.literal("delivered"),
    ),
    riderId: v.optional(v.id("users")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const order = await ctx.db.get("orders", args.orderId);
    if (!order) throw new ConvexError({ code: "NOT_FOUND", message: "Order not found" });

    // Idempotent: early return if already past this state
    const currentIdx = statusOrder.indexOf(order.status);
    const newIdx = statusOrder.indexOf(args.status);
    if (newIdx <= currentIdx) return null;

    const patch: Record<string, unknown> = { status: args.status };
    if (args.riderId) patch.riderId = args.riderId;

    await ctx.db.patch("orders", order._id, patch);

    // If marked as assigned, update rider status to delivering
    if (args.status === "assigned" && args.riderId) {
      const rider = await ctx.db
        .query("riders")
        .withIndex("by_user", (q) => q.eq("userId", args.riderId!))
        .first();
      if (rider) {
        await ctx.db.patch("riders", rider._id, { status: "delivering" });
      }
    }

    // If delivered, update rider back to idle and add earnings
    if (args.status === "delivered" && order.riderId) {
      const rider = await ctx.db
        .query("riders")
        .withIndex("by_user", (q) => q.eq("userId", order.riderId!))
        .first();
      if (rider) {
        await ctx.db.patch("riders", rider._id, {
          status: "idle",
          totalEarnings: rider.totalEarnings + order.deliveryFee,
        });
      }
    }

    return null;
  },
});

export const getByCustomer = query({
  args: {},
  returns: v.array(orderValidator),
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return [];
    return await ctx.db
      .query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", user._id))
      .order("desc")
      .collect();
  },
});

export const getByStore = query({
  args: { storeId: v.id("stores") },
  returns: v.array(orderValidator),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .order("desc")
      .collect();
  },
});

export const getByRider = query({
  args: {},
  returns: v.array(orderValidator),
  handler: async (ctx) => {
    const user = await getUserOrThrow(ctx);
    return await ctx.db
      .query("orders")
      .withIndex("by_rider", (q) => q.eq("riderId", user._id))
      .order("desc")
      .collect();
  },
});

export const getPending = query({
  args: {},
  returns: v.array(orderValidator),
  handler: async (ctx) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", "packed"))
      .collect();
  },
});

export const assignRider = mutation({
  args: {
    orderId: v.id("orders"),
    riderId: v.id("users"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const order = await ctx.db.get("orders", args.orderId);
    if (!order) throw new ConvexError({ code: "NOT_FOUND", message: "Order not found" });
    if (order.status !== "packed") {
      throw new ConvexError({ code: "FORBIDDEN", message: "Order must be packed before assigning rider" });
    }

    await ctx.db.patch("orders", order._id, {
      status: "assigned",
      riderId: args.riderId,
    });

    const rider = await ctx.db
      .query("riders")
      .withIndex("by_user", (q) => q.eq("userId", args.riderId))
      .first();
    if (rider) {
      await ctx.db.patch("riders", rider._id, { status: "delivering" });
    }

    return null;
  },
});
