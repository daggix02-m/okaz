import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Map as MapIcon } from "lucide-react-native";
import { colors, typography, spacing } from "@/lib/design-tokens";

export default function DeliveryMap() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.light.background }}>
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.light.border }}>
        <Text style={{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, color: colors.light.text }}>
          Map
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl }}>
        <MapIcon size={48} color={colors.light.textTertiary} />
        <Text style={{ fontSize: typography.body.fontSize, color: colors.light.textSecondary, textAlign: "center", marginTop: spacing.lg }}>
          Live delivery map will be available after MapLibre GL integration.
        </Text>
        <Text style={{ fontSize: typography.caption.fontSize, color: colors.light.textTertiary, textAlign: "center", marginTop: spacing.sm }}>
          This will show real-time rider location, delivery routes, and store positions on an interactive map of Addis Ababa.
        </Text>
      </View>
    </View>
  );
}
