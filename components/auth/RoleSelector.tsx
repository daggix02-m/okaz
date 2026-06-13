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
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View className="flex-row gap-1.5">
      {ROLES.map((r) => {
        const isSelected = value === r.id;
        const Icon = ICON_COMPONENTS[r.icon];

        const rBorderColor = isSelected
          ? (isDark ? "#ffffff" : colors.primary)
          : (isDark ? "rgba(255,255,255,0.1)" : colors.borderLight);

        const rBgColor = isSelected
          ? (isDark ? "rgba(255,255,255,0.1)" : colors.primaryLight)
          : (isDark ? "#242432" : colors.card);

        const contentColor = isSelected
          ? (isDark ? "#ffffff" : colors.primary)
          : (isDark ? "rgba(255,255,255,0.4)" : colors.textSecondary);

        return (
          <View key={r.id} className="flex-1">
            <TouchableOpacity
              onPress={() => onChange(r.id)}
              accessibilityRole="radio"
              accessibilityLabel={r.label}
              accessibilityState={{ selected: isSelected }}
              activeOpacity={0.7}
              style={{
                borderColor: rBorderColor,
                backgroundColor: rBgColor,
              }}
              className="items-center justify-center py-2.5 px-1 rounded-xl border-[1px] min-h-[68px] gap-1"
            >
              <Icon
                size={18}
                color={contentColor}
              />
              <Text
                style={{
                  color: contentColor,
                  fontFamily: isSelected
                    ? "Montserrat_700Bold"
                    : "Montserrat_500Medium",
                }}
                className={`${isSelected ? "font-bold" : "font-medium"} text-[10px]`}
              >
                {r.label}
              </Text>
              {isSelected && (
                <View
                  style={{
                    backgroundColor: isDark ? "#ffffff" : colors.primary,
                  }}
                  className="absolute -top-1.5 -right-1.5 w-[16px] h-[16px] rounded-full items-center justify-center"
                >
                  <Text style={{ color: isDark ? "#000000" : "#ffffff" }} className="text-[9px] font-bold">
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
