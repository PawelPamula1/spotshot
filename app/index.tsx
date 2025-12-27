import { Theme } from "@/constants/Theme";
import { useAuth } from "@/provider/AuthProvider";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Redirect, Stack, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type Slide = {
  key: string;
  title: string;
  subtitle: string;
  image: any; // require(...)
};

const SLIDES: Slide[] = [
  {
    key: "explore",
    title: "Explore Spots",
    subtitle: "Discover the best photo locations around you and worldwide.",
    image: require("@/assets/images/explore-spots.png"),
  },
  {
    key: "map",
    title: "Full Map View",
    subtitle:
      "Navigate the map and find geotagged spots added by the community.",
    image: require("@/assets/images/full-map.png"),
  },
  {
    key: "details",
    title: "Spot Details",
    subtitle: "See real photos, tips and author — know exactly what to shoot.",
    image: require("@/assets/images/spot-screen.png"),
  },
  {
    key: "add",
    title: "Add Your Spot",
    subtitle:
      "Share your locations with others — photo, tips, city and country.",
    image: require("@/assets/images/add-spot.png"),
  },
  {
    key: "saved",
    title: "Save Favorites",
    subtitle: "Build your list of favorite spots and plan your shot list.",
    image: require("@/assets/images/saved-spots.png"),
  },
];

export default function Onboarding() {
  const { isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  const router = useRouter();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: Theme.animation.slow,
      useNativeDriver: true,
    }).start();
  }, []);

  const goToApp = useCallback(async () => {
    router.replace("/(tabs)");
  }, [router]);

  const handleNext = useCallback(() => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      goToApp();
    }
  }, [index, goToApp]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / width);
    if (i !== index) setIndex(i);
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Decorative background elements */}
      <View style={styles.decorativeCircle} />
      <View style={[styles.decorativeCircle, styles.decorativeCircleBottom]} />

      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        <View style={[styles.topBar, { top: insets.top + 20 }]}>
          <TouchableOpacity onPress={goToApp} style={styles.skipButton}>
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(s) => s.key}
          renderItem={({ item }) => <SlideItem item={item} />}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />

        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Animated.View
              key={i}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>

        <View
          style={[
            styles.buttons,
            { paddingBottom: insets.bottom + Theme.spacing.xl },
          ]}
        >
          <Link href="/(tabs)/login" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Log In</Text>
            </TouchableOpacity>
          </Link>

          <Animated.View
            style={{ transform: [{ scale: buttonScale }], flex: 1 }}
          >
            <TouchableOpacity
              onPress={handleNext}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={1}
            >
              <LinearGradient
                colors={[Theme.colors.primary, Theme.colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>
                  {index === SLIDES.length - 1 ? "Get Started" : "Next"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

function SlideItem({ item }: { item: Slide }) {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.slide,
        { width },
        {
          opacity: slideAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <View style={styles.imageGlow} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.titleUnderline} />
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.richBlack,
  },
  decorativeCircle: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: Theme.colors.primary,
    opacity: 0.06,
    top: -150,
    right: -100,
  },
  decorativeCircleBottom: {
    top: undefined,
    right: undefined,
    bottom: -100,
    left: -150,
    backgroundColor: Theme.colors.electricBlue,
  },
  contentContainer: {
    flex: 1,
  },
  topBar: {
    position: "absolute",
    right: Theme.spacing.lg,
    zIndex: 10,
  },
  skipButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  skip: {
    color: Theme.colors.primary,
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.semibold,
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: 80,
  },
  imageContainer: {
    position: "relative",
    marginBottom: Theme.spacing.md,
  },
  image: {
    width: width * 0.8,
    height: width * 0.95,
    marginBottom: Theme.spacing.md,
    zIndex: 1,
  },
  imageGlow: {
    position: "absolute",
    bottom: 0,
    left: "10%",
    right: "10%",
    height: 100,
    backgroundColor: Theme.colors.primaryGlow,
    opacity: 0.4,
    borderRadius: 100,
    transform: [{ scaleX: 1.5 }],
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.typography.sizes.h3,
    color: Theme.colors.offWhite,
    fontWeight: Theme.typography.weights.black,
    textAlign: "center",
    marginBottom: Theme.spacing.xs,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.bodySmall,
    color: Theme.colors.textMuted,
    textAlign: "center",
    lineHeight:
      Theme.typography.sizes.bodySmall * Theme.typography.lineHeights.relaxed,
    paddingHorizontal: Theme.spacing.md,
    fontWeight: Theme.typography.weights.medium,
  },
  dots: {
    flexDirection: "row",
    alignSelf: "center",
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.slate,
  },
  dotActive: {
    backgroundColor: Theme.colors.primary,
    width: 24,
  },
  buttons: {
    paddingHorizontal: Theme.spacing.lg,
    gap: Theme.spacing.md,
    flexDirection: "row",
  },
  primaryButton: {
    paddingVertical: Theme.spacing.md + 2,
    borderRadius: Theme.radius.lg,
    alignItems: "center",
    justifyContent: "center",
    ...Theme.shadows.medium,
  },
  primaryButtonText: {
    color: Theme.colors.offWhite,
    fontSize: Theme.typography.sizes.bodySmall,
    fontWeight: Theme.typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  secondaryButton: {
    backgroundColor: Theme.colors.deepCharcoal,
    borderColor: Theme.colors.slate,
    borderWidth: 2,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    alignItems: "center",
    flex: 1,
  },
  secondaryButtonText: {
    color: Theme.colors.offWhite,
    fontSize: Theme.typography.sizes.bodySmall,
    fontWeight: Theme.typography.weights.semibold,
  },
});
