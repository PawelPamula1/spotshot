import { getSpots } from "@/lib/api/spots";
import { useAuth } from "@/provider/AuthProvider";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
  const { latitude, longitude } = useLocalSearchParams();

  const [spots, setSpots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const data = await getSpots();
        setSpots(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSpots();
  }, []);

  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      const region: Region = {
        latitude: parseFloat(String(latitude)),
        longitude: parseFloat(String(longitude)),
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [latitude, longitude]);

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
        <Text>Wystąpił błąd podczas ładowania danych.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
      >
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{
              latitude: spot.latitude,
              longitude: spot.longitude,
            }}
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
    </SafeAreaView>
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
