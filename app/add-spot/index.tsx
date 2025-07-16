import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";

export default function PickLocationScreen() {
  const params = useLocalSearchParams();

  const latitude = Array.isArray(params.latitude)
    ? parseFloat(params.latitude[0])
    : parseFloat(params.latitude ?? "48.8566");

  const longitude = Array.isArray(params.longitude)
    ? parseFloat(params.longitude[0])
    : parseFloat(params.longitude ?? "2.3522");

  const [region, setRegion] = useState<Region>({
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const handlePickLocation = () => {
    router.push({
      pathname: "/add-spot/add-spot-form",
      params: {
        latitude: region.latitude.toString(),
        longitude: region.longitude.toString(),
      },
    });
  };

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
