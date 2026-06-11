import { View, Text } from "react-native";
import { Map as MapIcon } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { Screen, ScreenHeader } from "@/components/ui/Screen";

export default function DeliveryMap() {
  const { colors } = useTheme();

  return (
    <Screen>
      <ScreenHeader title="Map" />
      <View className="flex-1 items-center justify-center p-6">
        <MapIcon size={48} color={colors.mutedForeground} />
        <Text className="mt-4 text-center font-['Montserrat_400Regular'] text-body text-muted-foreground">
          Live delivery map will be available after MapLibre GL integration.
        </Text>
        <Text className="mt-2 text-center font-['Montserrat_500Medium'] text-caption text-muted-foreground">
          This will show real-time rider location, delivery routes, and store positions on an interactive map of Addis Ababa.
        </Text>
      </View>
    </Screen>
  );
}
