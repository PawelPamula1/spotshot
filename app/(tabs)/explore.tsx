import { Filters } from "@/components/Filters";
import { SpotGrid } from "@/components/ui/SpotGrid";
import { getSpots } from "@/lib/api/spots";
import { Spot } from "@/types/spot";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CARD_MARGIN = 8;

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
    <View style={[styles.container, { paddingBottom: insets.bottom + 24 }]}>
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
        <Text
          style={[
            styles.searchLabel,
            { color: theme === "light" ? "#000" : "#fff" },
          ]}
        >
          Search for "{search}"
        </Text>
      ) : null}

      {loading ? (
        <ActivityIndicator
          size="small"
          color="#ccc"
          style={{ marginTop: 20 }}
        />
      ) : (
        <SpotGrid spots={filteredSpots} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    paddingVertical: 16,
  },
  loading: {
    marginTop: 20,
    textAlign: "center",
    color: "#ccc",
  },
  searchLabel: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});
