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
  },
  content: {
    padding: 16,
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
