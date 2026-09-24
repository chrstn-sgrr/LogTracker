import { useMemo, useState } from "react";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { Button, Input, Muted } from "@/components/ui";
import { MUSCLE_GROUPS } from "@/types";
import type { Exercise } from "@/types";
import { useAppStore } from "@/store";

export default function ExercisesScreen() {
  const exercises = useAppStore((s) => s.exercises);
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      exercises.filter((e) =>
        query ? e.name.toLowerCase().includes(query) : true,
      ),
    [exercises, query],
  );

  const sections = useMemo(
    () =>
      MUSCLE_GROUPS.map((group) => ({
        title: group,
        data: filtered.filter((e) => e.muscleGroup === group),
      })).filter((s) => s.data.length > 0),
    [filtered],
  );

  return (
    <View className="flex-1 bg-zinc-950">
      <ScrollView contentContainerClassName="gap-3 p-4">
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Search exercises"
          autoCapitalize="none"
        />
        <Button
          title="New exercise"
          variant="secondary"
          onPress={() => router.push("/new-exercise")}
        />
        {exercises.length === 0 && (
          <Muted>No exercises yet.</Muted>
        )}
        {sections.map((section) => (
          <View key={section.title}>
            <Text className="pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {section.title}
            </Text>
            <View className="overflow-hidden rounded-2xl border border-zinc-800">
              {section.data.map((exercise, i) => (
                <ExerciseRow key={exercise.id} exercise={exercise} first={i === 0} />
              ))}
            </View>
          </View>
        ))}
        {sections.length === 0 && exercises.length > 0 && (
          <Muted>No exercises match “{search}”.</Muted>
        )}
      </ScrollView>
    </View>
  );
}

function ExerciseRow({ exercise, first }: { exercise: Exercise; first: boolean }) {
  return (
    <View
      className={`bg-zinc-900 px-4 py-3 ${first ? "" : "border-t border-zinc-800"}`}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base text-zinc-100">{exercise.name}</Text>
        {exercise.isCustom && (
          <Text className="text-xs uppercase tracking-wide text-zinc-500">
            custom
          </Text>
        )}
      </View>
    </View>
  );
}
