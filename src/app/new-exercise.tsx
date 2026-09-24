import { useState } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Button, Input, Muted, Title } from "@/components/ui";
import { useAppStore } from "@/store";
import { MUSCLE_GROUPS } from "@/types";
import type { MuscleGroup } from "@/types";

export default function NewExerciseScreen() {
  const addCustomExercise = useAppStore((s) => s.addCustomExercise);
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | null>(null);

  const valid = name.trim().length > 0 && muscleGroup !== null;

  return (
    <View className="flex-1 bg-zinc-950">
      <ScrollView contentContainerClassName="gap-4 p-4">
        <View>
          <Title>Name</Title>
          <Input
            className="mt-2"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Smith Machine RDL"
            autoFocus
          />
        </View>

        <View>
          <Title>Muscle group</Title>
          <View className="mt-2 flex-row flex-wrap gap-2">
            {MUSCLE_GROUPS.map((group) => {
              const selected = group === muscleGroup;
              return (
                <Pressable
                  key={group}
                  onPress={() => setMuscleGroup(group)}
                  className={`rounded-xl px-4 py-2.5 ${
                    selected
                      ? "bg-zinc-50 active:bg-zinc-300"
                      : "border border-zinc-700 bg-zinc-900 active:bg-zinc-800"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold capitalize ${
                      selected ? "text-zinc-950" : "text-zinc-400"
                    }`}
                  >
                    {group}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Button
          title="Save exercise"
          disabled={!valid}
          onPress={() => {
            if (!valid) return;
            addCustomExercise(name.trim(), muscleGroup as MuscleGroup);
            router.back();
          }}
        />

        <Muted>Custom exercises appear alongside the built-in list.</Muted>
      </ScrollView>
    </View>
  );
}
