import { useAuth } from "@/provider/AuthProvider";
import { Checkbox } from "expo-checkbox";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Linking,
  StyleSheet,
  Text,
  TextInput,
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

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Your Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={accepted}
          onValueChange={setAccepted}
          color={accepted ? "#007AFF" : undefined}
        />
        <Text style={styles.checkboxText}>
          I accept the{" "}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("https://photospots.dev/en/terms")}
          >
            Terms
          </Text>{" "}
          and{" "}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("https://photospots.dev/en/privacy")}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
      <Button
        title={isSigningUp ? "Creating account..." : "Register"}
        onPress={handleSignUp}
        disabled={isSigningUp}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#1E1E1E",
    padding: 14,
    borderRadius: 8,
    color: "#fff",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkboxText: {
    marginLeft: 8,
    color: "#fff",
    flexShrink: 1,
  },
  link: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});
