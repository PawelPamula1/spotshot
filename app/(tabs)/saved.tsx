import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { dummySpots } from "@/lib/data/dummySpots";

export default function Saved() {
  const savedSpots = dummySpots;

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.heading}>⭐ Saved Spots</Text>

      <ScrollView contentContainerStyle={styles.list}>
        {savedSpots.map((spot) => (
          <TouchableOpacity
            key={spot.id}
            style={styles.card}
            onPress={() => router.push(`/spot/${spot.id}`)}
          >
            <Image source={spot.image} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{spot.name}</Text>
              <Text style={styles.city}>{spot.city}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  image: {
    width: "100%",
    height: 180,
  },
  textContainer: {
    padding: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  city: {
    fontSize: 14,
    color: "#777",
  },
});
