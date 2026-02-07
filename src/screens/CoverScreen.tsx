import React, { useEffect } from "react";
import { View, Text, Pressable, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { Colors } from "../theme/colors";
import SafeSignalLogo from "../components/SafeSignalLogo";

type Nav = NativeStackNavigationProp<RootStackParamList, "Cover">;

export default function CoverScreen() {
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    StatusBar.setBarStyle("dark-content");
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* soft background circles */}
      <View
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: 210,
          backgroundColor: Colors.lightPurple,
          top: -160,
          right: -180,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: 210,
          backgroundColor: Colors.lightPurple,
          bottom: -210,
          left: -220,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 260,
          height: 260,
          borderRadius: 130,
          backgroundColor: Colors.purpleTint,
          top: 170,
          left: -120,
          opacity: 0.6,
        }}
      />

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <SafeSignalLogo size={98} />

        <Text style={{ marginTop: 18, fontSize: 44, fontWeight: "900", color: Colors.textDark }}>
          SafeSignal
        </Text>
        <Text style={{ marginTop: 6, fontSize: 18, color: Colors.textMedium }}>
          Discreet safety companion
        </Text>

        <Text style={{ marginTop: 28, fontSize: 34, fontWeight: "900", color: Colors.textDark }}>
          Feel safer. Instantly.
        </Text>
        <Text
          style={{
            marginTop: 10,
            fontSize: 16,
            color: Colors.textMedium,
            textAlign: "center",
            lineHeight: 22,
            paddingHorizontal: 14,
          }}
        >
          Tap a scenario and launch a realistic call screen with synced prompts.
        </Text>

        <Pressable
          onPress={() => navigation.replace("Tabs")}
          style={({ pressed }) => [
            {
              marginTop: 36,
              width: "100%",
              backgroundColor: Colors.purple,
              borderRadius: 22,
              paddingVertical: 18,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.16,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 10 },
              elevation: 6,
              transform: [{ scale: pressed ? 0.99 : 1 }],
            },
          ]}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "900" }}>
            Enter SafeSignal
          </Text>
        </Pressable>

        <Text
          style={{
            marginTop: 14,
            color: Colors.textLight,
            textAlign: "center",
            fontSize: 12.5,
            lineHeight: 18,
          }}
        >
          Safety tool for deterrence & practice. Not a replacement for emergency services.
        </Text>
      </View>
    </View>
  );
}
