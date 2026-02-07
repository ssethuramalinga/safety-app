import React from "react";
import { View, Text } from "react-native";
import { Colors } from "../../../theme/colors";

export default function MapScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 16 }}>
      <View
        style={{
          backgroundColor: Colors.card,
          borderRadius: 18,
          padding: 16,
          borderWidth: 1,
          borderColor: Colors.border,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "900", color: Colors.textDark }}>
          Map
        </Text>
        <Text style={{ marginTop: 8, color: Colors.textMedium, lineHeight: 20 }}>
          Placeholder screen — you’ll add location features later.
        </Text>
      </View>
    </View>
  );
}
