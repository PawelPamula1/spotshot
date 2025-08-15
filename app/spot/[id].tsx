import { useFavouriteSpot } from "@/hooks/useFavourites";
import { useSpot } from "@/hooks/useSpot";
import { openInMaps } from "@/utils/maps";
import Entypo from "@expo/vector-icons/Entypo";
import { Image as ExpoImage } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { spot, author, photoDimensions, loading, error } = useSpot(id);
  const {
    isSaved,
    likesCount,
    toggleSave,
    loading: favLoading,
  } = useFavouriteSpot(id);

  if (loading) {
    return (
      <ScrollView style={styles.container}>
        <Stack.Screen
          options={{
            title: "",
            headerBackTitle: "Spots",
            headerStyle: { backgroundColor: "#121212" },
            headerTintColor: "#fff",
          }}
        />
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      </ScrollView>
    );
  }

  if (error || !spot) {
    return (
      <Text style={{ color: "white", padding: 16 }}>Błąd ładowania danych</Text>
    );
  }

  const screenWidth = Dimensions.get("window").width;
  const calculatedHeight = photoDimensions
    ? screenWidth * (photoDimensions.height / photoDimensions.width)
    : 300;

  const handleOpenGoogleMaps = () => openInMaps(spot.latitude, spot.longitude);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: "",
          headerBackTitle: "Spots",
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#fff",
        }}
      />

      <ExpoImage
        source={{ uri: spot.image }}
        style={[styles.heroImage, { height: calculatedHeight }]}
        contentFit="contain"
      />

      <View style={styles.imageInfo}>
        <View>
          <Text style={styles.spotTitle}>{spot.name}</Text>
        </View>
        <Text style={styles.spotLocation}>
          {spot.city}, {spot.country}
        </Text>
        {!!likesCount && (
          <View style={styles.likesContainer}>
            <Entypo name={"heart"} size={20} color="#f95e58" />
            <Text style={styles.likesCount}>{likesCount}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.description}>{spot.description}</Text>
      </View>

      {author && (
        <View style={styles.authorCard}>
          <Text style={styles.authorText}>
            Added by <Text style={styles.authorName}>{author?.username}</Text>
          </Text>
        </View>
      )}

      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>📸 Instructions for taking photo:</Text>
        <Text style={styles.tip}>{spot.photo_tips}</Text>
      </View>

      <View style={styles.buttonGroup}>
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
          style={styles.button}
        >
          <Text style={styles.buttonText}>Show on Photo Spots Maps</Text>
          <Text>
            <Entypo
              name="direction"
              size={24}
              color="white"
              style={{ marginLeft: 6 }}
            />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenGoogleMaps} style={styles.button}>
          <Text style={styles.buttonText}>Open Google Maps</Text>
          <Text>
            <Entypo
              name="direction"
              size={24}
              color="white"
              style={{ marginLeft: 6 }}
            />
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleSave}
          style={styles.button}
          disabled={favLoading || isSaved}
        >
          <Text style={styles.buttonText}>
            {isSaved ? "Added to Favorites" : "Add to Favorites"}
          </Text>
          <Entypo
            name={isSaved ? "heart" : "heart-outlined"}
            size={20}
            color="white"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  heroImage: {
    width: "100%",
    height: 500,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  imageInfo: { paddingHorizontal: 16, paddingTop: 12 },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 3,
  },
  likesCount: { color: "#fff", textAlign: "center", fontSize: 18 },
  spotTitle: { fontSize: 26, fontWeight: "700", color: "#fff" },
  spotLocation: { fontSize: 16, color: "#ccc", marginTop: 4 },
  authorCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 16,
    padding: 14,
    backgroundColor: "#1E1E1E",
    borderRadius: 18,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  authorText: { fontSize: 14, color: "#aaa" },
  authorName: { fontWeight: "600", color: "#fff" },
  section: { paddingHorizontal: 16, marginTop: 20 },
  description: { fontSize: 15, color: "#ddd", lineHeight: 22 },
  buttonGroup: {
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
  tipsCard: {
    marginTop: 36,
    marginBottom: 36,
    marginHorizontal: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 18,
    padding: 18,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#fff",
  },
  tip: { fontSize: 14, color: "#bbb", marginBottom: 6 },
});
