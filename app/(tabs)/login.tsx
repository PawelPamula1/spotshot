import SignInForm from "@/components/ui/SignInForm";
import SignUpForm from "@/components/ui/SignUpForm";
import { Theme } from "@/constants/Theme";
import { Stack } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
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
import { LinearGradient } from "expo-linear-gradient";

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
        <View style={[styles.decorativeCircle, styles.decorativeCircleBottom]} />

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
                  <View style={styles.logoFrame}>
                    <Text style={styles.logoIcon}>📸</Text>
                  </View>
                </View>

                <Text style={styles.appName}>SpotShot</Text>
                <Text style={styles.tagline}>
                  Discover the world's most{"\n"}photogenic locations
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
    paddingVertical: Theme.spacing.xxxl,
  },
  inner: {
    paddingHorizontal: Theme.spacing.lg,
  },
  hero: {
    alignItems: "center",
    marginBottom: Theme.spacing.xl,
  },
  logoContainer: {
    marginBottom: Theme.spacing.lg,
  },
  logoFrame: {
    width: 80,
    height: 80,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...Theme.shadows.medium,
    borderWidth: 3,
    borderColor: Theme.colors.primaryLight,
  },
  logoIcon: {
    fontSize: 40,
  },
  appName: {
    fontSize: Theme.typography.sizes.hero,
    fontWeight: Theme.typography.weights.black,
    color: Theme.colors.offWhite,
    marginBottom: Theme.spacing.sm,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.textMuted,
    textAlign: "center",
    lineHeight: Theme.typography.sizes.body * Theme.typography.lineHeights.relaxed,
    marginBottom: Theme.spacing.xl,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: Theme.spacing.lg,
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
    gap: Theme.spacing.lg,
  },
  toggleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Theme.spacing.md,
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
