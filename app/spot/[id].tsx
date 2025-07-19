import { dummySpots } from "@/lib/data/dummySpots";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams();
  const spot = dummySpots.find((s) => s.id === id);

  const [isSaved, setIsSaved] = useState(false);

  if (!spot) return <Text>Spot not found</Text>;

  const handleToggleSaved = () => {
    setIsSaved((prev) => !prev);
  };

  const handleOpenGoogleMaps = () => {
    const destination = `${spot.latitude},${spot.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;

    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "" }} />

      {/* --- Gradient Header --- */}
      <Image source={spot.image} style={styles.heroImage} />

      {/* --- Author --- */}
      <View style={styles.authorCard}>
        <Image
          source={{
            uri: `https://i.pravatar.cc/150?img=${spot.author.userId}`,
          }}
          style={styles.avatar}
        />
        <Text style={styles.authorText}>
          Dodane przez{" "}
          <Text style={styles.authorName}>{spot.author?.authorName}</Text>
        </Text>
      </View>
      {/* <View style={styles.headerOverlay}>
        <Text style={styles.spotTitle}>{spot.name}</Text>
        <Text style={styles.spotLocation}>
          {spot.city}, {spot.country}
        </Text>
      </View> */}

      {/* --- Description --- */}
      <View style={styles.section}>
        <Text style={styles.description}>{spot.description}</Text>
      </View>

      {/* --- Buttons --- */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          onPress={handleOpenGoogleMaps}
          style={[styles.button, styles.blueGradient]}
        >
          <Text style={styles.buttonText}>📍 Pokaż na mapie</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleOpenGoogleMaps}
          style={[styles.button, styles.greenGradient]}
        >
          <Text style={styles.buttonText}>🧭 Jak tam dojechać</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleToggleSaved}
          style={[styles.button, styles.redGradient]}
        >
          <Text style={styles.buttonText}>
            {isSaved ? "✅ Dodano do ulubionych" : "❤️ Dodaj do ulubionych"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- Tips --- */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>📸 Jak zrobić dobre zdjęcie:</Text>
        <Text style={styles.tip}>
          • Stań przy barierce z lewej strony mostu
        </Text>
        <Text style={styles.tip}>• Użyj obiektywu 50mm</Text>
        <Text style={styles.tip}>• Najlepiej o złotej godzinie (18:30)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  heroImage: {
    width: "100%",
    height: 260,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerOverlay: {
    position: "absolute",
    top: 160,
    left: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 16,
    borderRadius: 18,
    backdropFilter: "blur(6px)",
  },
  spotTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
  },
  spotLocation: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 4,
  },
  authorCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 16,
    padding: 14,
    backgroundColor: "#1E1E1E",
    borderRadius: 18,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  authorText: {
    fontSize: 14,
    color: "#aaa",
  },
  authorName: {
    fontWeight: "600",
    color: "#fff",
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  description: {
    fontSize: 15,
    color: "#ddd",
    lineHeight: 22,
  },
  buttonGroup: {
    marginTop: 28,
    marginHorizontal: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  blueGradient: {
    backgroundColor: "#3B82F6", // vibrant blue
  },
  greenGradient: {
    backgroundColor: "#10B981", // neon green
  },
  redGradient: {
    backgroundColor: "#EC4899", // neon pink
  },
  tipsCard: {
    marginTop: 36,
    marginBottom: 64,
    marginHorizontal: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 18,
    padding: 18,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#fff",
  },
  tip: {
    fontSize: 14,
    color: "#bbb",
    marginBottom: 6,
  },
});
