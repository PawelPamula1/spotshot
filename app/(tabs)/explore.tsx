import { Filters } from "@/components/Filters";
import { HeaderLogo } from "@/components/ui/HeaderLogo";
import { SpotGrid } from "@/components/ui/SpotGrid";
import { useSpots } from "@/hooks/useSpots";
import { Stack } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const theme = useColorScheme() ?? "light";

  const { search, handleSearch, filteredSpots, loading, onFilter } = useSpots();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 24 }]}>
      <Stack.Screen
        options={{
          headerTitle: () => <HeaderLogo title="Explore Spots" />,
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#fff",
          headerSearchBarOptions: {
            placeholder: "Search",
            onChangeText: (e: any) => handleSearch(e.nativeEvent.text),
          },
        }}
      />

      <Filters onFilter={onFilter} />

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
  searchLabel: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});
