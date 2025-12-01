import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HeaderLogo } from "@/components/ui/HeaderLogo";
import { Theme } from "@/constants/Theme";
import { useAuth } from "@/provider/AuthProvider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.textMuted,
        headerShown: true,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: Theme.colors.richBlack,
            position: "absolute",
            borderTopWidth: 1,
            borderTopColor: Theme.colors.slate,
          },
          default: {
            backgroundColor: Theme.colors.richBlack,
            borderTopWidth: 1,
            borderTopColor: Theme.colors.slate,
          },
        }),
      }}
    >
      <Tabs.Protected guard={isAuthenticated}>
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="search" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="addSpot"
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
          title: "Spots",
          headerTitle: () => <HeaderLogo title="PhotoSpots" />,
          headerStyle: {
            backgroundColor: Theme.colors.richBlack,
          },
          headerTintColor: Theme.colors.offWhite,
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
