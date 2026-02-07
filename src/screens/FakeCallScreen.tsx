import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../types/navigation";
import { Colors } from "../theme/colors";
import { getScenario } from "../data/scenarios";

type R = RouteProp<RootStackParamList, "Call">;

function formatMMSS(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  const mmStr = mm < 10 ? `0${mm}` : `${mm}`;
  const ssStr = ss < 10 ? `0${ss}` : `${ss}`;
  return `${mmStr}:${ssStr}`;
}

export default function FakeCallScreen() {
  const navigation = useNavigation();
  const route = useRoute<R>();
  const scenario = useMemo(() => getScenario(route.params.scenarioKey), [route.params.scenarioKey]);

  const soundRef = useRef<Audio.Sound | null>(null);
  const [currentSec, setCurrentSec] = useState(0);
  const [connected, setConnected] = useState(false);
  const [ended, setEnded] = useState(false);

  const callTimeSec = connected ? Math.max(0, currentSec - scenario.ringEndsSec) : 0;

  const activePrompt = useMemo(() => {
    return scenario.prompts.find((p) => currentSec >= p.startSec && currentSec < p.endSec);
  }, [scenario.prompts, currentSec]);

  const promptRemaining = useMemo(() => {
    if (!activePrompt) return 0;
    return Math.max(0, Math.ceil(activePrompt.endSec - currentSec));
  }, [activePrompt, currentSec]);

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    return () => {
      StatusBar.setBarStyle("dark-content");
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function start() {
      // iOS: play even on silent mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      if (!scenario.hasAudio || !scenario.audioAsset) {
        // no audio scenario: still run timers so UI feels real
        const t0 = Date.now();
        const interval = setInterval(() => {
          if (!mounted) return;
          const sec = (Date.now() - t0) / 1000;
          setCurrentSec(sec);
          if (!connected && sec >= scenario.ringEndsSec) setConnected(true);
        }, 120);

        return () => clearInterval(interval);
      }

      const { sound } = await Audio.Sound.createAsync(
        scenario.audioAsset,
        { shouldPlay: true, positionMillis: 0 },
        (status) => {
          if (!mounted) return;
          if (!status.isLoaded) return;

          const sec = (status.positionMillis ?? 0) / 1000;
          setCurrentSec(sec);

          if (!connected && sec >= scenario.ringEndsSec) setConnected(true);

          // if audio ends, mark ended
          if (status.didJustFinish) {
            setEnded(true);
          }
        }
      );

      soundRef.current = sound;
    }

    const cleanupPromise = start();

    return () => {
      mounted = false;
      (async () => {
        try {
          const maybeCleanup = await cleanupPromise;
          if (typeof maybeCleanup === "function") maybeCleanup();
        } catch {}
        try {
          if (soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
          }
        } catch {}
        soundRef.current = null;
      })();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const endCall = async () => {
    setEnded(true);
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      }
    } catch {}
    soundRef.current = null;
    // go back to Home (Tabs already behind)
    // @ts-ignore
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#111" }}>
      <LinearGradient
        colors={["#2A2A2A", "#1B1B1B", "#121212"]}
        style={{ flex: 1, paddingTop: 58, paddingHorizontal: 18 }}
      >
        {/* top row icons */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <Ionicons name="volume-high-outline" size={22} color="#fff" />
            <Ionicons name="wifi-outline" size={22} color="#fff" />
          </View>

          <Ionicons name="information-circle-outline" size={26} color="#fff" />
        </View>

        {/* call status */}
        <View style={{ marginTop: 44, alignItems: "center" }}>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 22, fontWeight: "700" }}>
            {ended ? "Call Ended" : connected ? formatMMSS(callTimeSec) : "Calling…"}
          </Text>

          <Text
            style={{
              marginTop: 10,
              color: "#fff",
              fontSize: 52,
              fontWeight: "900",
              letterSpacing: 0.4,
            }}
          >
            David
          </Text>

          {/* subtle “no audio” label (kept discreet) */}
          {!scenario.hasAudio && (
            <View
              style={{
                marginTop: 10,
                backgroundColor: "rgba(255,255,255,0.08)",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
              }}
            >
              <Text style={{ color: "rgba(255,255,255,0.7)", fontWeight: "700" }}>
                Practice screen (audio coming soon)
              </Text>
            </View>
          )}
        </View>

        {/* SAY prompt overlay with countdown timer */}
        {activePrompt && !ended && (
          <View
            style={{
              position: "absolute",
              left: 18,
              right: 18,
              top: 170,
              backgroundColor: "rgba(255,255,255,0.10)",
              borderRadius: 18,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.18)",
              padding: 14,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 14 }}>
                Say:
              </Text>

              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.14)",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "900" }}>
                  {promptRemaining}s
                </Text>
              </View>
            </View>

            <Text style={{ marginTop: 8, color: "#fff", fontSize: 16, fontWeight: "800", lineHeight: 22 }}>
              {activePrompt.sayText}
            </Text>
            <Text style={{ marginTop: 6, color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
              Speak naturally — stop before the timer hits 0 so the voice doesn’t “interrupt.”
            </Text>
          </View>
        )}

        {/* buttons grid */}
        <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 36 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 18 }}>
            <CallButton icon="volume-high" label="Audio" />
            <CallButton icon="videocam" label="FaceTime" disabled />
            <CallButton icon="mic-off" label="Mute" disabled />
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 18 }}>
            <CallButton icon="person-add" label="Add" disabled />
            <Pressable
              onPress={endCall}
              style={({ pressed }) => [
                {
                  width: 86,
                  height: 86,
                  borderRadius: 43,
                  backgroundColor: Colors.dangerRed,
                  alignItems: "center",
                  justifyContent: "center",
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Ionicons name="call" size={36} color="#fff" />
              <Text style={{ marginTop: 6, color: "#fff", fontWeight: "900" }}>End</Text>
            </Pressable>
            <CallButton icon="keypad" label="Keypad" disabled />
          </View>

          <Text style={{ textAlign: "center", color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
            Scenario: {scenario.title}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

function CallButton({
  icon,
  label,
  disabled,
}: {
  icon: any;
  label: string;
  disabled?: boolean;
}) {
  return (
    <View style={{ width: 86, alignItems: "center" }}>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: disabled ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.10)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={28} color={disabled ? "rgba(255,255,255,0.35)" : "#fff"} />
      </View>
      <Text
        style={{
          marginTop: 10,
          color: disabled ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.9)",
          fontWeight: "800",
        }}
      >
        {label}
      </Text>
    </View>
  );
}
