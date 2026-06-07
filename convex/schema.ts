import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  users: defineTable({
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
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"])
    .index("by_referral_code", ["referralCode"]),

  stores: defineTable({
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
  })
    .index("by_owner", ["ownerId"])
    .index("by_approved", ["isApproved"])
    .index("by_featured", ["isFeatured"])
    .index("by_category", ["category"]),

  products: defineTable({
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
  })
    .index("by_store", ["storeId"])
    .index("by_category", ["category"])
    .index("by_featured", ["isFeatured"]),

  orders: defineTable({
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
  })
    .index("by_customer", ["customerId"])
    .index("by_store", ["storeId"])
    .index("by_rider", ["riderId"])
    .index("by_status", ["status"]),

  riders: defineTable({
    userId: v.id("users"),
    vehicleType: v.string(),
    plateNumber: v.string(),
    status: v.union(v.literal("idle"), v.literal("delivering")),
    rating: v.float64(),
    totalEarnings: v.number(),
    currentLat: v.float64(),
    currentLng: v.float64(),
    lastLocationUpdate: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  reviews: defineTable({
    authorId: v.id("users"),
    authorName: v.string(),
    targetType: v.union(v.literal("product"), v.literal("store")),
    targetId: v.string(),
    rating: v.number(),
    text: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  })
    .index("by_target", ["targetType", "targetId"])
    .index("by_author", ["authorId"]),

  productFavorites: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
  })
    .index("by_user", ["userId"])
    .index("by_user_product", ["userId", "productId"]),

  storeFavorites: defineTable({
    userId: v.id("users"),
    storeId: v.id("stores"),
  })
    .index("by_user", ["userId"])
    .index("by_user_store", ["userId", "storeId"]),

  categories: defineTable({
    name: v.string(),
    icon: v.string(),
    slug: v.string(),
  }).index("by_slug", ["slug"]),
});
