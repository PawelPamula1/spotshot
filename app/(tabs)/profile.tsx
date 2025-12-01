import { HeaderLogo } from "@/components/ui/HeaderLogo";
import { Theme } from "@/constants/Theme";
import { useFavourites } from "@/hooks/useFavourites";
import { useUserSpotsCount } from "@/hooks/useUserStats";
import { useAuth } from "@/provider/AuthProvider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const { signOut, userId, profile } = useAuth();
  const { favourites, loading: favLoading } = useFavourites();
  const { count: userSpotsCount, loading: spotsCountLoading } =
    useUserSpotsCount(userId);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: Theme.animation.slow,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: Theme.animation.slow,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const favPreview = favourites.slice(0, 3);
  const anyLoading = favLoading || spotsCountLoading;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          headerTitle: () => <HeaderLogo title="Profile" />,
          headerStyle: { backgroundColor: Theme.colors.richBlack },
          headerTintColor: Theme.colors.offWhite,
          headerBackTitle: "Back",
        }}
      />

      <Animated.View
        style={[
          styles.inner,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Profile Header with Gradient */}
        <LinearGradient
          colors={[Theme.colors.primary, Theme.colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatarRing}>
              <MaterialIcons
                name="person"
                size={40}
                color={Theme.colors.offWhite}
              />
            </View>
          </View>
          <Text style={styles.username}>{profile?.username}</Text>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <MaterialIcons
                name="add-location"
                size={24}
                color={Theme.colors.primary}
              />
            </View>
            {spotsCountLoading ? (
              <ActivityIndicator color={Theme.colors.primary} />
            ) : (
              <Text style={styles.statNumber}>{userSpotsCount}</Text>
            )}
            <Text style={styles.statLabel}>Spots Added</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <MaterialIcons
                name="bookmark"
                size={24}
                color={Theme.colors.electricBlue}
              />
            </View>
            {favLoading ? (
              <ActivityIndicator color={Theme.colors.primary} />
            ) : (
              <Text style={styles.statNumber}>{favourites.length}</Text>
            )}
            <Text style={styles.statLabel}>Spots Saved</Text>
          </View>
        </View>

        {/* Saved Spots Preview */}
        {!!favPreview.length && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Saved Spots</Text>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/saved")}
                disabled={anyLoading}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.previewRow}>
              {favPreview.map((spot) => (
                <View key={spot.id} style={styles.previewContainer}>
                  <Image
                    source={{ uri: spot.image }}
                    style={styles.previewImage}
                  />
                  <View style={styles.previewOverlay} />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingsCard}>
            <TouchableOpacity
              onPress={() => router.push("/about")}
              style={styles.settingItem}
            >
              <View style={styles.settingIconContainer}>
                <MaterialIcons
                  name="info-outline"
                  size={20}
                  color={Theme.colors.primary}
                />
              </View>
              <Text style={styles.settingText}>About SpotShot</Text>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={Theme.colors.textMuted}
              />
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <TouchableOpacity
              onPress={() => signOut()}
              style={styles.settingItem}
            >
              <View style={styles.settingIconContainer}>
                <MaterialIcons
                  name="logout"
                  size={20}
                  color={Theme.colors.error}
                />
              </View>
              <Text style={[styles.settingText, { color: Theme.colors.error }]}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.richBlack,
  },
  inner: {
    padding: Theme.spacing.lg,
    paddingBottom: 100,
  },
  profileCard: {
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.xl,
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.medium,
  },
  avatarContainer: {
    marginBottom: Theme.spacing.md,
  },
  avatarRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  username: {
    fontSize: Theme.typography.sizes.h2,
    fontWeight: Theme.typography.weights.black,
    color: Theme.colors.offWhite,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.bodySmall,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: Theme.typography.weights.medium,
  },
  statsContainer: {
    flexDirection: "row",
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Theme.colors.deepCharcoal,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.slate,
    ...Theme.shadows.soft,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.darkNavy,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Theme.spacing.sm,
  },
  statNumber: {
    fontSize: Theme.typography.sizes.h1,
    fontWeight: Theme.typography.weights.black,
    color: Theme.colors.offWhite,
    marginBottom: Theme.spacing.xs,
  },
  statLabel: {
    fontSize: Theme.typography.sizes.caption,
    color: Theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: Theme.typography.weights.semibold,
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.h3,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.offWhite,
    marginBottom: Theme.spacing.md,
  },
  viewAllText: {
    fontSize: Theme.typography.sizes.bodySmall,
    color: Theme.colors.primary,
    fontWeight: Theme.typography.weights.semibold,
  },
  previewRow: {
    flexDirection: "row",
    gap: Theme.spacing.sm,
  },
  previewContainer: {
    flex: 1,
    position: "relative",
    borderRadius: Theme.radius.md,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 120,
    borderRadius: Theme.radius.md,
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Theme.colors.primaryGlow,
    opacity: 0.2,
  },
  settingsCard: {
    backgroundColor: Theme.colors.deepCharcoal,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.slate,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.darkNavy,
    alignItems: "center",
    justifyContent: "center",
  },
  settingText: {
    flex: 1,
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.offWhite,
    fontWeight: Theme.typography.weights.medium,
  },
  settingDivider: {
    height: 1,
    backgroundColor: Theme.colors.slate,
    marginVertical: Theme.spacing.xs,
  },
});
