import { HeaderLogo } from "@/components/ui/HeaderLogo";
import { useFavourites } from "@/hooks/useFavourites";
import { useUserSpotsCount } from "@/hooks/useUserStats";
import { useAuth } from "@/provider/AuthProvider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
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

  const favPreview = favourites.slice(0, 3);
  const anyLoading = favLoading || spotsCountLoading;

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: () => <HeaderLogo title="Profile" />,
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#fff",
          headerBackTitle: "Back",
        }}
      />

      <View style={styles.inner}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.username}>{profile?.username}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            {spotsCountLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.statNumber}>{userSpotsCount}</Text>
            )}
            <Text style={styles.statLabel}>Spots Added</Text>
          </View>

          <View style={styles.statBox}>
            {favLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.statNumber}>{favourites.length}</Text>
            )}
            <Text style={styles.statLabel}>Spots Saved</Text>
          </View>
        </View>

        {!!favPreview.length && (
          <View style={styles.section}>
            <View style={styles.titleContainer}>
              <Text style={styles.sectionTitle}>Saved Spots</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/saved")}
              disabled={anyLoading}
            >
              <View style={styles.previewRow}>
                {favPreview.map((spot) => (
                  <Image
                    key={spot.id}
                    source={{ uri: spot.image }}
                    style={styles.previewImage}
                  />
                ))}
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.titleContainer}>
            <Text>
              <MaterialIcons name="settings" size={24} color="white" />
            </Text>
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>

          <TouchableOpacity
            onPress={() => signOut()}
            style={styles.settingItem}
          >
            <Text style={styles.settingText}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Report</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>About App</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  inner: { padding: 20, backgroundColor: "#121212" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#1F1F1F",
  },
  username: { fontSize: 18, fontWeight: "700", color: "#fff" },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    backgroundColor: "#161616",
    borderRadius: 16,
    padding: 16,
  },
  statBox: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 20, fontWeight: "700", color: "#fff" },
  statLabel: { color: "#aaa", marginTop: 4, fontSize: 13 },
  section: { marginBottom: 36 },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 24, fontWeight: "700", color: "#fff" },
  previewRow: { flexDirection: "row", gap: 8 },
  previewImage: { flex: 1, height: 100, borderRadius: 8 },
  settingItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  settingText: { fontSize: 15, color: "#ddd" },
});
