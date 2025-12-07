import { HeaderLogo } from "@/components/ui/HeaderLogo";
import { SpotGrid } from "@/components/ui/SpotGrid";
import { Theme } from "@/constants/Theme";
import { useUserSpots } from "@/hooks/useUserSpots";
import { useAuth } from "@/provider/AuthProvider";
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

export default function UserSpots() {
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();
  const { spots, loading, isEmpty } = useUserSpots(userId);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 24 }]}>
      <Stack.Screen
        options={{
          headerTitle: () => <HeaderLogo title="My Spots" />,
          headerStyle: { backgroundColor: Theme.colors.richBlack },
          headerTintColor: Theme.colors.offWhite,
          headerBackTitle: "Back",
        }}
      />

      {loading ? (
        <ActivityIndicator style={{ flex: 1, justifyContent: "center" }} />
      ) : isEmpty ? (
        <View style={styles.textContainer}>
          <Text style={styles.empty}>
            You haven't added any spots yet.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/addSpot")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              Add your first spot
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SpotGrid spots={spots} />
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
