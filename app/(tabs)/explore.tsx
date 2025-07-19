import { Filters } from "@/components/Filters";
import { dummySpots } from "@/lib/data/dummySpots";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
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
  const [filteredSpots, setFilteredSpots] = useState(dummySpots);
  const [loading, setLoading] = useState(false);

  const theme = useColorScheme() ?? "light";

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
            onChangeText: (e) => {
              const text = e.nativeEvent.text;
              setSearch(text);
              setLoading(true);
              setTimeout(() => {
                const filtered = dummySpots.filter((spot) => {
                  const query = text.toLowerCase();
                  return (
                    spot.name.toLowerCase().includes(query) ||
                    spot.city.toLowerCase().includes(query) ||
                    spot.description.toLowerCase().includes(query)
                  );
                });
                setFilteredSpots(filtered);
                setLoading(false);
              }, 400);
            },
          },
        }}
      />
      <Filters onFilter={(filtered) => setFilteredSpots(filtered)} />

      <Text style={{ color: theme === "light" ? "#000" : "#fff" }}>
        {search && `Search for "${search}"`}
      </Text>
      {loading ? (
        <Text
          style={{
            marginTop: 20,
            textAlign: "center",
            color: theme === "light" ? "#000" : "#fff",
          }}
        >
          Loading...
        </Text>
      ) : filteredSpots.length === 0 ? (
        <Text
          style={{
            marginTop: 20,
            textAlign: "center",
            color: theme === "light" ? "#000" : "#fff",
          }}
        >
          No results found
        </Text>
      ) : (
        filteredSpots.map((spot) => (
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
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // ciemne tło
  },
  content: {
    padding: 16,
  },

  card: {
    backgroundColor: "#1E1E1E", // ciemna karta
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
