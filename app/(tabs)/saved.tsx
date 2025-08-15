import { HeaderLogo } from "@/components/ui/HeaderLogo";
import { SpotGrid } from "@/components/ui/SpotGrid";
import { useFavourites } from "@/hooks/useFavourites";
import { router, Stack } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Saved() {
  const insets = useSafeAreaInsets();
  const { favourites, loading, isEmpty } = useFavourites();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 24 }]}>
      <Stack.Screen
        options={{
          headerTitle: () => <HeaderLogo title="Saved Spots" />,
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#fff",
        }}
      />

      {loading ? (
        <ActivityIndicator style={{ flex: 1, justifyContent: "center" }} />
      ) : isEmpty ? (
        <View style={styles.textContainer}>
          <Text style={styles.empty}>
            You don't have anything in your favourites.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              Explore and find the best spots
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SpotGrid spots={favourites} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 20,
  },
  empty: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 100,
    fontSize: 16,
  },
  textContainer: {
    marginTop: 28,
    marginBottom: 38,
    marginHorizontal: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3c3b3b",
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 15,
  },
});
