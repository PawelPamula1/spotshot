import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { SpotGrid } from "@/components/ui/SpotGrid";
import { getFavouriteSpots } from "@/lib/api/favourites";
import { useAuth } from "@/provider/AuthProvider";
import { Spot } from "@/types/spot"; // dostosuj ścieżkę
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Saved() {
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();
  const [savedSpots, setSavedSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      if (!userId) return;

      try {
        const data = await getFavouriteSpots(userId);
        setSavedSpots(data);
      } catch (error) {
        console.error("Failed to load favourites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [userId]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: "center" }} />;
  }

  if (!savedSpots.length) {
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.empty}>Nie masz jeszcze zapisanych miejsc.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 24 }]}>
      <SpotGrid spots={savedSpots} />
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
});
