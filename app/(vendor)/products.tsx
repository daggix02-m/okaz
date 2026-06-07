import { View, Text, TouchableOpacity, TextInput, FlatList, Alert } from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus, Trash2, Edit } from "lucide-react-native";
import { colors, typography, spacing, radius } from "@/lib/design-tokens";
import { useMyStores } from "@/hooks/useStores";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import * as Haptics from "expo-haptics";

export default function VendorProducts() {
  const insets = useSafeAreaInsets();
  const stores = useMyStores();
  const activeStore = stores?.[0];
  const products = useQuery(api.products.list, activeStore ? { storeId: activeStore._id } : "skip" as any);
  const createProduct = useMutation(api.products.create);
  const removeProduct = useMutation(api.products.remove);

  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Phone");
  const [description, setDescription] = useState("");

  const handleAdd = async () => {
    if (!activeStore || !name || !price) return;
    try {
      await createProduct({
        storeId: activeStore._id,
        name,
        description: description || name,
        price: Number(price),
        stock: Number(stock) || 1,
        category,
        isFeatured: false,
      });
      setName(""); setPrice(""); setStock(""); setDescription("");
      setAdding(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to create product");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.light.background }}>
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.light.border, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, color: colors.light.text }}>
          Products
        </Text>
        <TouchableOpacity onPress={() => setAdding(!adding)} style={{ minWidth: 48, minHeight: 48, justifyContent: "center", alignItems: "center" }} accessibilityLabel="Add product">
          <Plus size={22} color={colors.light.primary} />
        </TouchableOpacity>
      </View>

      {adding && (
        <View style={{ padding: spacing.lg, backgroundColor: colors.light.surface, borderBottomWidth: 1, borderBottomColor: colors.light.border, gap: spacing.md }}>
          <TextInput value={name} onChangeText={setName} placeholder="Product name" style={{ backgroundColor: colors.light.background, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.sm, padding: spacing.md, minHeight: 48 }} accessibilityLabel="Product name" />
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <TextInput value={price} onChangeText={setPrice} placeholder="Price (ETB)" keyboardType="number-pad" style={{ flex: 1, backgroundColor: colors.light.background, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.sm, padding: spacing.md, minHeight: 48 }} accessibilityLabel="Price in ETB" />
            <TextInput value={stock} onChangeText={setStock} placeholder="Stock" keyboardType="number-pad" style={{ flex: 1, backgroundColor: colors.light.background, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.sm, padding: spacing.md, minHeight: 48 }} accessibilityLabel="Stock quantity" />
          </View>
          <TouchableOpacity onPress={handleAdd} style={{ backgroundColor: colors.light.primary, borderRadius: radius.sm, padding: spacing.md, alignItems: "center", minHeight: 48, justifyContent: "center" }}>
            <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Add Product</Text>
          </TouchableOpacity>
        </View>
      )}

      {!products ? (
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          {[1, 2, 3].map((i) => <Skeleton key={i} height={64} />)}
        </View>
      ) : products.length === 0 ? (
        <EmptyState icon={<Plus size={48} color={colors.light.textTertiary} />} title="No products yet" message="Add your first product listing." />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.md, backgroundColor: colors.light.surface, borderRadius: radius.sm, marginBottom: spacing.xs }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600", fontSize: 13 }} numberOfLines={1}>{item.name}</Text>
                <Text style={{ fontSize: 12, fontWeight: "700", color: colors.light.text, marginTop: 2, fontVariant: ["tabular-nums"] }}>
                  {item.price.toLocaleString()} ETB
                </Text>
                <Text style={{ fontSize: 10, color: colors.light.textSecondary }}>
                  Stock: {item.stock} · Sold: {item.salesCount}
                </Text>
              </View>
              <TouchableOpacity onPress={() => {
                Alert.alert("Delete Product", `Remove ${item.name}?`, [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", style: "destructive", onPress: () => removeProduct({ productId: item._id }) },
                ]);
              }} style={{ padding: spacing.sm, minWidth: 44, minHeight: 44, justifyContent: "center", alignItems: "center" }}>
                <Trash2 size={16} color={colors.light.destructive} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
