import { View, Text, TouchableOpacity } from "react-native";
import { Star } from "lucide-react-native";
import { colors, spacing, radius, typography } from "@/lib/design-tokens";
import { Doc } from "@/convex/_generated/dataModel";

type Store = Doc<"stores">;

export function StoreCard({ store, onPress }: { store: Store; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel={`${store.name}, ${store.rating} stars`}
      style={{
        backgroundColor: colors.light.background,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.light.border,
        padding: spacing.md,
        marginRight: spacing.md,
        width: 200,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.sm,
            backgroundColor: colors.light.surface,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24 }}>🏬</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{ fontWeight: "700", fontSize: 13, color: colors.light.text }}
            numberOfLines={1}
          >
            {store.name}
          </Text>
          <Text style={{ fontSize: 10, color: colors.light.textSecondary, marginTop: 2 }} numberOfLines={1}>
            {store.locationName}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: spacing.xs }}>
            <Star size={10} color="#F59E0B" fill="#F59E0B" />
            <Text style={{ fontSize: 10, fontWeight: "600", color: colors.light.text }}>
              {store.rating}
            </Text>
            <Text style={{ fontSize: 9, color: colors.light.textTertiary }}>
              ({store.reviewCount})
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
