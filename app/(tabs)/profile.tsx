import { HeaderLogo } from "@/components/ui/HeaderLogo";
import { getFavouriteSpots } from "@/lib/api/favourites";
import { getUserSpotsCount } from "@/lib/api/spots";
import { useAuth } from "@/provider/AuthProvider";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const { signOut, userId, profile } = useAuth();
  const [favouriteSpots, setFavouriteSpots] = useState<any[]>([]);
  const [userSpotsCount, setUserSpotsCount] = useState<number>(0);

  useEffect(() => {
    const fetchFavourites = async () => {
      if (!userId) return;

      try {
        const spots = await getFavouriteSpots(userId);
        setFavouriteSpots(spots);

        const count = await getUserSpotsCount(userId);
        setUserSpotsCount(count);
      } catch (err) {
        console.error("Error fetching favourites", err);
      }
    };

    fetchFavourites();
  }, [userId]);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: () => <HeaderLogo title="Add Spot" />,
          headerStyle: {
            backgroundColor: "#121212",
          },
          headerTintColor: "#fff",
          headerBackTitle: "Cancel",
        }}
      />
      <View style={styles.inner}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: profile?.avatar_url || "https://i.pravatar.cc/150" }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.username}>@{profile?.username}</Text>
          </View>
          <TouchableOpacity onPress={() => alert("Edit profile")}>
            <Text style={styles.edit}>Edytuj profil</Text>
          </TouchableOpacity>
        </View>

        {/* Statystyki */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userSpotsCount}</Text>
            <Text style={styles.statLabel}>Dodane</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{favouriteSpots.length}</Text>
            <Text style={styles.statLabel}>Ulubione</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💾 Zapisane miejsca</Text>
          <TouchableOpacity onPress={() => router.push("/saved")}>
            <View style={styles.previewRow}>
              {favouriteSpots.slice(0, 3).map((spot) => (
                <Image
                  key={spot.id}
                  source={spot.image}
                  style={styles.previewImage}
                />
              ))}
            </View>
          </TouchableOpacity>
        </View>

        {/* Ustawienia i feedback */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Ustawienia</Text>

          <TouchableOpacity
            onPress={() => signOut()}
            style={styles.settingItem}
          >
            <Text style={styles.settingText}>🚪 Wyloguj się</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>🐞 Zgłoś problem / Sugestia</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>ℹ️ O aplikacji</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  inner: {
    padding: 20,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#1F1F1F",
  },
  username: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  edit: {
    color: "#4D9EFF",
    fontWeight: "600",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    backgroundColor: "#161616",
    borderRadius: 16,
    padding: 16,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  statLabel: {
    color: "#aaa",
    marginTop: 4,
    fontSize: 13,
  },
  section: {
    marginBottom: 36,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#fff",
  },
  previewRow: {
    flexDirection: "row",
    gap: 8,
  },
  previewImage: {
    flex: 1,
    height: 100,
    borderRadius: 8,
  },
  settingItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  settingText: {
    fontSize: 15,
    color: "#ddd",
  },
});
