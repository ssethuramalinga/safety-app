import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { Colors } from "../theme/colors";
import SafeSignalLogo from "../components/SafeSignalLogo";
import ScenarioCard from "../components/ScenarioCard";
import { SCENARIOS } from "../data/scenarios";

type Nav = NativeStackNavigationProp<RootStackParamList, "Tabs">;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();

  const quick = SCENARIOS.filter((s) => s.quickStart);
  const more = SCENARIOS.filter((s) => !s.quickStart);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Header card */}
        <View
          style={{
            backgroundColor: Colors.card,
            borderRadius: 18,
            padding: 14,
            borderWidth: 1,
            borderColor: Colors.border,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <SafeSignalLogo size={54} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: "900", color: Colors.textDark }}>
              SafeSignal
            </Text>
            <Text style={{ color: Colors.textMedium }}>
              Choose a scenario to start a discreet call.
            </Text>
          </View>
        </View>

        {/* Tip box */}
        <View
          style={{
            marginTop: 12,
            backgroundColor: Colors.warningYellow,
            borderRadius: 16,
            padding: 12,
            borderWidth: 1,
            borderColor: Colors.warningOrange,
          }}
        >
          <Text style={{ color: Colors.textDark, fontWeight: "800" }}>
            ✨ Tip: Use Speaker. Follow the on-screen “Say:” prompts during pauses.
          </Text>
        </View>

        <Text style={{ marginTop: 18, fontSize: 22, fontWeight: "900", color: Colors.textDark }}>
          Quick Start
        </Text>

        <View style={{ marginTop: 10 }}>
          {quick.map((s) => (
            <ScenarioCard
              key={s.key}
              title={s.title}
              subtitle={s.subtitle}
              quickStart
              onPress={() => navigation.navigate("Call", { scenarioKey: s.key })}
            />
          ))}
        </View>

        <Text style={{ marginTop: 14, fontSize: 22, fontWeight: "900", color: Colors.textDark }}>
          More Scenarios
        </Text>

        <View style={{ marginTop: 10 }}>
          {more.map((s) => (
            <ScenarioCard
              key={s.key}
              title={s.title}
              subtitle={s.subtitle}
              quickStart={false}
            
              onPress={() => navigation.navigate("Call", { scenarioKey: s.key })}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
