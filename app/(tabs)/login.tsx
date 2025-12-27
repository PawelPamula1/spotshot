import SignInForm from "@/components/ui/SignInForm";
import SignUpForm from "@/components/ui/SignUpForm";
import { Theme } from "@/constants/Theme";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: Theme.animation.slow,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: Theme.animation.slow,
        useNativeDriver: true,
      }),
    ]).start();
  }, [mode]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        <LinearGradient
          colors={[Theme.colors.richBlack, Theme.colors.deepCharcoal]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Decorative elements */}
        <View style={styles.decorativeCircle} />
        <View
          style={[styles.decorativeCircle, styles.decorativeCircleBottom]}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.inner,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Hero Section */}
              <View style={styles.hero}>
                <View style={styles.logoContainer}>
                  <Image
                    source={require("@/assets/icons/ios-dark.png")}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>

                <Text style={styles.appName}>PhotoSpots</Text>
                <Text style={styles.tagline}>
                  Discover the world's most photogenic locations
                </Text>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>
                    {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
                  </Text>
                  <View style={styles.dividerLine} />
                </View>
              </View>

              {/* Form Section */}
              <View style={styles.formContainer}>
                {mode === "login" ? (
                  <SignInForm />
                ) : (
                  <SignUpForm setMode={setMode} />
                )}

                <TouchableOpacity
                  onPress={() =>
                    setMode(mode === "login" ? "register" : "login")
                  }
                  style={styles.toggleButton}
                >
                  <Text style={styles.toggleText}>
                    {mode === "login"
                      ? "Don't have an account?"
                      : "Already have an account?"}{" "}
                  </Text>
                  <Text style={styles.toggleTextBold}>
                    {mode === "login" ? "Register" : "Sign In"}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.richBlack,
  },
  decorativeCircle: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: Theme.colors.primary,
    opacity: 0.08,
    top: -200,
    right: -150,
  },
  decorativeCircleBottom: {
    top: undefined,
    right: undefined,
    bottom: -150,
    left: -100,
    backgroundColor: Theme.colors.electricBlue,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: Theme.spacing.lg,
  },
  inner: {
    paddingHorizontal: Theme.spacing.lg,
  },
  hero: {
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  logoContainer: {
    marginBottom: Theme.spacing.sm,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  appName: {
    fontSize: Theme.typography.sizes.h2,
    fontWeight: Theme.typography.weights.black,
    color: Theme.colors.offWhite,
    marginBottom: Theme.spacing.xs,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: Theme.typography.sizes.bodySmall,
    color: Theme.colors.textMuted,
    textAlign: "center",
    marginBottom: Theme.spacing.sm,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: Theme.spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Theme.colors.slate,
  },
  dividerText: {
    fontSize: Theme.typography.sizes.caption,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.primary,
    marginHorizontal: Theme.spacing.md,
    letterSpacing: 2,
  },
  formContainer: {
    gap: Theme.spacing.md,
  },
  toggleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Theme.spacing.sm,
  },
  toggleText: {
    fontSize: Theme.typography.sizes.bodySmall,
    color: Theme.colors.textMuted,
  },
  toggleTextBold: {
    fontSize: Theme.typography.sizes.bodySmall,
    color: Theme.colors.primary,
    fontWeight: Theme.typography.weights.bold,
  },
});
