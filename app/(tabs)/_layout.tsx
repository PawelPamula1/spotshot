import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/provider/AuthProvider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { isAuthenticated } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Protected guard={isAuthenticated}>
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore Spots",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="search" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="addspot"
          options={{
            title: "Add Spot",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="add-location-alt" size={24} color={color} />
            ),
          }}
        />
      </Tabs.Protected>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Spots",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="map" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Protected guard={isAuthenticated}>
        <Tabs.Screen
          name="saved"
          options={{
            title: "Saved",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="bookmark-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="person-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs.Protected>

      <Tabs.Protected guard={!isAuthenticated}>
        <Tabs.Screen
          name="login"
          options={{
            title: "Login",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="person-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs.Protected>
    </Tabs>
  );
}
