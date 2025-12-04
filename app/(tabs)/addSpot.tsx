import { HeaderLogo } from "@/components/ui/HeaderLogo";
import { Theme } from "@/constants/Theme";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";

export default function PickLocationScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation for pin
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => {
      pulse.stop();
    };
  }, []);

  useEffect(() => {
    const fetchUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Brak dostępu do lokalizacji, używam fallback");
        setRegion({
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setLoading(false);
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setLoading(false);
    };

    fetchUserLocation();
  }, []);

  const handlePickLocation = () => {
    if (!region) return;

    router.push({
      pathname: "/add-spot/add-spot-form",
      params: {
        latitude: region.latitude.toString(),
        longitude: region.longitude.toString(),
      },
    });
  };

  if (loading || !region) {
    return (
      <View style={styles.centered}>
        <Text>⏳ Loading location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: () => <HeaderLogo title="Pick Location" />,
          headerBackTitle: "Cancel",
          headerStyle: {
            backgroundColor: Theme.colors.richBlack,
          },
          headerTintColor: Theme.colors.offWhite,
        }}
      />

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
      />

      {/* Animated Pin */}
      <Animated.View
        style={[
          styles.pinContainer,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <View style={styles.pinGlow} />
        <MaterialIcons
          name="location-on"
          size={48}
          color={Theme.colors.primary}
          style={styles.pin}
        />
      </Animated.View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoIconContainer}>
          <MaterialIcons
            name="info-outline"
            size={20}
            color={Theme.colors.primary}
          />
        </View>
        <Text style={styles.infoText}>
          Move the map to adjust the pin location
        </Text>
      </View>

      {/* Action Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePickLocation}>
          <LinearGradient
            colors={[Theme.colors.primary, Theme.colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <MaterialIcons
              name="check-circle"
              size={24}
              color={Theme.colors.offWhite}
            />
            <Text style={styles.buttonText}>Confirm Location</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.richBlack,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.richBlack,
  },
  map: {
    flex: 1,
  },
  pinContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -24,
    marginTop: -48,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pinGlow: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Theme.colors.primaryGlow,
    opacity: 0.4,
  },
  pin: {
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  infoCard: {
    position: "absolute",
    top: Theme.spacing.lg,
    left: Theme.spacing.md,
    right: Theme.spacing.md,
    backgroundColor: Theme.colors.deepCharcoal,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    ...Theme.shadows.soft,
    borderWidth: 1,
    borderColor: Theme.colors.slate,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.darkNavy,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    flex: 1,
    fontSize: Theme.typography.sizes.bodySmall,
    color: Theme.colors.textMuted,
    fontWeight: Theme.typography.weights.medium,
  },
  buttonContainer: {
    position: "absolute",
    bottom: Platform.select({
      ios: 120,
      android: 40,
    }),
    left: Theme.spacing.md,
    right: Theme.spacing.md,
  },
  button: {
    paddingVertical: Theme.spacing.md + 4,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.radius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.sm,
    ...Theme.shadows.strong,
  },
  buttonText: {
    color: Theme.colors.offWhite,
    fontWeight: Theme.typography.weights.bold,
    fontSize: Theme.typography.sizes.body,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
});
