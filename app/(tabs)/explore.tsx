import { dummySpots } from "@/lib/data/dummySpots";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        <Text style={styles.header}>Explore Spots</Text>

        {dummySpots.map((spot) => (
          <TouchableOpacity
            key={spot.id}
            style={styles.card}
            onPress={() => router.push(`/spot/${spot.id}`)}
          >
            <Image source={spot.image} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{spot.name}</Text>
              <Text style={styles.city}>{spot.city}</Text>
              <Text style={styles.desc}>{spot.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 16,
    color: "#222",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 180,
  },
  textContainer: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  city: {
    fontSize: 14,
    color: "#888",
    marginBottom: 6,
  },
  desc: {
    fontSize: 13,
    color: "#444",
  },
});
