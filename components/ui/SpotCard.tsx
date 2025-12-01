import { Theme } from "@/constants/Theme";
import { Spot } from "@/types/spot";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CARD_MARGIN = 8;
const CARD_WIDTH = (Dimensions.get("window").width - CARD_MARGIN * 3) / 2;

export const SpotCard = ({ spot }: { spot: Spot }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: Theme.animation.slow,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  };

  return (
    <Animated.View
      style={[
        { width: CARD_WIDTH },
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/spot/${spot.id}`)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Gradient border effect */}
        <View style={styles.gradientBorder}>
          <View style={styles.innerCard}>
            <Image source={{ uri: spot.image }} style={styles.image} />

            {/* Purple glow overlay */}
            <View style={styles.glowOverlay} />

            {/* Location badge */}
            <View style={styles.locationBadge}>
              <Text style={styles.city}>{spot.city}</Text>
            </View>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={2}>
            {spot.name}
          </Text>

          {/* Accent bar */}
          <View style={styles.accentBar} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.deepCharcoal,
    borderRadius: Theme.radius.lg,
    overflow: "hidden",
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.soft,
  },
  gradientBorder: {
    padding: 2,
    borderRadius: Theme.radius.lg,
  },
  innerCard: {
    borderRadius: Theme.radius.lg - 2,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: Theme.colors.slate,
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Theme.colors.primaryGlow,
    opacity: 0.3,
  },
  locationBadge: {
    position: "absolute",
    top: Theme.spacing.sm,
    left: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.sm + 2,
    paddingVertical: 6,
    backgroundColor: "rgba(109, 95, 253, 0.9)",
    borderRadius: Theme.radius.sm,
    backdropFilter: "blur(10px)",
  },
  city: {
    fontSize: Theme.typography.sizes.tiny,
    color: Theme.colors.offWhite,
    fontWeight: Theme.typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  textContainer: {
    padding: Theme.spacing.md,
    gap: Theme.spacing.xs,
  },
  name: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.semibold,
    lineHeight:
      Theme.typography.sizes.body * Theme.typography.lineHeights.tight,
    color: Theme.colors.textLight,
  },
  accentBar: {
    width: 40,
    height: 3,
    backgroundColor: Theme.colors.primary,
    marginTop: Theme.spacing.xs,
    borderRadius: 2,
  },
});
