import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  LogOut,
  Sliders,
  MapPin,
  Upload,
  Navigation,
  Store,
  Save,
} from "lucide-react-native";
import * as Location from "expo-location";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMyStores } from "@/hooks/useStores";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/hooks/useTheme";
import { Screen, ScreenHeader, ScreenScrollView } from "@/components/ui/Screen";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Image } from "expo-image";
import { getResolvedStoreImage } from "@/lib/image-helper";
import * as Haptics from "expo-haptics";

const LANDMARKS = [
  { name: "Piazza", x: 25, y: 22 },
  { name: "Bole Medhane Alem", x: 72, y: 48 },
  { name: "Meskel Square", x: 48, y: 38 },
  { name: "Mercato", x: 18, y: 32 },
  { name: "Bole Airport", x: 80, y: 68 },
  { name: "Sarbet", x: 30, y: 55 },
];

const minLat = 8.98;
const maxLat = 9.08;
const minLng = 38.70;
const maxLng = 38.80;

export default function VendorSettings() {
  const { colors, theme } = useTheme();
  const { signOut } = useAuthActions();
  const stores = useMyStores();
  const activeStore = stores?.[0];

  const paySubscription = useMutation(api.stores.paySubscription);
  const requestSponsorship = useMutation(api.stores.requestSponsorship);
  const updateMeta = useMutation(api.stores.updateMeta);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const saveStoreImage = useMutation(api.storage.saveStoreImage);

  // Store profile states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [lat, setLat] = useState(9.03);
  const [lng, setLng] = useState(38.74);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });

  // Initialize values when store loads
  useEffect(() => {
    if (activeStore) {
      setName(activeStore.name);
      setDescription(activeStore.description || "");
      setLocationName(activeStore.locationName);
      setLat(activeStore.lat);
      setLng(activeStore.lng);
    }
  }, [activeStore]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => signOut() },
    ]);
  };

  const handleFetchGPS = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Please allow GPS access in settings to fetch location.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      const clampedLat = Math.max(minLat, Math.min(maxLat, latitude));
      const clampedLng = Math.max(minLng, Math.min(maxLng, longitude));

      setLat(clampedLat);
      setLng(clampedLng);
      Alert.alert("GPS Success", "Fetched coordinates successfully and clamped inside Addis Ababa!");
    } catch (err) {
      console.error(err);
      Alert.alert("GPS Error", "Failed to fetch GPS coordinates.");
    }
  };

  const handleMapPress = (e: any) => {
    const { locationX, locationY } = e.nativeEvent;
    if (mapSize.width > 0 && mapSize.height > 0) {
      const xPercent = (locationX / mapSize.width) * 100;
      const yPercent = (locationY / mapSize.height) * 100;

      const newLng = minLng + (xPercent / 100) * (maxLng - minLng);
      const newLat = minLat + (1 - yPercent / 100) * (maxLat - minLat);

      const clampedLat = Math.max(minLat, Math.min(maxLat, newLat));
      const clampedLng = Math.max(minLng, Math.min(maxLng, newLng));

      setLat(clampedLat);
      setLng(clampedLng);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleLogoUpload = async () => {
    if (Platform.OS !== "web") {
      Alert.alert("Feature unavailable", "File upload is optimized for the web/WebMobileShell environment.");
      return;
    }

    if (!activeStore) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!response.ok) throw new Error("Upload failed");
        const { storageId } = await response.json();

        await saveStoreImage({
          storageId,
          storeId: activeStore._id,
        });

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Success", "Logo uploaded successfully!");
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to upload logo.");
      } finally {
        setIsUploading(false);
      }
    };
    input.click();
  };

  const handleSaveMeta = async () => {
    if (!activeStore) return;
    if (!name.trim()) {
      Alert.alert("Validation", "Store Name is required.");
      return;
    }
    if (!locationName.trim()) {
      Alert.alert("Validation", "Location/Address is required.");
      return;
    }

    setIsSaving(true);
    try {
      await updateMeta({
        storeId: activeStore._id,
        name: name.trim(),
        description: description.trim(),
        locationName: locationName.trim(),
        lat,
        lng,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Store details updated successfully!");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save details.");
    } finally {
      setIsSaving(false);
    }
  };

  // Convert coords for map pin positioning
  const getCoordinates = (latitude: number, longitude: number) => {
    const x = ((longitude - minLng) / (maxLng - minLng)) * 100;
    const y = (1 - (latitude - minLat) / (maxLat - minLat)) * 100;

    return {
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(15, Math.min(80, y)),
    };
  };

  const pinCoords = getCoordinates(lat, lng);

  return (
    <Screen>
      <ScreenHeader title="Settings" right={<ThemeToggle size={20} />} />
      <ScreenScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="gap-6">
          
          {activeStore ? (
            <>
              {/* Store Details Card */}
              <View className="rounded-2xl border border-border bg-card p-5 shadow-sm gap-4">
                <View className="flex-row items-center gap-2 pb-2 border-b border-border/40">
                  <Store size={20} color={colors.primary} />
                  <Text className="font-['Montserrat_700Bold'] text-base font-bold text-foreground">
                    Store Details
                  </Text>
                </View>

                {/* Name */}
                <View className="gap-1.5">
                  <Text className="font-['Montserrat_600SemiBold'] text-xs text-muted-foreground uppercase tracking-wider">
                    Store Name
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter store name"
                    placeholderTextColor={colors.mutedForeground}
                    className="rounded-xl border border-border bg-surface px-4 py-3 text-base text-foreground font-['Montserrat_500Medium'] min-h-[48px]"
                  />
                </View>

                {/* Description */}
                <View className="gap-1.5">
                  <Text className="font-['Montserrat_600SemiBold'] text-xs text-muted-foreground uppercase tracking-wider">
                    Description
                  </Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter store description"
                    placeholderTextColor={colors.mutedForeground}
                    multiline
                    numberOfLines={3}
                    className="rounded-xl border border-border bg-surface px-4 py-3 text-base text-foreground font-['Montserrat_500Medium'] min-h-[80px]"
                    style={{ textAlignVertical: "top" }}
                  />
                </View>

                {/* Location Name */}
                <View className="gap-1.5">
                  <Text className="font-['Montserrat_600SemiBold'] text-xs text-muted-foreground uppercase tracking-wider">
                    Address / Location Name
                  </Text>
                  <TextInput
                    value={locationName}
                    onChangeText={setLocationName}
                    placeholder="e.g. Bole Medhane Alem, Mall 2F"
                    placeholderTextColor={colors.mutedForeground}
                    className="rounded-xl border border-border bg-surface px-4 py-3 text-base text-foreground font-['Montserrat_500Medium'] min-h-[48px]"
                  />
                </View>
              </View>

              {/* Logo Card */}
              <View className="rounded-2xl border border-border bg-card p-5 shadow-sm gap-4">
                <View className="flex-row items-center gap-2 pb-2 border-b border-border/40">
                  <Upload size={20} color={colors.primary} />
                  <Text className="font-['Montserrat_700Bold'] text-base font-bold text-foreground">
                    Store Logo
                  </Text>
                </View>

                <View className="flex-row items-center gap-5">
                  <View className="relative w-20 h-20 rounded-2xl bg-surface border border-border overflow-hidden items-center justify-center">
                    {isUploading ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                      <Image
                        source={{ uri: getResolvedStoreImage(activeStore) }}
                        className="w-full h-full"
                        contentFit="cover"
                      />
                    )}
                  </View>

                  <View className="flex-1 gap-2">
                    <Text className="font-['Montserrat_500Medium'] text-xs text-muted-foreground">
                      Upload your high-resolution shop logo to represent your brand on the custom map pins.
                    </Text>
                    <TouchableOpacity
                      onPress={handleLogoUpload}
                      disabled={isUploading}
                      className="flex-row items-center justify-center rounded-xl bg-primary/10 border border-primary/20 p-2.5 min-h-[44px]"
                    >
                      <Upload size={16} color={colors.primary} />
                      <Text className="ml-2 font-['Montserrat_700Bold'] text-xs text-primary">
                        {isUploading ? "Uploading..." : "Select File"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Coordinates Map Picker Card */}
              <View className="rounded-2xl border border-border bg-card p-5 shadow-sm gap-4">
                <View className="flex-row items-center justify-between pb-2 border-b border-border/40">
                  <View className="flex-row items-center gap-2">
                    <MapPin size={20} color={colors.primary} />
                    <Text className="font-['Montserrat_700Bold'] text-base font-bold text-foreground">
                      Store Location
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleFetchGPS}
                    className="flex-row items-center bg-primary/10 border border-primary/25 rounded-lg px-2.5 py-1.5"
                  >
                    <Navigation size={12} color={colors.primary} />
                    <Text className="ml-1.5 font-['Montserrat_700Bold'] text-[10px] text-primary">
                      GPS Fetch
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text className="font-['Montserrat_500Medium'] text-xs text-muted-foreground">
                  Tap anywhere on the Addis Ababa grid map below to manually adjust and set your precise shop coordinates.
                </Text>

                {/* Mini Interactive Map container */}
                <View
                  onLayout={(e) => {
                    const { width, height } = e.nativeEvent.layout;
                    setMapSize({ width, height });
                  }}
                  onStartShouldSetResponder={() => true}
                  onResponderGrant={handleMapPress}
                  className="w-full h-48 rounded-xl bg-muted/10 border border-border overflow-hidden relative"
                >
                  {/* Grid Lines */}
                  <View className="absolute inset-0 flex-col justify-between p-2 opacity-5">
                    {[...Array(6)].map((_, i) => (
                      <View key={`row-${i}`} className="w-full h-[1px] bg-foreground" />
                    ))}
                  </View>
                  <View className="absolute inset-0 flex-row justify-between p-2 opacity-5">
                    {[...Array(6)].map((_, i) => (
                      <View key={`col-${i}`} className="h-full w-[1px] bg-foreground" />
                    ))}
                  </View>

                  {/* Mock Roads */}
                  <View className="absolute w-[200%] h-3 bg-muted/20 border-y border-muted-foreground/10 rotate-[25deg]" />
                  <View className="absolute w-[200%] h-1.5 bg-muted/20 border-y border-muted-foreground/10 rotate-[-40deg]" />
                  <View className="absolute w-[200%] h-4 bg-muted/20 border-y border-muted-foreground/10 top-[42%]" />
                  <View className="absolute w-[200%] h-2.5 bg-muted/20 border-y border-muted-foreground/10 left-[35%] rotate-[75deg]" />

                  {/* Addis Ababa Landmarks */}
                  {LANDMARKS.map((landmark) => (
                    <View
                      key={landmark.name}
                      className="absolute items-center opacity-30"
                      style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
                    >
                      <View className="w-1 h-1 rounded-full bg-foreground/60 mb-0.5" />
                      <Text className="text-[7px] font-medium tracking-wide text-foreground font-['Montserrat_500Medium']">
                        {landmark.name}
                      </Text>
                    </View>
                  ))}

                  {/* Selected Location Pin */}
                  <View
                    className="absolute items-center justify-center"
                    style={{
                      left: `${pinCoords.x}%`,
                      top: `${pinCoords.y}%`,
                      transform: [{ translateX: -12 }, { translateY: -12 }],
                    }}
                  >
                    <View className="w-6 h-6 rounded-full bg-primary border border-surface shadow items-center justify-center overflow-hidden">
                      <Image
                        source={{ uri: getResolvedStoreImage(activeStore) }}
                        className="w-full h-full"
                        contentFit="cover"
                      />
                    </View>
                  </View>
                </View>

                {/* Coordinate Readout */}
                <View className="flex-row justify-between border-t border-border/40 pt-3">
                  <View className="items-center bg-surface rounded-xl px-4 py-2 border border-border/60 flex-1 mr-2">
                    <Text className="font-['Montserrat_500Medium'] text-[10px] text-muted-foreground uppercase tracking-wider">
                      Latitude
                    </Text>
                    <Text className="font-['Montserrat_700Bold'] text-sm text-foreground font-bold tabular-nums mt-0.5">
                      {lat.toFixed(6)}
                    </Text>
                  </View>
                  <View className="items-center bg-surface rounded-xl px-4 py-2 border border-border/60 flex-1 ml-2">
                    <Text className="font-['Montserrat_500Medium'] text-[10px] text-muted-foreground uppercase tracking-wider">
                      Longitude
                    </Text>
                    <Text className="font-['Montserrat_700Bold'] text-sm text-foreground font-bold tabular-nums mt-0.5">
                      {lng.toFixed(6)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Save Configuration Button */}
              <TouchableOpacity
                onPress={handleSaveMeta}
                disabled={isSaving}
                className="flex-row items-center justify-center rounded-xl bg-primary p-4 shadow-md min-h-[52px]"
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color={colors.primaryForeground} />
                ) : (
                  <>
                    <Save size={18} color={colors.primaryForeground} />
                    <Text className="ml-2 font-['Montserrat_700Bold'] text-base font-bold text-primary-foreground">
                      Save Coordinates & Metadata
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Subscription Details Card */}
              <View className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <View className="mb-3 flex-row items-center gap-2 pb-2 border-b border-border/40">
                  <Sliders size={20} color={colors.primary} />
                  <Text className="font-['Montserrat_700Bold'] text-base font-bold text-foreground">
                    Subscription
                  </Text>
                </View>
                <Text className="font-['Montserrat_500Medium'] text-sm text-muted-foreground">
                  Month {activeStore.subscriptionMonth} ·{" "}
                  <Text className={activeStore.subscriptionActive ? "text-success font-bold" : "text-destructive font-bold"}>
                    {activeStore.subscriptionActive ? "Active" : "Suspended"}
                  </Text>
                </Text>
                <Text className="mt-2 font-['Montserrat_500Medium'] text-caption text-muted-foreground">
                  Monthly fee: 100 ETB
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    paySubscription({ storeId: activeStore._id });
                    Alert.alert("Success", "Subscription paid!");
                  }}
                  className="mt-4 min-h-[48px] items-center justify-center rounded-xl bg-primary p-3"
                  accessibilityLabel="Pay subscription"
                >
                  <Text className="font-['Montserrat_700Bold'] font-bold text-primary-foreground">
                    Pay Monthly Fee (100 ETB)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    requestSponsorship({ storeId: activeStore._id });
                    Alert.alert("Success", "Sponsorship activated!");
                  }}
                  className="mt-2.5 min-h-[48px] items-center justify-center rounded-xl bg-warning p-3"
                  accessibilityLabel="Request sponsorship"
                >
                  <Text className="font-['Montserrat_700Bold'] font-bold text-warning-foreground">
                    Request Sponsorship (150 ETB)
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View className="p-10 items-center justify-center">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="mt-4 text-muted-foreground font-['Montserrat_500Medium']">
                Loading store details...
              </Text>
            </View>
          )}

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="min-h-[48px] flex-row items-center justify-center rounded-xl p-3 border border-destructive/20"
            style={{ backgroundColor: colors.destructiveLight }}
            accessibilityLabel="Logout"
          >
            <LogOut size={18} color={colors.destructive} />
            <Text className="ml-2 font-['Montserrat_700Bold'] font-bold text-destructive">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenScrollView>
    </Screen>
  );
}
