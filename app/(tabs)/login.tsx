import SignInForm from "@/components/ui/SignInForm";
import SignUpForm from "@/components/ui/SignUpForm";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Stack.Screen
          options={{
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#121212",
            },
            headerTintColor: "#fff",
          }}
        />
        <View style={styles.inner}>
          <Text style={styles.title}>
            {mode === "login" ? "Sign In" : "Create Account"}
          </Text>

          {mode === "login" ? <SignInForm /> : <SignUpForm setMode={setMode} />}

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
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    padding: 24,
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
