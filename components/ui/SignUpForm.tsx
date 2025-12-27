import { Theme } from "@/constants/Theme";
import { useAuth } from "@/provider/AuthProvider";
import { Checkbox } from "expo-checkbox";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState, useRef } from "react";
import {
  Alert,
  Animated,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpForm({
  setMode,
}: {
  setMode: (mode: "login" | "register") => void;
}) {
  const { signUp, isSigningUp } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const buttonScale = useRef(new Animated.Value(1)).current;

  const handleSignUp = async () => {
    if (!accepted) {
      Alert.alert(
        "Terms Required",
        "You must accept the Terms and Privacy Policy."
      );
      return;
    }
    const res = await signUp(email, password, username);
    if (!res.ok) {
      const msg =
        res.fieldErrors?.email ||
        res.fieldErrors?.username ||
        res.fieldErrors?.password ||
        res.error;
      Alert.alert("Sign Up Failed", msg);
    } else {
      Alert.alert(
        "Success",
        "Account created! Please check your email to confirm your account.",
        [
          {
            text: "OK",
            onPress: () => setMode("login"),
          },
        ]
      );
    }
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
      {/* Username Field */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Username</Text>
        <View
          style={[
            styles.inputWrapper,
            focusedField === "username" && styles.inputWrapperFocused,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Choose a username"
            placeholderTextColor={Theme.colors.textMuted}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            onFocus={() => setFocusedField("username")}
            onBlur={() => setFocusedField(null)}
          />
        </View>
      </View>

      {/* Email Field */}
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

      {/* Password Field */}
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
            placeholder="Create a strong password"
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

      {/* Terms Checkbox */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setAccepted(!accepted)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.checkboxBox,
            accepted && styles.checkboxBoxChecked,
          ]}
        >
          {accepted && (
            <MaterialIcons
              name="check"
              size={16}
              color={Theme.colors.offWhite}
            />
          )}
        </View>
        <Text style={styles.checkboxText}>
          I accept the{" "}
          <Text
            style={styles.link}
            onPress={(e) => {
              e.stopPropagation();
              Linking.openURL("https://photospots.dev/en/terms");
            }}
          >
            Terms
          </Text>{" "}
          and{" "}
          <Text
            style={styles.link}
            onPress={(e) => {
              e.stopPropagation();
              Linking.openURL("https://photospots.dev/en/privacy");
            }}
          >
            Privacy Policy
          </Text>
        </Text>
      </TouchableOpacity>

      {/* Register Button */}
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={[styles.button, isSigningUp && styles.buttonDisabled]}
          onPress={handleSignUp}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isSigningUp}
          activeOpacity={1}
        >
          <Text style={styles.buttonText}>
            {isSigningUp ? "Creating account..." : "Create Account"}
          </Text>
          <View style={styles.buttonAccent} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Theme.spacing.md,
  },
  inputGroup: {
    gap: Theme.spacing.xs,
  },
  label: {
    fontSize: Theme.typography.sizes.bodySmall,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.offWhite,
    textTransform: "uppercase",
    letterSpacing: 0.8,
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
    paddingVertical: Theme.spacing.sm + 2,
    paddingHorizontal: Theme.spacing.sm,
    color: Theme.colors.textLight,
    fontSize: Theme.typography.sizes.body,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Theme.spacing.xs,
    paddingVertical: 0,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Theme.colors.slate,
    backgroundColor: Theme.colors.darkNavy,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxBoxChecked: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.primary,
  },
  checkboxText: {
    flex: 1,
    fontSize: Theme.typography.sizes.bodySmall,
    color: Theme.colors.textMuted,
    lineHeight: Theme.typography.sizes.bodySmall * 1.5,
  },
  link: {
    color: Theme.colors.primary,
    fontWeight: Theme.typography.weights.semibold,
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.sm + 4,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Theme.spacing.xs,
    ...Theme.shadows.medium,
    position: "relative",
    overflow: "hidden",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: Theme.typography.sizes.bodySmall,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.offWhite,
    textTransform: "uppercase",
    letterSpacing: 1.2,
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
