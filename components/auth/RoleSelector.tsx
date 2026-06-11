import { TouchableOpacity, Text, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { ShoppingBag, Store, Bike, Shield } from "lucide-react-native";

interface Role {
  id: string;
  label: string;
  icon: "shopping-bag" | "store" | "bike" | "shield";
}

const ROLES: Role[] = [
  { id: "customer", label: "Customer", icon: "shopping-bag" },
  { id: "vendor", label: "Vendor", icon: "store" },
  { id: "delivery", label: "Delivery", icon: "bike" },
  { id: "admin", label: "Admin", icon: "shield" },
];

const ICON_COMPONENTS = {
  "shopping-bag": ShoppingBag,
  store: Store,
  bike: Bike,
  shield: Shield,
};

interface RoleSelectorProps {
  value: string;
  onChange: (role: string) => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-row gap-1.5">
      {ROLES.map((r) => {
        const isSelected = value === r.id;
        const Icon = ICON_COMPONENTS[r.icon];

        return (
          <View key={r.id} className="flex-1">
            <TouchableOpacity
              onPress={() => onChange(r.id)}
              accessibilityRole="radio"
              accessibilityLabel={r.label}
              accessibilityState={{ selected: isSelected }}
              activeOpacity={0.7}
              style={{
                borderColor: isSelected ? colors.primary : colors.border,
                backgroundColor: isSelected
                  ? colors.primaryLight
                  : colors.surface,
              }}
              className="items-center justify-center py-2.5 px-1 rounded-xl border-[1.5px] min-h-[64px] gap-1"
            >
              <Icon
                size={20}
                color={isSelected ? colors.primary : colors.mutedForeground}
              />
              <Text
                style={{
                  color: isSelected ? colors.primary : colors.mutedForeground,
                  fontFamily: isSelected
                    ? "Montserrat_700Bold"
                    : "Montserrat_500Medium",
                }}
                className={`${isSelected ? "font-bold" : "font-medium"} text-[9px]`}
              >
                {r.label}
              </Text>
              {isSelected && (
                <View
                  className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-primary items-center justify-center"
                >
                  <Text className="text-primary-foreground text-[10px] font-bold">
                    {"\u2713"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}
