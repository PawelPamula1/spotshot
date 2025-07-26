import SignInForm from "@/components/ui/SignInForm";
import SignUpForm from "@/components/ui/SignUpForm";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {mode === "login" ? "Sign In" : "Create Account"}
      </Text>

      {mode === "login" ? <SignInForm /> : <SignUpForm />}

      <TouchableOpacity
        onPress={() => setMode(mode === "login" ? "register" : "login")}
      >
        <Text style={styles.toggleText}>
          {mode === "login"
            ? "Don't have an account? Register"
            : "Already have an account? Sign In"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 32,
  },
  toggleText: {
    marginTop: 24,
    textAlign: "center",
    color: "#4F46E5",
    fontWeight: "600",
  },
});
