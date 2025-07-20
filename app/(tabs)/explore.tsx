import { Filters } from "@/components/Filters";
import { getSpots } from "@/lib/api/spots"; // zakładam że tu masz funkcję do pobierania spotów
import { Spot } from "@/types/spot"; // zakładam, że masz typ Spot
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [allSpots, setAllSpots] = useState<Spot[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = useColorScheme() ?? "light";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSpots();
        setAllSpots(data);
        setFilteredSpots(data);
      } catch (error) {
        console.error("Failed to fetch spots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    const query = text.toLowerCase();
    const filtered = allSpots.filter((spot) => {
      return (
        spot.name.toLowerCase().includes(query) ||
        spot.city.toLowerCase().includes(query) ||
        spot.description.toLowerCase().includes(query)
      );
    });
    setFilteredSpots(filtered);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 24 },
      ]}
    >
      <Stack.Screen
        options={{
          title: "Explore Spots",
          headerSearchBarOptions: {
            placeholder: "Search",
            onChangeText: (e) => handleSearch(e.nativeEvent.text),
          },
        }}
      />

      <Filters onFilter={(filtered) => setFilteredSpots(filtered)} />

      {search ? (
        <Text style={{ color: theme === "light" ? "#000" : "#fff" }}>
          Search for "{search}"
        </Text>
      ) : null}

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : filteredSpots.length === 0 ? (
        <Text style={styles.loading}>No results found</Text>
      ) : (
        filteredSpots.map((spot) => (
          <TouchableOpacity
            key={spot.id}
            style={styles.card}
            onPress={() => router.push(`/spot/${spot.id}`)}
          >
            <Image source={{ uri: spot.image }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{spot.name}</Text>
              <Text style={styles.city}>{spot.city}</Text>
              <Text style={styles.desc}>{spot.description}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    padding: 16,
  },
  loading: {
    marginTop: 20,
    textAlign: "center",
    color: "#ccc",
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#2E2E2E",
  },
  image: {
    width: "100%",
    height: 180,
  },
  textContainer: {
    padding: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    color: "#fff",
  },
  city: {
    fontSize: 14,
    color: "#bbb",
    marginBottom: 6,
  },
  desc: {
    fontSize: 13,
    color: "#ccc",
    lineHeight: 18,
  },
});
