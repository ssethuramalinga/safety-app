import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import type { TabsParamList } from "../types/navigation";
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../features/map/screens/MapScreen";
import SettingsScreen from "../features/settings/screens/SettingsScreen";
import { Colors } from "../theme/colors";

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.purple,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          height: 74,
          paddingTop: 10,
          paddingBottom: 14,
          borderTopColor: Colors.border,
          backgroundColor: Colors.card,
        },
        tabBarIcon: ({ color, size }) => {
          const icon =
            route.name === "Home"
              ? "home"
              : route.name === "Map"
              ? "location"
              : "settings";
          return <Ionicons name={icon as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
    </Tab.Navigator>
  );
}
