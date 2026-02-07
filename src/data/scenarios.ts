import type { ScenarioKey } from "../types/navigation";

export type PromptWindow = {
  id: string;
  sayText: string;
  startSec: number; // when user should START speaking
  endSec: number;   // when user should STOP speaking
};

export type Scenario = {
  key: ScenarioKey;
  title: string;
  subtitle: string;
  quickStart: boolean;
  hasAudio: boolean;
  ringEndsSec: number;
  audioAsset?: any; // require(...)
  prompts: PromptWindow[];
  comingSoonBadge?: boolean;
};

const deterrenceWalking =
  "Hey—I'm on the phone. My friend is expecting me right now.";
const deterrenceParking =
  "Hold on—I'm on the phone. I'm at my car now, and someone is meeting me.";

export const SCENARIOS: Scenario[] = [
  {
    key: "uber",
    title: "In an Uber",
    subtitle: "Tap to start the call screen",
    quickStart: true,
    hasAudio: true,
    ringEndsSec: 10,
    audioAsset: require("../../assets/audio/finished_uber_audio.mp3"),
    prompts: [
      { id: "uber-1", sayText: "Hey.", startSec: 10, endSec: 12 },
      { id: "uber-2", sayText: "I’ll be there in __ minutes.", startSec: 15, endSec: 17 },
      { id: "uber-3", sayText: "Driver is __, car is __.", startSec: 22, endSec: 25 },
      { id: "uber-4", sayText: "Okay.", startSec: 30, endSec: 31 },
      { id: "uber-5", sayText: "I’ll be there.", startSec: 34, endSec: 36 },
    ],
  },
  {
    key: "walking",
    title: "Walking Alone",
    subtitle: "Tap to start the call screen",
    quickStart: true,
    hasAudio: true,
    ringEndsSec: 10,
    audioAsset: require("../../assets/audio/walking_alone_completed.mp3"),
    prompts: [
      { id: "walk-1", sayText: "Hey.", startSec: 11, endSec: 12 },
      { id: "walk-2", sayText: "I’m on __ street / by __.", startSec: 18, endSec: 21 },
      { id: "walk-3", sayText: "Yeah, heading to a brighter area.", startSec: 27, endSec: 30 },
      { id: "walk-4", sayText: deterrenceWalking, startSec: 35, endSec: 37 },
      { id: "walk-5", sayText: "I’m heading inside.", startSec: 42, endSec: 56 },
    ],
  },
  {
    key: "parking",
    title: "Parking Garage",
    subtitle: "Tap to start the call screen",
    quickStart: true,
    hasAudio: true,
    ringEndsSec: 10,
    audioAsset: require("../../assets/audio/finished_parking_lot.mp3"),
    prompts: [
      { id: "park-1", sayText: "Hey.", startSec: 10, endSec: 12 },
      { id: "park-2", sayText: "Level __, row __.", startSec: 18, endSec: 22 },
      { id: "park-3", sayText: "Alright, I’ll do that.", startSec: 29, endSec: 32 },
      { id: "park-4", sayText: deterrenceParking, startSec: 38, endSec: 42 },
    ],
  },

  // More scenarios (NO audio, but still go to call screen)
  {
    key: "bar",
    title: "At a Bar",
    subtitle: "Tap to open the call screen",
    quickStart: false,
    hasAudio: false,
    ringEndsSec: 10,
    comingSoonBadge: true,
    prompts: [],
  },
  {
    key: "public_transport",
    title: "Public Transportation",
    subtitle: "Tap to open the call screen",
    quickStart: false,
    hasAudio: false,
    ringEndsSec: 10,
    comingSoonBadge: true,
    prompts: [],
  },
  {
    key: "campus",
    title: "On Campus",
    subtitle: "Tap to open the call screen",
    quickStart: false,
    hasAudio: false,
    ringEndsSec: 10,
    comingSoonBadge: true,
    prompts: [],
  },
  {
    key: "first_date",
    title: "First Date Exit",
    subtitle: "Tap to open the call screen",
    quickStart: false,
    hasAudio: false,
    ringEndsSec: 10,
    comingSoonBadge: true,
    prompts: [],
  },
];

export const getScenario = (key: ScenarioKey) => {
  const s = SCENARIOS.find((x) => x.key === key);
  if (!s) throw new Error(`Scenario not found: ${key}`);
  return s;
};
