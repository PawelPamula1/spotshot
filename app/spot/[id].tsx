import { useFavouriteSpot } from "@/hooks/useFavourites";
import { useSpot } from "@/hooks/useSpot";
import { reportSpot } from "@/lib/api/moderation";
import { useAuth } from "@/provider/AuthProvider";
import { openInMaps } from "@/utils/maps";

import { Image as ExpoImage } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ReportModal } from "@/components/ReportModal";
import { Theme } from "@/constants/Theme";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { spot, author, photoDimensions, loading, error } = useSpot(id);
  const {
    isSaved,
    likesCount,
    toggleSave,
    loading: favLoading,
  } = useFavouriteSpot(id);

  const { userId } = useAuth();
  const [reportOpen, setReportOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: Theme.animation.normal,
      useNativeDriver: true,
    }).start();
  }, []);

  const isOwner = spot && userId && spot.author_id === userId;

  if (loading) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Stack.Screen
          options={{
            title: "",
            headerBackTitle: "Spots",
            headerStyle: { backgroundColor: Theme.colors.richBlack },
            headerTintColor: Theme.colors.offWhite,
            headerRight: () => (
              <TouchableOpacity onPress={() => setReportOpen(true)}>
                <MaterialIcons
                  name="report-gmailerrorred"
                  size={26}
                  color={Theme.colors.error}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <ActivityIndicator size="large" />
      </ScrollView>
    );
  }

  if (error || !spot) {
    return (
      <Text style={{ color: "white", padding: 16 }}>Error Loading Data</Text>
    );
  }

  const screenWidth = Dimensions.get("window").width;
  const calculatedHeight = photoDimensions
    ? screenWidth * (photoDimensions.height / photoDimensions.width)
    : 300;

  const handleOpenGoogleMaps = () => openInMaps(spot.latitude, spot.longitude);

  const onReportPick = async (reason: string) => {
    if (!spot || !userId) return;
    try {
      setSubmitting(true);
      await reportSpot({
        spotId: spot.id,
        reporterId: userId,
        reason,
      });
      Alert.alert("Thank you", "We will review this spot.");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to send report");
    } finally {
      setSubmitting(false);
      setReportOpen(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: "",
          headerBackTitle: "Spots",
          headerStyle: { backgroundColor: Theme.colors.richBlack },
          headerTintColor: Theme.colors.offWhite,
          headerRight: () =>
            isOwner ? (
              <TouchableOpacity
                onPress={() => router.push(`/edit-spot/${id}`)}
                style={{ marginRight: 4 }}
              >
                <MaterialIcons
                  name="edit"
                  size={24}
                  color={Theme.colors.primary}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setReportOpen(true)}>
                <MaterialIcons
                  name="report-gmailerrorred"
                  size={26}
                  color={Theme.colors.error}
                />
              </TouchableOpacity>
            ),
        }}
      />

      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.heroImageContainer}>
          {photoDimensions ? (
            <ExpoImage
              source={{ uri: spot.image }}
              style={[styles.heroImage, { height: calculatedHeight }]}
              contentFit="cover"
              transition={500}
            />
          ) : (
            <View
              style={[
                styles.heroImage,
                { height: 300, backgroundColor: Theme.colors.slate },
              ]}
            />
          )}
          <View style={styles.heroOverlay} />
        </View>

        {!spot.accepted && (
          <View style={styles.pendingCard}>
            <View style={styles.pendingIconContainer}>
              <MaterialIcons
                name="hourglass-empty"
                size={20}
                color={Theme.colors.warning}
              />
            </View>
            <Text style={styles.pendingText}>
              This spot is awaiting moderation before being visible to everyone.
            </Text>
          </View>
        )}

        <View style={styles.imageInfo}>
          <Text style={styles.spotTitle}>{spot.name}</Text>
          <View style={styles.titleUnderline} />

          <View style={styles.locationRow}>
            <MaterialIcons
              name="location-on"
              size={18}
              color={Theme.colors.primary}
            />
            <View style={styles.spotLocationContainer}>
              {spot.city && (
                <Text style={[styles.spotLocation, { fontWeight: "700" }]}>
                  {spot.city},{" "}
                </Text>
              )}
              <Text style={styles.spotLocation}>{spot.country}</Text>
            </View>
          </View>

          {!!likesCount && (
            <View style={styles.likesContainer}>
              <MaterialIcons
                name="favorite"
                size={20}
                color={Theme.colors.primary}
              />
              <Text style={styles.likesCount}>{likesCount}</Text>
            </View>
          )}
        </View>

        {spot.description && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name="description"
                size={20}
                color={Theme.colors.primary}
              />
              <Text style={styles.sectionTitle}>About This Spot</Text>
            </View>
            <Text style={styles.description}>{spot.description}</Text>
          </View>
        )}

        {author && (
          <View style={styles.authorCard}>
            <View style={styles.authorIconContainer}>
              <MaterialIcons
                name="person"
                size={20}
                color={Theme.colors.primary}
              />
            </View>
            <Text style={styles.authorText}>
              Added by <Text style={styles.authorName}>{author?.username}</Text>
            </Text>
          </View>
        )}

        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <MaterialIcons
              name="camera-alt"
              size={24}
              color={Theme.colors.primary}
            />
            <Text style={styles.tipsTitle}>Photography Tips</Text>
          </View>
          <Text style={styles.tip}>{spot.photo_tips}</Text>
        </View>

        <View style={styles.buttonGroup}>
          {/* Primary action - Add to Favorites */}
          <TouchableOpacity
            onPress={toggleSave}
            disabled={favLoading || isSaved}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[Theme.colors.primary, Theme.colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.primaryButton,
                isSaved && styles.primaryButtonDisabled,
              ]}
            >
              <MaterialIcons
                name={isSaved ? "favorite" : "favorite-border"}
                size={22}
                color={Theme.colors.offWhite}
              />
              <Text style={styles.primaryButtonText}>
                {isSaved ? "Added to Favorites" : "Add to Favorites"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Secondary actions */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(tabs)",
                params: {
                  latitude: spot.latitude.toString(),
                  longitude: spot.longitude.toString(),
                },
              })
            }
            style={styles.secondaryButton}
          >
            <MaterialIcons name="map" size={20} color={Theme.colors.primary} />
            <Text style={styles.secondaryButtonText}>
              Show on Photo Spots Map
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleOpenGoogleMaps}
            style={styles.secondaryButton}
          >
            <MaterialIcons
              name="directions"
              size={20}
              color={Theme.colors.primary}
            />
            <Text style={styles.secondaryButtonText}>Open Google Maps</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      {!isOwner && (
        <ReportModal
          visible={reportOpen}
          onClose={() => !submitting && setReportOpen(false)}
          onPick={onReportPick}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.richBlack,
  },
  heroImageContainer: {
    position: "relative",
    borderBottomLeftRadius: Theme.radius.xl,
    borderBottomRightRadius: Theme.radius.xl,
    overflow: "hidden",
    borderTopWidth: 0,
  },
  heroImage: {
    width: "100%",
    height: 500,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Theme.colors.primaryGlow,
    opacity: 0.1,
  },
  pendingCard: {
    marginHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.md,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.deepCharcoal,
    borderWidth: 2,
    borderColor: Theme.colors.warning,
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    ...Theme.shadows.soft,
  },
  pendingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.darkNavy,
    alignItems: "center",
    justifyContent: "center",
  },
  pendingText: {
    flex: 1,
    color: Theme.colors.warning,
    fontSize: Theme.typography.sizes.bodySmall,
    fontWeight: Theme.typography.weights.medium,
  },
  imageInfo: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
  spotTitle: {
    fontSize: Theme.typography.sizes.h1,
    fontWeight: Theme.typography.weights.black,
    color: Theme.colors.offWhite,
    lineHeight: Theme.typography.sizes.h1 * Theme.typography.lineHeights.tight,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
    marginTop: Theme.spacing.xs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.sm,
  },
  spotLocationContainer: {
    flexDirection: "row",
  },
  spotLocation: {
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.textMuted,
    fontWeight: Theme.typography.weights.medium,
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.sm,
  },
  likesCount: {
    color: Theme.colors.offWhite,
    fontSize: Theme.typography.sizes.h3,
    fontWeight: Theme.typography.weights.semibold,
  },
  section: {
    paddingHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.h3,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.offWhite,
  },
  description: {
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.textLight,
    lineHeight:
      Theme.typography.sizes.body * Theme.typography.lineHeights.relaxed,
    fontWeight: Theme.typography.weights.medium,
  },
  authorCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Theme.spacing.xl,
    marginHorizontal: Theme.spacing.md,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.deepCharcoal,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.slate,
    gap: Theme.spacing.sm,
    ...Theme.shadows.soft,
  },
  authorIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.darkNavy,
    alignItems: "center",
    justifyContent: "center",
  },
  authorText: {
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.textMuted,
    fontWeight: Theme.typography.weights.medium,
  },
  authorName: {
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.offWhite,
  },
  tipsCard: {
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
    marginHorizontal: Theme.spacing.md,
    backgroundColor: Theme.colors.deepCharcoal,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    ...Theme.shadows.soft,
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  tipsTitle: {
    fontSize: Theme.typography.sizes.h3,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.offWhite,
  },
  tip: {
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.textLight,
    lineHeight:
      Theme.typography.sizes.body * Theme.typography.lineHeights.relaxed,
    fontWeight: Theme.typography.weights.medium,
  },
  buttonGroup: {
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.xxxl,
    marginHorizontal: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.md + 4,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.radius.lg,
    ...Theme.shadows.strong,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: Theme.colors.offWhite,
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.sm,
    backgroundColor: Theme.colors.deepCharcoal,
    borderWidth: 2,
    borderColor: Theme.colors.slate,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.radius.lg,
  },
  secondaryButtonText: {
    color: Theme.colors.offWhite,
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.semibold,
  },
});
