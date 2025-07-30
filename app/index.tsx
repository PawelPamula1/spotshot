import Logo from "@/assets/images/logo2.png";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Welcome() {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Image
          source={Logo} // ← podmień na swój URL lub lokalne logo
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome to PhotoSpot</Text>
        <Text style={styles.subtitle}>
          Discover, explore and save the best photography spots around the world
        </Text>

        <View style={styles.buttons}>
          <Link href="/login" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Log In</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(tabs)" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                Continue without login
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    width: 160,
    height: 80,
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  buttons: {
    width: "100%",
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#1F1F1F",
    borderColor: "#333",
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#aaa",
    fontSize: 15,
    fontWeight: "500",
  },
});
