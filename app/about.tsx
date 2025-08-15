import { HeaderLogo } from "@/components/ui/HeaderLogo";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AboutAppScreen() {
  const openLink = (url: string) => Linking.openURL(url);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: () => <HeaderLogo title="About App" />,
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#fff",
        }}
      />

      <ScrollView contentContainerStyle={styles.inner}>
        {/* HERO */}
        <View style={styles.hero}>
          <Image
            source={require("@/assets/images/logo2.png")}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={styles.title}>SpotShot — Find & Save Photo Spots</Text>
          <Text style={styles.subtitle}>
            Discover photography spots, save your favorites, and plan your shots
            — all in one app.
          </Text>
        </View>

        {/* WHY THIS APP */}
        <Section title="Why this app exists">
          <Text style={styles.paragraph}>
            SpotShot was born out of a simple problem: while traveling, it was
            hard to find the exact locations where the best shots are taken. I
            wanted a map of real photo spots with real photos and practical tips
            — not just generic attractions. That’s where the idea for a
            community-driven database for photographers and creators came from.
          </Text>
        </Section>

        {/* ABOUT ME */}
        <Section title="Who I am">
          <View style={styles.authorRow}>
            <Image
              source={require("@/assets/images/about.png")}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.authorName}>Paul</Text>
              <Text style={styles.badgeRow}>
                <Text style={styles.badge}>Developer & Traveler</Text>
              </Text>
            </View>
          </View>

          <Text style={styles.paragraph}>
            I’m a React Native developer and a travel enthusiast. Over the last
            years I’ve worked on large production mobile apps (including in the
            betting domain), and in my spare time I’ve been building my own
            projects. On the road I often missed a reliable list of exact places
            to capture specific frames — so I built SpotShot. It fuses my love
            for coding with my passion for discovering new locations.
          </Text>
          <Text style={styles.paragraph}>
            My goal with SpotShot was simplicity: quick map search, real example
            photos, a short description, and practical tips from the author
            (sunrise vs. sunset, focal length, framing, how to get there). Add
            favorites and it becomes easy to plan your next shoot.
          </Text>
        </Section>

        {/* FEATURES */}
        <Section title="What SpotShot can do">
          <Bullet>🌍 Interactive map with geotagged photo locations</Bullet>
          <Bullet>📸 Real photos + author tips (when and how to shoot)</Bullet>
          <Bullet>🔎 Search and filter by country/city</Bullet>
          <Bullet>❤️ Save favorite spots with quick preview</Bullet>
          <Bullet>➕ Add your own spots (photo, description, tips)</Bullet>
          <Bullet>🗺️ Quick “Show on map” and navigation</Bullet>
        </Section>

        {/* ROADMAP */}
        <Section title="Roadmap & vision">
          <Bullet>⭐ Community ratings and comments</Bullet>
          <Bullet>🗓️ Trip planner & shot list</Bullet>
          <Bullet>⚡ Even better list/map performance at scale</Bullet>
          <Bullet>
            🧭 Offline mode: cached map tiles and data for low-signal trips
          </Bullet>
        </Section>

        {/* CTA */}
        <Section title="Want to help?">
          <Text style={styles.paragraph}>
            Have ideas for new features or want to help build the community?
            Reach out — every bit of feedback helps make SpotShot better.
          </Text>

          <View style={styles.ctaRow}>
            <CTA
              label="Email me"
              onPress={() => openLink("mailto:pawelpamula003@gmail.com")}
            />
            <CTA
              label="Instagram"
              onPress={() =>
                openLink("https://www.instagram.com/paulhimself__/")
              }
            />
          </View>
        </Section>

        <Text style={styles.footer}>© {new Date().getFullYear()} SpotShot</Text>
      </ScrollView>
    </View>
  );
}

/** Section container */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={{ marginTop: 8 }}>{children}</View>
    </View>
  );
}

/** Bulleted line */
function Bullet({ children }: { children: React.ReactNode }) {
  return <Text style={styles.bullet}>• {children}</Text>;
}

/** Small CTA button */
function CTA({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.ctaButton} onPress={onPress}>
      <Text style={styles.ctaText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  inner: { padding: 20, paddingBottom: 40 },

  hero: { alignItems: "center", marginBottom: 24 },
  // (optional) slightly larger logo
  logo: { width: 160, height: 80, marginBottom: 14 },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#bfbfbf",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 6,
  },

  section: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#262626",
  },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  paragraph: { color: "#d5d5d5", fontSize: 14, lineHeight: 22, marginTop: 8 },

  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  // 🔥 bigger profile image
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  authorName: { color: "#fff", fontWeight: "700", fontSize: 16 },
  badgeRow: { marginTop: 4 },
  badge: {
    color: "#bbb",
    backgroundColor: "#242424",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 6,
    overflow: "hidden",
  },

  bullet: { color: "#d5d5d5", fontSize: 14, lineHeight: 22, marginTop: 4 },

  ctaRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  ctaButton: {
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    borderColor: "#3a3a3a",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  ctaText: { color: "#fff", fontWeight: "600" },

  footer: { color: "#777", textAlign: "center", marginTop: 10, fontSize: 12 },
});
