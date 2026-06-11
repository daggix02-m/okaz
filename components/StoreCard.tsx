import { View, Text, TouchableOpacity } from "react-native";
import { Star } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { Doc } from "@/convex/_generated/dataModel";
import { Image } from "expo-image";
import { getStoreImage } from "@/lib/image-helper";

type Store = Doc<"stores">;

export function StoreCard({ store, onPress }: { store: Store; onPress: () => void }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel={`${store.name}, ${store.rating} stars`}
      className="bg-card border border-border rounded-xl p-4 mr-4 w-[200px]"
    >
      <View className="flex-row items-center gap-4">
        <View className="w-12 h-12 bg-surface rounded-lg overflow-hidden border border-border">
          <Image
            source={{ uri: getStoreImage(store.name, store.category) }}
            className="w-full h-full"
            contentFit="cover"
          />
        </View>
        <View className="flex-1">
          <Text
            className="font-bold text-[13px] text-card-foreground"
            numberOfLines={1}
          >
            {store.name}
          </Text>
          <Text
            className="mt-0.5 text-[10px] text-muted-foreground"
            numberOfLines={1}
          >
            {store.locationName}
          </Text>
          <View className="flex-row items-center mt-1 gap-1">
            <Star size={12} color={colors.chart4} fill={colors.chart4} />
            <Text className="font-semibold text-[11px] text-card-foreground">
              {store.rating}
            </Text>
            <Text className="text-[10px] text-muted-foreground">
              ({store.reviewCount})
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
