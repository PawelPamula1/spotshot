import { dummySpots } from "@/lib/data/dummySpots";
import { useAuth } from "@/provider/AuthProvider";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const { signOut, profile } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inner}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=7" }}
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
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Dodane</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Ulubione</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💾 Zapisane miejsca</Text>
          <TouchableOpacity onPress={() => router.push("/saved")}>
            <View style={styles.previewRow}>
              {dummySpots.slice(0, 3).map((spot) => (
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
    backgroundColor: "#0D0D0D",
  },
  inner: {
    padding: 20,
    backgroundColor: "#0D0D0D",
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
