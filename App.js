import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from './SettingsScreen';
import GestureDetectionService from './services/GestureDetectionService';

/**
 * Main App Component
 * Demonstrates the complete safety app with bottom tab navigation
 */

// Placeholder screens for Home and Map tabs
const HomeScreen = () => {
  return null; // Implement your home screen with voice/text buttons
};

const MapScreen = () => {
  return null; // Implement your map with blue light locations
};

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    // Start gesture detection service when app launches
    GestureDetectionService.start();

    // Cleanup when app closes
    return () => {
      GestureDetectionService.stop();
    };
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#5B4FE9',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#e0e0e0',
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <HomeIcon color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Map"
            component={MapScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MapIcon color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <SettingsIcon color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

// Simple icon components (replace with react-native-vector-icons in production)
const HomeIcon = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <text x="2" y="18" fontSize="20">{'\u{1F3E0}'}</text>
  </svg>
);

const MapIcon = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <text x="2" y="18" fontSize="20">{'\u{1F5FA}'}</text>
  </svg>
);

const SettingsIcon = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <text x="2" y="18" fontSize="20">{'\u{2699}'}</text>
  </svg>
);