import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useState } from "react";
import { Screen, ScreenHeader, ScreenFlatList } from "@/components/ui/Screen";
import { Plus, Trash2 } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useMyStores } from "@/hooks/useStores";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import * as Haptics from "expo-haptics";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function VendorProducts() {
  const { colors } = useTheme();
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
    <Screen>
      <ScreenHeader
        title="Products"
        right={
          <View className="flex-row items-center gap-1">
            <ThemeToggle size={20} />
            <TouchableOpacity
              onPress={() => setAdding(!adding)}
              className="min-h-[48px] min-w-[48px] items-center justify-center"
              accessibilityLabel="Add product"
            >
              <Plus size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>
        }
      />

      {adding && (
        <View className="p-4 bg-surface border-b border-border gap-3">
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Product name"
            placeholderTextColor={colors.mutedForeground}
            style={{ borderColor: colors.border, color: colors.foreground }}
            className="bg-surface border rounded-lg p-3 min-h-[48px]"
            accessibilityLabel="Product name"
          />
          <View className="flex-row gap-3">
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="Price (ETB)"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="number-pad"
              style={{ borderColor: colors.border, color: colors.foreground }}
              className="flex-1 bg-surface border rounded-lg p-3 min-h-[48px]"
              accessibilityLabel="Price in ETB"
            />
            <TextInput
              value={stock}
              onChangeText={setStock}
              placeholder="Stock"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="number-pad"
              style={{ borderColor: colors.border, color: colors.foreground }}
              className="flex-1 bg-surface border rounded-lg p-3 min-h-[48px]"
              accessibilityLabel="Stock quantity"
            />
          </View>
          <TouchableOpacity
            onPress={handleAdd}
            className="bg-primary rounded-lg p-3 items-center min-h-[48px] justify-center"
          >
            <Text className="text-primary-foreground font-bold">Add Product</Text>
          </TouchableOpacity>
        </View>
      )}

      {!products ? (
        <View className="p-4 gap-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} height={64} />)}
        </View>
      ) : products.length === 0 ? (
        <EmptyState icon={<Plus size={48} color={colors.mutedForeground} />} title="No products yet" message="Add your first product listing." />
      ) : (
        <ScreenFlatList
          data={products}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View className="flex-row justify-between items-center p-3 bg-surface rounded-lg mb-1">
              <View className="flex-1">
                <Text className="font-semibold text-[13px] text-foreground" numberOfLines={1}>{item.name}</Text>
                <Text className="text-xs font-bold text-foreground mt-0.5 tabular-nums">
                  {item.price.toLocaleString()} ETB
                </Text>
                <Text className="text-[10px] text-muted-foreground">
                  Stock: {item.stock} · Sold: {item.salesCount}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert("Delete Product", `Remove ${item.name}?`, [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: () => removeProduct({ productId: item._id }) },
                  ]);
                }}
                className="justify-center items-center min-w-[44px] min-h-[44px]"
                style={{ padding: 8 }}
              >
                <Trash2 size={16} color={colors.destructive} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </Screen>
  );
}
