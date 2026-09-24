import { Pressable, ScrollView, Text, View } from "react-native";
import { Card, Title, Muted } from "@/components/ui";
import { useAppStore } from "@/store";
import { MUSCLE_GROUPS } from "@/types";
import type { Unit } from "@/types";

const UNITS: Unit[] = ["lb", "kg"];

export default function SettingsScreen() {
  const unit = useAppStore((s) => s.unit);
  const setUnit = useAppStore((s) => s.setUnit);

  return (
    <View className="flex-1 bg-zinc-950">
      <ScrollView contentContainerClassName="gap-4 p-4">
        <Card>
          <Title>Units</Title>
          <Muted className="mt-1">
            Applies to volume totals. Set weights are stored as entered.
          </Muted>
          <View className="mt-3 flex-row gap-2">
            {UNITS.map((u) => {
              const selected = u === unit;
              return (
                <Pressable
                  key={u}
                  onPress={() => setUnit(u)}
                  className={`rounded-xl px-5 py-2.5 ${
                    selected
                      ? "bg-zinc-50 active:bg-zinc-300"
                      : "border border-zinc-700 bg-zinc-900 active:bg-zinc-800"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${selected ? "text-zinc-950" : "text-zinc-400"}`}
                  >
                    {u}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Card>
          <Muted>
            Data is in-memory only in this version — it resets when the app
            reloads.
          </Muted>
        </Card>

        <Muted className="text-center">
          {MUSCLE_GROUPS.length} muscle groups · LogTracker v0
        </Muted>
      </ScrollView>
    </View>
  );
}
