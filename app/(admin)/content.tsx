import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";
import { colors, typography, spacing, radius } from "@/lib/design-tokens";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/Skeleton";
import * as Haptics from "expo-haptics";

export default function AdminContent() {
  const insets = useSafeAreaInsets();
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
    <View style={{ flex: 1, backgroundColor: colors.light.background }}>
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.light.border }}>
        <Text style={{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, color: colors.light.text }}>
          Content
        </Text>
      </View>

      <View style={{ padding: spacing.lg }}>
        {/* Add Category */}
        <View style={{ flexDirection: "row", gap: spacing.sm, marginBottom: spacing.xl }}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Category name"
            style={{
              flex: 1,
              backgroundColor: colors.light.surface,
              borderWidth: 1,
              borderColor: colors.light.border,
              borderRadius: radius.sm,
              padding: spacing.md,
              fontSize: typography.body.fontSize,
              color: colors.light.text,
              minHeight: 48,
            }}
            accessibilityLabel="Category name"
          />
          <TextInput
            value={icon}
            onChangeText={setIcon}
            placeholder="Icon"
            style={{
              width: 80,
              backgroundColor: colors.light.surface,
              borderWidth: 1,
              borderColor: colors.light.border,
              borderRadius: radius.sm,
              padding: spacing.md,
              fontSize: typography.body.fontSize,
              color: colors.light.text,
              minHeight: 48,
              textAlign: "center",
            }}
            accessibilityLabel="Icon name"
          />
          <TouchableOpacity
            onPress={handleAdd}
            style={{
              backgroundColor: colors.light.primary,
              borderRadius: radius.sm,
              paddingHorizontal: spacing.lg,
              minHeight: 48,
              justifyContent: "center",
              alignItems: "center",
            }}
            accessibilityLabel="Add category"
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Category List */}
        <Text style={{ fontWeight: "700", fontSize: 13, marginBottom: spacing.md, color: colors.light.text }}>
          Existing Categories
        </Text>

        {!categories ? (
          <View style={{ gap: spacing.sm }}>
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} height={48} />)}
          </View>
        ) : categories.length === 0 ? (
          <Text style={{ color: colors.light.textSecondary, textAlign: "center", padding: spacing.xl }}>
            No categories yet
          </Text>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
            {categories.map((cat) => (
              <View
                key={cat._id}
                style={{
                  backgroundColor: colors.light.surface,
                  borderRadius: radius.sm,
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.md,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: "600" }}>{cat.icon}</Text>
                <Text style={{ fontSize: 13, fontWeight: "600" }}>{cat.name}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
