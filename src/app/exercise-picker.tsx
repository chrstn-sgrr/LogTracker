import { useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { Muted } from "@/components/ui";
import { useAppStore } from "@/store";

export default function ExercisePickerScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const exercises = useAppStore((s) => s.exercises);
  const addExerciseToSession = useAppStore((s) => s.addExerciseToSession);
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      exercises
        .filter((e) =>
          query ? e.name.toLowerCase().includes(query) : true,
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [exercises, query],
  );

  return (
    <View className="flex-1 bg-zinc-950">
      <View className="px-4 pb-2 pt-3">
        <TextInput
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-base text-zinc-50"
          value={search}
          onChangeText={setSearch}
          placeholder="Search exercises"
          placeholderTextColor="#71717a"
          autoCapitalize="none"
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-8"
        ItemSeparatorComponent={() => (
          <View className="h-px bg-zinc-800" />
        )}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              addExerciseToSession(sessionId, item.id);
              router.back();
            }}
            className="flex-row items-center justify-between bg-zinc-950 px-1 py-3 active:opacity-60"
          >
            <Text className="text-base text-zinc-100">{item.name}</Text>
            <Text className="text-xs uppercase tracking-wide text-zinc-500">
              {item.muscleGroup}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={<Muted>No exercises match “{search}”.</Muted>}
      />
    </View>
  );
}
