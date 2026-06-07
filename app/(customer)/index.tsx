import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search, SlidersHorizontal, ShoppingCart, MapPin, Sparkles } from "lucide-react-native";
import { colors, typography, spacing, radius } from "@/lib/design-tokens";
import { useProducts } from "@/hooks/useProducts";
import { useStores } from "@/hooks/useStores";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductCard } from "@/components/ProductCard";
import { StoreCard } from "@/components/StoreCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCartStore } from "@/stores/cart.store";
import * as Haptics from "expo-haptics";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "best_seller", label: "Best Sellers" },
  { id: "cheaper", label: "Under 15k ETB" },
] as const;

export default function CustomerHome() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  const products = useProducts({ category: selectedCategory });
  const stores = useStores();
  const categories = useQuery(api.categories.list);
  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let list = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (activeFilter === "best_seller") {
      list = list.filter((p) => p.salesCount >= 10 || p.rating >= 4.5);
    } else if (activeFilter === "cheaper") {
      list = list.filter((p) => p.price < 15000);
    }
    return list;
  }, [products, searchQuery, activeFilter]);

  const defaultCategories = [
    { name: "All", icon: "shopping-bag", slug: undefined },
    { name: "Phone", icon: "smartphone", slug: "phone" },
    { name: "Electronics", icon: "laptop", slug: "electronics" },
    { name: "Cloth", icon: "shirt", slug: "cloth" },
    { name: "Cosmetics", icon: "sparkles", slug: "cosmetics" },
  ];

  const displayCategories = categories?.length ? categories : defaultCategories;

  return (
    <View style={{ flex: 1, backgroundColor: colors.light.background }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + spacing.sm,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.md,
          backgroundColor: colors.light.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.light.border,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, color: colors.light.text }}>
              OKAZ
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: 2 }}>
              <MapPin size={12} color={colors.light.accent} />
              <Text style={{ fontSize: typography.caption.fontSize, color: colors.light.textSecondary }}>
                Addis Ababa
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              router.push("/(customer)/cart");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            accessibilityLabel={`Shopping cart, ${cartCount} items`}
            accessibilityRole="button"
            style={{
              position: "relative",
              padding: spacing.sm,
              minWidth: 48,
              minHeight: 48,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ShoppingCart size={22} color={colors.light.text} />
            {cartCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: colors.light.accent,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "700" }}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.md }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: colors.light.surface, borderRadius: radius.sm, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.light.border }}>
            <Search size={18} color={colors.light.textTertiary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search products..."
              placeholderTextColor={colors.light.textTertiary}
              accessibilityLabel="Search products"
              style={{
                flex: 1,
                padding: spacing.md,
                fontSize: typography.body.fontSize,
                color: colors.light.text,
                minHeight: 48,
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              setShowFilters(!showFilters);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            accessibilityLabel="Toggle filters"
            style={{
              padding: spacing.md,
              backgroundColor: showFilters ? colors.light.primaryLight : colors.light.surface,
              borderRadius: radius.sm,
              borderWidth: 1,
              borderColor: showFilters ? colors.light.primary : colors.light.border,
              minWidth: 48,
              minHeight: 48,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SlidersHorizontal size={20} color={showFilters ? colors.light.primary : colors.light.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Quick Filters */}
        {showFilters && (
          <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.md }}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f.id}
                onPress={() => setActiveFilter(f.id)}
                accessibilityRole="button"
                accessibilityLabel={f.label}
                style={{
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.sm,
                  borderRadius: radius.pill,
                  backgroundColor: activeFilter === f.id ? colors.light.primary : colors.light.surface,
                  borderWidth: 1,
                  borderColor: activeFilter === f.id ? colors.light.primary : colors.light.border,
                  minHeight: 36,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.caption.fontSize,
                    fontWeight: activeFilter === f.id ? "700" : "500",
                    color: activeFilter === f.id ? "#FFFFFF" : colors.light.textSecondary,
                  }}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
        columnWrapperStyle={{ gap: spacing.md }}
        ListHeaderComponent={
          <View style={{ marginBottom: spacing.lg }}>
            {/* Categories */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.sm }}
            >
              {defaultCategories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <TouchableOpacity
                    key={cat.slug ?? "all"}
                    onPress={() => setSelectedCategory(cat.slug)}
                    accessibilityRole="radio"
                    accessibilityLabel={cat.name}
                    accessibilityState={{ selected: isSelected }}
                    style={{
                      alignItems: "center",
                      paddingVertical: spacing.sm,
                      minWidth: 64,
                    }}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: isSelected ? colors.light.primary : colors.light.surface,
                        borderWidth: 1,
                        borderColor: isSelected ? colors.light.primary : colors.light.border,
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: spacing.xs,
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>
                        {cat.slug === "phone" ? "📱" : cat.slug === "electronics" ? "💻" : cat.slug === "cloth" ? "👚" : cat.slug === "cosmetics" ? "💄" : "🛍️"}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: isSelected ? "700" : "500",
                        color: isSelected ? colors.light.primary : colors.light.textSecondary,
                        textAlign: "center",
                      }}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* NearYou Stores */}
            {stores && stores.length > 0 && (
              <View style={{ marginTop: spacing.lg }}>
                <Text
                  style={{
                    fontSize: typography.caption.fontSize,
                    fontWeight: "700",
                    color: colors.light.text,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: spacing.md,
                  }}
                >
                  Nearby Stores
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {stores.slice(0, 8).map((store) => (
                    <StoreCard
                      key={store._id}
                      store={store}
                      onPress={() => router.push(`/store/${store._id}`)}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            <Text
              style={{
                fontSize: typography.caption.fontSize,
                fontWeight: "700",
                color: colors.light.text,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginTop: spacing.xl,
                marginBottom: spacing.md,
              }}
            >
              {selectedCategory
                ? defaultCategories.find((c) => c.slug === selectedCategory)?.name ?? "Products"
                : "Featured Products"}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1, maxWidth: "50%" }}>
            <ProductCard product={item} />
          </View>
        )}
        ListEmptyComponent={
          !products ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md }}>
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={{ flex: 1, minWidth: "45%" }}>
                  <Skeleton height={220} />
                </View>
              ))}
            </View>
          ) : (
            <View style={{ padding: spacing.xxl, alignItems: "center" }}>
              <Text style={{ fontSize: typography.body.fontSize, color: colors.light.textSecondary }}>
                No products found
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                  setSelectedCategory(undefined);
                }}
                style={{ marginTop: spacing.md }}
              >
                <Text style={{ color: colors.light.primary, fontWeight: "600" }}>Clear filters</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
    </View>
  );
}
