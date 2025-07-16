import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";

export default function PickLocationScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);

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
        <Text>⏳ Ładowanie lokalizacji...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
      />

      <MaterialIcons
        name="location-on"
        size={32}
        color="red"
        style={styles.pin}
      />

      <TouchableOpacity style={styles.button} onPress={handlePickLocation}>
        <Text style={styles.buttonText}>📍 Wybierz lokalizację</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: { flex: 1 },
  pin: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -16,
    marginTop: -32,
    zIndex: 10,
  },
  button: {
    position: "absolute",
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
