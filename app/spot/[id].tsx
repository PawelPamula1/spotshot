import { dummySpots } from "@/lib/data/dummySpots";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams();
  const spot = dummySpots.find((s) => s.id === id);

  const [isSaved, setIsSaved] = useState(false);

  if (!spot) return <Text>Spot not found</Text>;

  const handleToggleSaved = () => {
    setIsSaved((prev) => !prev);
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: spot?.name }} />
      <Image source={spot.image} style={styles.image} />
      <Text style={styles.title}>{spot.name}</Text>
      <Text style={styles.city}>{spot.city}</Text>
      <Text style={styles.desc}>{spot.description}</Text>

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/",
            params: {
              latitude: spot.latitude.toString(),
              longitude: spot.longitude.toString(),
            },
          })
        }
        style={styles.mapButton}
      >
        <Text style={styles.mapButtonText}>📍 Pokaż na mapie</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleToggleSaved} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>
          {isSaved ? "✅ Dodano do ulubionych" : "❤️ Dodaj do ulubionych"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.instructions}>📸 Jak zrobić dobre zdjęcie:</Text>
      <Text>- Stań przy barierce z lewej strony mostu</Text>
      <Text>- Użyj obiektywu 50mm</Text>
      <Text>- Najlepiej o złotej godzinie (18:30)</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefefe",
    padding: 16,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  city: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  desc: {
    fontSize: 15,
    color: "#444",
    marginBottom: 24,
    lineHeight: 22,
  },
  mapButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  mapButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#FFD700",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  saveButtonText: {
    color: "#222",
    fontWeight: "600",
    fontSize: 14,
  },
  instructions: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  galleryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 8,
    color: "#333",
  },
});
