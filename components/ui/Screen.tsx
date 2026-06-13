import type { ReactNode } from "react";
import type { ScrollViewProps, FlatListProps } from "react-native";
import { View, Text, ScrollView, FlatList } from "react-native";
import { useScreenInsets } from "@/hooks/useScreenInsets";

type ScreenProps = {
  children: ReactNode;
  className?: string;
};

export function Screen({ children, className }: ScreenProps) {
  return (
    <View className={`flex-1 bg-background ${className ?? ""}`} style={{ position: "relative" }}>{children}</View>
  );
}

type ScreenHeaderProps = {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children?: ReactNode;
  bordered?: boolean;
};

export function ScreenHeader({
  title,
  subtitle,
  right,
  children,
  bordered = true,
}: ScreenHeaderProps) {
  const { headerTop } = useScreenInsets();

  return (
    <View
      className={`bg-background px-4 pb-3 ${bordered ? "border-b border-border" : ""}`}
      style={{ paddingTop: headerTop }}
    >
      {children ?? (
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            {title ? (
              <Text className="font-['Montserrat_700Bold'] text-h2 text-foreground">
                {title}
              </Text>
            ) : null}
            {subtitle ? (
              <Text className="mt-0.5 font-['Montserrat_500Medium'] text-caption text-muted-foreground">
                {subtitle}
              </Text>
            ) : null}
          </View>
          {right}
        </View>
      )}
    </View>
  );
}

type ScreenScrollProps = ScrollViewProps & {
  withTabBar?: boolean;
};

export function ScreenScrollView({
  children,
  withTabBar = true,
  contentContainerStyle,
  contentInsetAdjustmentBehavior = "automatic",
  ...props
}: ScreenScrollProps) {
  const { tabContentBottom } = useScreenInsets();

  return (
    <ScrollView
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
      contentContainerStyle={[
        { paddingBottom: withTabBar ? tabContentBottom : 24 },
        contentContainerStyle,
      ]}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

type ScreenListProps<ItemT> = FlatListProps<ItemT> & {
  withTabBar?: boolean;
};

export function ScreenFlatList<ItemT>({
  withTabBar = true,
  contentContainerStyle,
  contentInsetAdjustmentBehavior = "automatic",
  ...props
}: ScreenListProps<ItemT>) {
  const { tabContentBottom } = useScreenInsets();

  return (
    <FlatList
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
      contentContainerStyle={[
        { paddingBottom: withTabBar ? tabContentBottom : 24 },
        contentContainerStyle,
      ]}
      {...props}
    />
  );
}
