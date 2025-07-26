import { useAuth } from "@/provider/AuthProvider";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";

export default function SignUpForm() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      Alert.alert("Sign Up Failed", error);
    } else {
      Alert.alert("Success", "Account created and you're logged in!");
    }
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
        title={loading ? "Creating account..." : "Register"}
        onPress={handleSignUp}
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
