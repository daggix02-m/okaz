import { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import {
  ChevronLeft,
  Search,
  MapPin,
  Star,
  Navigation,
  Info,
  Compass,
  ArrowRight,
  ShoppingBag,
  Smartphone,
  Laptop,
  Shirt,
  Sparkles,
} from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useStores } from "@/hooks/useStores";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";

const LANDMARKS = [
  { name: "Piazza", x: 25, y: 22 },
  { name: "Bole Medhane Alem", x: 72, y: 48 },
  { name: "Meskel Square", x: 48, y: 38 },
  { name: "Mercato", x: 18, y: 32 },
  { name: "Bole Airport", x: 80, y: 68 },
  { name: "Sarbet", x: 30, y: 55 },
];

export default function CustomerMap() {
  const { colors } = useTheme();
  const insets = useScreenInsets();
  const stores = useStores();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  // Filter stores based on search query
  const filteredStores = useMemo(() => {
    if (!stores) return [];
    if (!searchQuery.trim()) return stores;
    const q = searchQuery.toLowerCase();
    return stores.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.locationName && s.locationName.toLowerCase().includes(q))
    );
  }, [stores, searchQuery]);

  // Find currently selected store
  const selectedStore = useMemo(() => {
    return filteredStores.find((s) => s._id === selectedStoreId) || null;
  }, [filteredStores, selectedStoreId]);

  // Normalization boundaries for Addis Ababa coordinates mapping
  const getCoordinates = (lat: number, lng: number) => {
    const minLat = 8.98;
    const maxLat = 9.08;
    const minLng = 38.70;
    const maxLng = 38.80;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;

    return {
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(15, Math.min(80, y)),
    };
  };

  const handleSelectStore = (storeId: string) => {
    setSelectedStoreId(storeId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const renderStoreIcon = (category: string, size = 16, color: string = colors.primary) => {
    switch (category.toLowerCase()) {
      case "phone": return <Smartphone size={size} color={color} />;
      case "electronics": return <Laptop size={size} color={color} />;
      case "cloth": return <Shirt size={size} color={color} />;
      case "cosmetics": return <Sparkles size={size} color={color} />;
      default: return <ShoppingBag size={size} color={color} />;
    }
  };

  return (
    <Screen>
      <View className="flex-1 relative bg-background">
        
        {/* Header Overlay */}
        <View 
          className="absolute left-4 right-4 z-10 flex-row gap-1.5 items-center"
          style={{ top: insets.top + 8 }}
        >
          <TouchableOpacity
            onPress={() => {
              router.back();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            className="w-12 h-12 rounded-2xl items-center justify-center border border-border bg-surface shadow-lg"
          >
            <ChevronLeft size={22} color={colors.foreground} />
          </TouchableOpacity>

          <View 
            className="flex-1 flex-row items-center rounded-xl border border-border bg-surface px-3 min-h-[48px] shadow-lg"
          >
            <Search size={18} color={colors.mutedForeground} />
            <TextInput
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                if (selectedStoreId) setSelectedStoreId(null);
              }}
              placeholder="Search stores, categories..."
              placeholderTextColor={colors.mutedForeground}
              className="flex-1 p-3 text-base text-foreground font-['Montserrat_400Regular'] min-h-[48px]"
            />
          </View>

          <View className="w-12 h-12 rounded-2xl items-center justify-center border border-border bg-surface shadow-lg">
            <ThemeToggle size={20} />
          </View>
        </View>

        {/* Map Area */}
        <View className="flex-1 overflow-hidden bg-muted/10 items-center justify-center relative">
          
          {/* Grid Gridlines to look like map */}
          <View className="absolute inset-0 flex-col justify-between p-2 opacity-5">
            {[...Array(12)].map((_, i) => (
              <View key={`row-${i}`} className="w-full h-[1px] bg-foreground" />
            ))}
          </View>
          <View className="absolute inset-0 flex-row justify-between p-2 opacity-5">
            {[...Array(12)].map((_, i) => (
              <View key={`col-${i}`} className="h-full w-[1px] bg-foreground" />
            ))}
          </View>

          {/* Compass / Location Indicator */}
          <View 
            className="absolute right-4 bg-surface/90 rounded-full p-2.5 border border-border/60 shadow-sm"
            style={{ top: insets.top + 68 }}
          >
            <Compass size={18} color={colors.primary} />
          </View>

          {/* Mock Road Network (Double line lanes for premium visual) */}
          <View className="absolute w-[200%] h-4 bg-muted/20 border-y border-muted-foreground/10 rotate-[25deg]" />
          <View className="absolute w-[200%] h-2 bg-muted/20 border-y border-muted-foreground/10 rotate-[-40deg]" />
          <View className="absolute w-[200%] h-6 bg-muted/20 border-y border-muted-foreground/10 top-[42%]" />
          <View className="absolute w-[200%] h-3 bg-muted/20 border-y border-muted-foreground/10 left-[35%] rotate-[75deg]" />

          {/* Addis Ababa Landmarks to add high-fidelity detail */}
          {LANDMARKS.map((landmark) => (
            <View
              key={landmark.name}
              className="absolute items-center opacity-30"
              style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
            >
              <View className="w-1.5 h-1.5 rounded-full bg-foreground/60 mb-0.5" />
              <Text className="text-[8px] font-medium tracking-wide text-foreground font-['Montserrat_500Medium']">
                {landmark.name}
              </Text>
            </View>
          ))}

          {/* User Location Marker with direction beam and radar pulse */}
          <View 
            className="absolute items-center justify-center"
            style={{ left: "50%", top: "45%" }}
          >
            {/* Pulsing Radar Ring */}
            <View 
              className="w-10 h-10 rounded-full bg-primary/10 absolute items-center justify-center"
              style={{
                transform: [{ scale: 1.2 }],
              }}
            />
            {/* Direction Beam (Radar Cone) */}
            <View 
              className="absolute w-24 h-24 bg-primary/5 rounded-full"
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                transform: [{ rotate: "-45deg" }],
                clipPath: "polygon(0 0, 100% 0, 100% 100%)",
              } as any}
            />
            <View className="w-5 h-5 rounded-full bg-primary border-2 border-surface shadow-md items-center justify-center" />
            <Text className="text-[9px] font-bold text-primary mt-1 font-['Montserrat_700Bold'] shadow-sm">
              Your Location
            </Text>
          </View>

          {/* Store Location Markers */}
          {filteredStores.map((store) => {
            const coords = getCoordinates(store.lat || 9.03, store.lng || 38.74);
            const isSelected = selectedStoreId === store._id;

            return (
              <TouchableOpacity
                key={store._id}
                onPress={() => handleSelectStore(store._id)}
                className="absolute items-center justify-center p-2"
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                  transform: [{ translateX: -16 }, { translateY: -16 }],
                }}
              >
                <View 
                  className="rounded-full items-center justify-center shadow-lg border-2 overflow-hidden"
                  style={{
                    width: isSelected ? 42 : 34,
                    height: isSelected ? 42 : 34,
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.surface : colors.primary,
                    shadowColor: colors.primary,
                    shadowOpacity: isSelected ? 0.35 : 0.15,
                    shadowRadius: isSelected ? 8 : 4,
                  }}
                >
                  {store.imageUrl ? (
                    <Image
                      source={{ uri: store.imageUrl }}
                      className="w-full h-full rounded-full"
                      contentFit="cover"
                    />
                  ) : (
                    renderStoreIcon(
                      store.category, 
                      isSelected ? 18 : 14, 
                      isSelected ? colors.primaryForeground : colors.primary
                    )
                  )}
                </View>
                {isSelected && (
                  <View 
                    className="mt-1 px-2.5 py-1 rounded-md shadow-md border border-border"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <Text className="text-[10px] font-bold text-foreground font-['Montserrat_700Bold']">
                      {store.name}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected Store / Carousel Bottom Overlay */}
        <View 
          className="absolute left-0 right-0 z-10 px-4"
          style={{ bottom: insets.tabContentBottom }}
        >
          {selectedStore ? (
            <TouchableOpacity
              onPress={() => {
                router.push(`/store/${selectedStore._id}`);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              activeOpacity={0.9}
              className="rounded-2xl border border-border p-4 shadow-xl flex-row items-center gap-3.5"
              style={{ backgroundColor: colors.surface }}
            >
              <View 
                className="w-14 h-14 rounded-xl bg-primary/10 items-center justify-center border border-primary/20 overflow-hidden"
              >
                {selectedStore.imageUrl ? (
                  <Image
                    source={{ uri: selectedStore.imageUrl }}
                    className="w-full h-full"
                    contentFit="cover"
                  />
                ) : (
                  renderStoreIcon(selectedStore.category, 26, colors.primary)
                )}
              </View>

              <View className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-sm font-bold text-foreground font-['Montserrat_700Bold']" numberOfLines={1}>
                    {selectedStore.name}
                  </Text>
                  <View className="flex-row items-center bg-accent/15 px-1.5 py-0.5 rounded">
                    <Star size={9} color={colors.accent} fill={colors.accent} />
                    <Text className="text-[9px] font-bold text-accent ml-0.5 font-['Montserrat_700Bold']">
                      {selectedStore.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>

                <Text className="text-[11px] text-muted-foreground mt-0.5 font-['Montserrat_500Medium']" numberOfLines={1}>
                  {selectedStore.category} • {selectedStore.locationName}
                </Text>

                <View className="flex-row items-center gap-1 mt-1.5">
                  <Navigation size={11} color={colors.primary} />
                  <Text className="text-[10px] font-semibold text-primary font-['Montserrat_600SemiBold']">
                    10-15 mins • Delivery Area
                  </Text>
                </View>
              </View>

              <View className="w-8 h-8 rounded-full items-center justify-center bg-primary/10 border border-primary/25">
                <ArrowRight size={16} color={colors.primary} />
              </View>
            </TouchableOpacity>
          ) : (
            <View 
              className="rounded-2xl border border-border p-4 shadow-lg flex-row items-center gap-3"
              style={{ backgroundColor: colors.surface }}
            >
              <Info size={18} color={colors.primary} />
              <View className="flex-1">
                <Text className="text-xs font-bold text-foreground font-['Montserrat_700Bold']">
                  Browse Stores Nearby
                </Text>
                <Text className="text-[10px] text-muted-foreground font-['Montserrat_400Regular']">
                  Tap any marker on the map to view nearby store information, ratings, and to enter their online shop catalog.
                </Text>
              </View>
            </View>
          )}

          {/* Mini Horizontal Store Scroller */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3.5"
            contentContainerStyle={{ gap: 8 }}
          >
            {filteredStores.map((store) => {
              const isSelected = selectedStoreId === store._id;
              return (
                <TouchableOpacity
                  key={`scroll-${store._id}`}
                  onPress={() => handleSelectStore(store._id)}
                  className="px-3.5 py-2 rounded-full border flex-row items-center gap-1.5 shadow-sm"
                  style={{
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  }}
                >
                  {store.imageUrl ? (
                    <Image
                      source={{ uri: store.imageUrl }}
                      className="w-4 h-4 rounded-full"
                      contentFit="cover"
                    />
                  ) : (
                    renderStoreIcon(store.category, 12, isSelected ? colors.primaryForeground : colors.mutedForeground)
                  )}
                  <Text 
                    className="text-[11px] font-bold font-['Montserrat_700Bold']"
                    style={{ color: isSelected ? colors.primaryForeground : colors.foreground }}
                  >
                    {store.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

      </View>
    </Screen>
  );
}
