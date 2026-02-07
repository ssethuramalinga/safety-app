import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";

export default function ScenarioCard({
  title,
  subtitle,
  onPress,
  quickStart,
  comingSoon,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
  quickStart: boolean;
  comingSoon?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: Colors.card,
          borderRadius: 18,
          padding: 16,
          borderWidth: 1,
          borderColor: Colors.border,
          marginBottom: 12,
          transform: [{ scale: pressed ? 0.995 : 1 }],
        },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: Colors.textDark }}>
            {title}
          </Text>
          <Text style={{ marginTop: 4, color: Colors.textMedium }}>{subtitle}</Text>

          {quickStart && (
            <Text style={{ marginTop: 10, color: Colors.purple, fontWeight: "800" }}>
              Start Call
            </Text>
          )}

          {comingSoon && (
            <View
              style={{
                alignSelf: "flex-start",
                marginTop: 10,
                backgroundColor: Colors.warningYellow,
                borderColor: Colors.warningOrange,
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 999,
              }}
            >
              <Text style={{ color: Colors.warningOrange, fontWeight: "800" }}>
                Coming soon
              </Text>
            </View>
          )}
        </View>

        <Ionicons name="chevron-forward" size={22} color={Colors.purple} />
      </View>
    </Pressable>
  );
}
