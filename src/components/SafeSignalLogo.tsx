import React from "react";
import { View } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { Colors } from "../theme/colors";

export default function SafeSignalLogo({ size = 92 }: { size?: number }) {
  const inner = Math.max(40, size - 26);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.purple,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
      }}
    >
      <View
        style={{
          width: inner,
          height: inner,
          borderRadius: inner / 2,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Svg width={inner * 0.62} height={inner * 0.62} viewBox="0 0 64 64">
          <Circle cx="32" cy="32" r="31" fill={Colors.lightPurple} />
          <Path
            d="M32 8c8 6 16 6 24 8v16c0 14-10 22-24 28C18 54 8 46 8 32V16c8-2 16-2 24-8z"
            fill={Colors.purple}
          />
          <Path
            d="M22 33l6 6 14-16"
            stroke="#fff"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    </View>
  );
}
