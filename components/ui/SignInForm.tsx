import { Theme } from "@/constants/Theme";
import { useAuth } from "@/provider/AuthProvider";
import React, { useState, useRef } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";

export default function SignInForm() {
  const { signIn, isSigningIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const buttonScale = useRef(new Animated.Value(1)).current;

  const handleSignIn = async () => {
    const res = await signIn(email, password);
    if (!res.ok) Alert.alert("Login Failed", res.error);
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <View
          style={[
            styles.inputWrapper,
            focusedField === "email" && styles.inputWrapperFocused,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor={Theme.colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <View
          style={[
            styles.inputWrapper,
            focusedField === "password" && styles.inputWrapperFocused,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={Theme.colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
          />
        </View>
      </View>

      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={[styles.button, isSigningIn && styles.buttonDisabled]}
          onPress={handleSignIn}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isSigningIn}
          activeOpacity={1}
        >
          <Text style={styles.buttonText}>
            {isSigningIn ? "Signing in..." : "Sign In"}
          </Text>
          <View style={styles.buttonAccent} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Theme.spacing.lg,
  },
  inputGroup: {
    gap: Theme.spacing.sm,
  },
  label: {
    fontSize: Theme.typography.sizes.bodySmall,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.offWhite,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  inputWrapper: {
    backgroundColor: Theme.colors.darkNavy,
    borderRadius: Theme.radius.md,
    borderWidth: 2,
    borderColor: Theme.colors.slate,
    overflow: "hidden",
  },
  inputWrapperFocused: {
    borderColor: Theme.colors.primary,
    ...Theme.shadows.soft,
  },
  input: {
    padding: Theme.spacing.md,
    color: Theme.colors.textLight,
    fontSize: Theme.typography.sizes.body,
  },
  button: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.md + 2,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Theme.spacing.sm,
    ...Theme.shadows.medium,
    position: "relative",
    overflow: "hidden",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.offWhite,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  buttonAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Theme.colors.primaryDark,
  },
});
