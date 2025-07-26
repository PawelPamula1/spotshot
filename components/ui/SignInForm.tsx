import { useAuth } from "@/provider/AuthProvider";
import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

export default function SignInForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    signIn();
    setLoading(false);

    // if (error) {
    //   Alert.alert("Login Failed", error);
    // }
  };

  return (
    <View>
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
        title={loading ? "Signing in..." : "Sign In"}
        onPress={handleSignIn}
        disabled={loading}
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
