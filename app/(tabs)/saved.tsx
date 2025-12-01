import { HeaderLogo } from "@/components/ui/HeaderLogo";
import { SpotGrid } from "@/components/ui/SpotGrid";
import { Theme } from "@/constants/Theme";
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
          headerStyle: { backgroundColor: Theme.colors.richBlack },
          headerTintColor: Theme.colors.offWhite,
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
    backgroundColor: Theme.colors.richBlack,
    paddingTop: Theme.spacing.lg,
  },
  empty: {
    color: Theme.colors.textMuted,
    textAlign: "center",
    marginTop: 100,
    fontSize: Theme.typography.sizes.body,
    lineHeight: Theme.typography.sizes.body * Theme.typography.lineHeights.relaxed,
  },
  textContainer: {
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.xxl,
    marginHorizontal: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  button: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.md + 2,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...Theme.shadows.soft,
  },
  buttonText: {
    color: Theme.colors.offWhite,
    fontWeight: Theme.typography.weights.bold,
    fontSize: Theme.typography.sizes.body,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
});
