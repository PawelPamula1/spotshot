import { Theme } from "@/constants/Theme";
import { useSpots } from "@/hooks/useSpots";
import { useAuth } from "@/provider/AuthProvider";
import type { Spot } from "@/types/spot";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SpotsScreen() {
  const mapRef = useRef<MapView>(null);
  const { latitude, longitude } = useLocalSearchParams<{
    latitude?: string;
    longitude?: string;
  }>();
  const { isAuthenticated } = useAuth();
  const { allSpots: spots, loading, error } = useSpots();

  const [mapReady, setMapReady] = useState(false);

  const targetRegion = useMemo<Region | null>(() => {
    if (!latitude || !longitude) return null;
    const lat = Number(latitude);
    const lon = Number(longitude);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
    return {
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }, [latitude, longitude]);

  const focusIfPossible = () => {
    if (mapRef.current && targetRegion) {
      mapRef.current.animateToRegion(targetRegion, 2000);
    }
  };

  const handleMapReady = () => {
    setMapReady(true);
    focusIfPossible();
  };

  useEffect(() => {
    if (mapReady) focusIfPossible();
  }, [mapReady, targetRegion]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Error loading the data</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        onMapReady={handleMapReady}
      >
        {spots.map((spot: Spot) => (
          <Marker
            key={spot.id}
            pinColor="#6D5FFD"
            coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
            title={spot.name}
          >
            <Callout
              tooltip
              onPress={() =>
                isAuthenticated
                  ? router.push(`/spot/${spot.id}`)
                  : router.push("/(tabs)/login")
              }
            >
              <View style={styles.callout}>
                {/* Film border for callout */}
                <View style={styles.filmBorder}>
                  <View style={styles.cornerMarker} />
                  <View style={[styles.cornerMarker, styles.cornerTopRight]} />

                  <Image
                    source={{ uri: spot.image }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>

                <View style={styles.textContainer}>
                  <View style={styles.locationBadge}>
                    <Text style={styles.city}>{spot.city}</Text>
                  </View>
                  <Text style={styles.name} numberOfLines={2}>
                    {spot.name}
                  </Text>
                  <View style={styles.accentLine} />
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.richBlack,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  callout: {
    backgroundColor: Theme.colors.deepCharcoal,
    borderRadius: Theme.radius.lg,
    overflow: "hidden",
    width: 200,
    ...Theme.shadows.strong,
  },
  filmBorder: {
    position: "relative",
  },
  cornerMarker: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: Theme.colors.primary,
    zIndex: 2,
    top: 0,
    left: 0,
    borderRadius: 2,
  },
  cornerTopRight: {
    left: undefined,
    right: 0,
  },
  image: {
    width: "100%",
    height: 120,
    backgroundColor: Theme.colors.slate,
  },
  textContainer: {
    padding: Theme.spacing.md,
    gap: Theme.spacing.xs,
  },
  locationBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 3,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.sm,
    marginBottom: 2,
  },
  city: {
    fontSize: 9,
    color: Theme.colors.offWhite,
    fontWeight: Theme.typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  name: {
    fontSize: Theme.typography.sizes.bodySmall,
    fontWeight: Theme.typography.weights.semibold,
    lineHeight:
      Theme.typography.sizes.bodySmall * Theme.typography.lineHeights.tight,
    color: Theme.colors.textLight,
  },
  accentLine: {
    width: 30,
    height: 3,
    backgroundColor: Theme.colors.primary,
    marginTop: 4,
    borderRadius: 2,
  },
});
