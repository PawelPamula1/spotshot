import { useAuth } from "@/provider/AuthProvider";
import { Link, Redirect, Stack, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
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

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  const router = useRouter();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const goToApp = useCallback(async () => {
    router.replace("/(tabs)"); // lub np. /login
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

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={goToApp}>
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
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.buttons}>
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Log In</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.primaryButtonText}>
            {index === SLIDES.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SlideItem({ item }: { item: Slide }) {
  return (
    <View style={[styles.slide, { width }]}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  topBar: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 10,
  },
  skip: { color: "#bbb", fontSize: 16 },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  image: {
    width: width,
    height: width * 1.1,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#bbb",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  dots: {
    flexDirection: "row",
    alignSelf: "center",
    gap: 6,
    marginBottom: 18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2a2a2a",
  },
  dotActive: {
    backgroundColor: "#6D5FFD",
    width: 20,
  },
  buttons: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#6D5FFD",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryButton: {
    backgroundColor: "#1F1F1F",
    borderColor: "#333",
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: { color: "#ddd", fontSize: 16, fontWeight: "600" },
});
