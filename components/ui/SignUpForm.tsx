import { useAuth } from "@/provider/AuthProvider";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";

export default function SignUpForm() {
  const { signUp, isSigningUp } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    const res = await signUp(email, password, username);
    if (!res.ok) {
      const msg =
        res.fieldErrors?.email ||
        res.fieldErrors?.username ||
        res.fieldErrors?.password ||
        res.error;
      Alert.alert("Sign Up Failed", msg);
    } else {
      Alert.alert("Success", "Account created and you're logged in!");
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
});
