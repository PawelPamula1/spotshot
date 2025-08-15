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
            coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
            title={spot.name}
          >
            <Callout
              tooltip
              onPress={() =>
                isAuthenticated
                  ? router.push(`/spot/${spot.id}`)
                  : router.push("/login")
              }
            >
              <View style={styles.callout}>
                <Image
                  source={{ uri: spot.image }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <Text style={styles.name}>{spot.name}</Text>
                <Text style={styles.city}>{spot.city}</Text>
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
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  callout: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    width: 160,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 6,
  },
  name: {
    marginTop: 6,
    fontWeight: "bold",
    flexWrap: "wrap",
  },
  city: {
    color: "#888",
  },
});
