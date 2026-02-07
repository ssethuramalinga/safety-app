export type ScenarioKey =
  | "uber"
  | "walking"
  | "parking"
  | "bar"
  | "public_transport"
  | "campus"
  | "first_date";

export type RootStackParamList = {
  Cover: undefined;
  Tabs: undefined;
  Call: { scenarioKey: ScenarioKey };
};

export type TabsParamList = {
  Settings: undefined;
  Home: undefined;
  Map: undefined;
};
