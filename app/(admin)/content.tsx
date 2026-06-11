import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import { Plus } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { Screen, ScreenHeader, ScreenScrollView } from "@/components/ui/Screen";
import * as Haptics from "expo-haptics";

export default function AdminContent() {
  const { colors } = useTheme();
  const categories = useQuery(api.categories.list);
  const createCategory = useMutation(api.categories.create);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("shopping-bag");

  const handleAdd = async () => {
    if (!name.trim()) return;
    await createCategory({ name, icon });
    setName("");
    setIcon("shopping-bag");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <Screen>
      <ScreenHeader title="Content" />
      <ScreenScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="mb-6 flex-row gap-2">
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Category name"
            placeholderTextColor={colors.mutedForeground}
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
              color: colors.foreground,
            }}
            className="min-h-12 flex-1 rounded-lg border p-3 text-base"
            accessibilityLabel="Category name"
          />
          <TextInput
            value={icon}
            onChangeText={setIcon}
            placeholder="Icon"
            placeholderTextColor={colors.mutedForeground}
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
              color: colors.foreground,
            }}
            className="min-h-12 w-20 rounded-lg border p-3 text-center text-base"
            accessibilityLabel="Icon name"
          />
          <TouchableOpacity
            onPress={handleAdd}
            className="min-h-12 items-center justify-center rounded-lg bg-primary px-4"
            accessibilityLabel="Add category"
          >
            <Plus size={20} color={colors.primaryForeground} />
          </TouchableOpacity>
        </View>

        <Text className="mb-3 font-['Montserrat_700Bold'] text-xs font-bold text-foreground">
          Existing Categories
        </Text>

        {!categories ? (
          <View className="gap-2">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} height={48} />)}
          </View>
        ) : categories.length === 0 ? (
          <Text className="p-6 text-center text-muted-foreground">No categories yet</Text>
        ) : (
          <View className="flex-row flex-wrap gap-2">
            {categories.map((cat) => (
              <View
                key={cat._id}
                className="flex-row items-center gap-2 rounded-lg bg-surface px-4 py-3"
              >
                <Text className="font-['Montserrat_500Medium'] text-[13px] font-medium text-foreground">
                  {cat.icon}
                </Text>
                <Text className="font-['Montserrat_500Medium'] text-[13px] font-medium text-foreground">
                  {cat.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScreenScrollView>
    </Screen>
  );
}
