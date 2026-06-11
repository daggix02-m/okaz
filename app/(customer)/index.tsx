import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Screen, ScreenHeader, ScreenFlatList } from "@/components/ui/Screen";
import { Search, SlidersHorizontal, ShoppingCart, MapPin, ShoppingBag, Smartphone, Laptop, Shirt, Sparkles } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useCurrentUser } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { useStores } from "@/hooks/useStores";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductCard } from "@/components/ProductCard";
import { StoreCard } from "@/components/StoreCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCartStore } from "@/stores/cart.store";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import * as Haptics from "expo-haptics";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "best_seller", label: "Best Sellers" },
  { id: "cheaper", label: "Under 15k ETB" },
] as const;

export default function CustomerHome() {
  const { colors } = useTheme();
  const { isAuthenticated } = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  const products = useProducts({ category: selectedCategory });
  const stores = useStores();
  const categories = useQuery(api.categories.list);
  const productFavIds = useQuery(api.favorites.getProductFavorites, isAuthenticated ? {} : "skip");
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

  const renderCategoryIcon = (slug: string | undefined, isSelected: boolean) => {
    const iconColor = isSelected ? colors.primaryForeground : colors.mutedForeground;
    if (!slug) return <ShoppingBag size={20} color={iconColor} />;
    switch (slug) {
      case "phone": return <Smartphone size={20} color={iconColor} />;
      case "electronics": return <Laptop size={20} color={iconColor} />;
      case "cloth": return <Shirt size={20} color={iconColor} />;
      case "cosmetics": return <Sparkles size={20} color={iconColor} />;
      default: return <ShoppingBag size={20} color={iconColor} />;
    }
  };

  return (
    <Screen>
      <ScreenHeader bordered>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[22px] font-bold text-foreground font-['Montserrat_700Bold']">
              OKAZ
            </Text>
            <View className="flex-row items-center mt-0.5 gap-1">
              <MapPin size={12} color={colors.accent} />
              <Text className="text-xs text-muted-foreground font-['Montserrat_500Medium']">
                Addis Ababa
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <ThemeToggle size={20} />
            <TouchableOpacity
              onPress={() => {
                router.push("/(customer)/cart");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              accessibilityLabel={`Shopping cart, ${cartCount} items`}
              accessibilityRole="button"
              className="relative items-center justify-center w-12 h-12"
            >
              <ShoppingCart size={22} color={colors.foreground} />
              {cartCount > 0 && (
                <View className="absolute top-0 right-0 justify-center items-center w-5 h-5 rounded-full bg-destructive">
                  <Text className="text-center text-destructive-foreground text-[10px] font-bold font-['Montserrat_700Bold']">
                    {cartCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View className="flex-row mt-3 gap-2">
          <View className="flex-1 flex-row items-center rounded-lg border border-border bg-surface px-3">
            <Search size={18} color={colors.mutedForeground} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search products..."
              placeholderTextColor={colors.mutedForeground}
              accessibilityLabel="Search products"
              className="flex-1 p-3 text-base text-foreground font-['Montserrat_400Regular'] min-h-[48px]"
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              setShowFilters(!showFilters);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            accessibilityLabel="Toggle filters"
            className="items-center justify-center rounded-lg border w-12 h-12"
            style={{
              backgroundColor: showFilters ? colors.primaryLight : colors.surface,
              borderColor: showFilters ? colors.primary : colors.border,
            }}
          >
            <SlidersHorizontal
              size={20}
              color={showFilters ? colors.primary : colors.mutedForeground}
            />
          </TouchableOpacity>
        </View>

        {/* Quick Filters */}
        {showFilters && (
          <View className="flex-row mt-3 gap-2">
            {FILTERS.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  onPress={() => setActiveFilter(f.id)}
                  accessibilityRole="button"
                  accessibilityLabel={f.label}
                  className="rounded-full border px-4 py-2 min-h-[36px]"
                  style={{
                    backgroundColor: isActive ? colors.primary : colors.surface,
                    borderColor: isActive ? colors.primary : colors.border,
                  }}
                >
                  <Text
                    className={`text-xs font-['Montserrat_500Medium'] ${isActive ? 'font-bold' : 'font-medium'}`}
                    style={{
                      color: isActive ? colors.primaryForeground : colors.mutedForeground,
                    }}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScreenHeader>

      <ScreenFlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={{ padding: 16 }}
        columnWrapperStyle={{ gap: 12 }}
        ListHeaderComponent={
          <View className="mb-4">
            {/* Categories */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
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
                    className="items-center py-2 min-w-[64px]"
                  >
                    <View
                      className="items-center justify-center rounded-full border mb-1 w-12 h-12"
                      style={{
                        backgroundColor: isSelected ? colors.primary : colors.surface,
                        borderColor: isSelected ? colors.primary : colors.border,
                      }}
                    >
                      {renderCategoryIcon(cat.slug, isSelected)}
                    </View>
                    <Text
                      className="text-center text-[10px]"
                      style={{
                        fontWeight: isSelected ? "700" : "500",
                        fontFamily: isSelected ? "Montserrat_700Bold" : "Montserrat_500Medium",
                        color: isSelected ? colors.primary : colors.mutedForeground,
                      }}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Nearby Stores */}
            {stores && stores.length > 0 && (
              <View className="mt-4">
                <Text className="mb-3 uppercase tracking-wider text-xs font-bold text-foreground font-['Montserrat_500Medium']">
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

            <Text className="mt-6 mb-3 uppercase tracking-wider text-xs font-bold text-foreground font-['Montserrat_500Medium']">
              {selectedCategory
                ? defaultCategories.find((c) => c.slug === selectedCategory)?.name ?? "Products"
                : "Featured Products"}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="flex-1 max-w-[50%]">
            <ProductCard product={item} isFavorited={productFavIds?.includes(item._id)} />
          </View>
        )}
        ListEmptyComponent={
          !products ? (
            <View className="flex-row flex-wrap gap-3">
              {[1, 2, 3, 4].map((i) => (
                <View key={i} className="flex-1 min-w-[45%]">
                  <Skeleton height={220} />
                </View>
              ))}
            </View>
          ) : (
            <EmptyState
              icon={<Search size={48} color={colors.mutedForeground} />}
              title="No products found"
              message="Try adjusting your search or filters."
              action={{ label: "Clear filters", onPress: () => { setSearchQuery(""); setActiveFilter("all"); setSelectedCategory(undefined); } }}
            />
          )
        }
      />
    </Screen>
  );
}
