import { addToFavourites, checkIfFavourite } from "@/lib/api/favourites";
import { getSpotById } from "@/lib/api/spots";
import { getUserById } from "@/lib/api/users";
import { useAuth } from "@/provider/AuthProvider";
import { Profile } from "@/types/profile";
import Entypo from "@expo/vector-icons/Entypo";
import { Image as ExpoImage } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image as RNImage,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [spot, setSpot] = useState<any>(null);
  const [author, setAuthor] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [photoDimensions, setPhotoDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const { userId } = useAuth();

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const data = await getSpotById(id);
        setSpot(data);

        const { author_id } = data;
        const authorData = await getUserById(author_id);
        if (authorData) {
          setAuthor(authorData);
        }

        if (userId) {
          const isFav = await checkIfFavourite(userId, data.id);
          setIsSaved(isFav);
        }

        RNImage.getSize(data.image, (width, height) => {
          setPhotoDimensions({ width, height });
        });
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSpot();
  }, [id, userId]);

  const handleToggleSaved = async () => {
    if (!userId || !spot?.id || isSaved) return;

    try {
      await addToFavourites(userId, spot.id);
      setIsSaved(true);
    } catch (error) {
      console.error("Failed to save favorite:", error);
    }
  };

  const screenWidth = Dimensions.get("window").width;
  const calculatedHeight = photoDimensions
    ? screenWidth * (photoDimensions.height / photoDimensions.width)
    : 300;

  const handleOpenGoogleMaps = () => {
    const destination = `${spot.latitude},${spot.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    Linking.openURL(url);
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: "center" }} />;
  }

  if (error || !spot) {
    return (
      <Text style={{ color: "white", padding: 16 }}>Błąd ładowania danych</Text>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "" }} />

      <ExpoImage
        source={{ uri: spot.image }}
        style={[
          styles.heroImage,
          { height: calculatedHeight }, // nadpisujemy wysokość
        ]}
        contentFit="contain"
      />

      <View style={styles.imageInfo}>
        <Text style={styles.spotTitle}>{spot.name}</Text>
        <Text style={styles.spotLocation}>
          {spot.city}, {spot.country}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.description}>{spot.description}</Text>
      </View>
      {author && (
        <View style={styles.authorCard}>
          <ExpoImage
            source={{
              uri: author?.avatar_url || "https://i.pravatar.cc/150",
            }}
            style={styles.avatar}
          />
          <Text style={styles.authorText}>
            Dodane przez{" "}
            <Text style={styles.authorName}>{author?.username}</Text>
          </Text>
        </View>
      )}

      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>📸 Wskazówki:</Text>
        <Text style={styles.tip}>{spot.photo_tips}</Text>
      </View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity onPress={handleOpenGoogleMaps} style={styles.button}>
          <Text style={styles.buttonText}>Jak tam dojechać </Text>
          <Text>
            <Entypo
              name="direction"
              size={24}
              color="white"
              style={{ marginLeft: 6 }}
            />
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleToggleSaved} style={styles.button}>
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
  imageInfo: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  spotTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
  },
  spotLocation: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 4,
  },
  authorCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 16,
    padding: 14,
    backgroundColor: "#1E1E1E",
    borderRadius: 18,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  authorText: {
    fontSize: 14,
    color: "#aaa",
  },
  authorName: {
    fontWeight: "600",
    color: "#fff",
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  description: {
    fontSize: 15,
    color: "#ddd",
    lineHeight: 22,
  },
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
  tip: {
    fontSize: 14,
    color: "#bbb",
    marginBottom: 6,
  },
});
