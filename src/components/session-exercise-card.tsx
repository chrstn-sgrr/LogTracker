import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import type { Exercise, SessionExercise, SetEntry } from "@/types";
import { Muted, Title } from "@/components/ui";

function SetRow({
  set,
  editable,
  onChange,
  onRemove,
}: {
  set: SetEntry;
  editable: boolean;
  onChange?: (patch: Partial<Pick<SetEntry, "weight" | "reps" | "done">>) => void;
  onRemove?: () => void;
}) {
  const [weightText, setWeightText] = useState(
    set.weight === 0 ? "" : String(set.weight),
  );
  const [repsText, setRepsText] = useState(
    set.reps === 0 ? "" : String(set.reps),
  );

  const commitWeight = (text: string) => {
    setWeightText(text);
    const value = Number(text);
    if (onChange && Number.isFinite(value) && value >= 0) {
      onChange({ weight: value });
    }
  };
  const commitReps = (text: string) => {
    setRepsText(text);
    const value = Number(text);
    if (onChange && Number.isFinite(value) && value >= 0) {
      onChange({ reps: Math.trunc(value) });
    }
  };

  if (!editable) {
    return (
      <View className="flex-row items-center justify-between py-2">
        <Text className="text-base text-zinc-100 tabular-nums">
          {set.weight} × {set.reps}
        </Text>
        <Text
          className={`text-sm tabular-nums ${set.done ? "text-zinc-50" : "text-zinc-500"}`}
        >
          {set.done ? "done" : "skipped"}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-2 py-1">
      <TextInput
        className="h-11 flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-base text-zinc-50 tabular-nums"
        value={weightText}
        onChangeText={commitWeight}
        keyboardType="decimal-pad"
        placeholder="weight"
        placeholderTextColor="#71717a"
        inputMode="decimal"
      />
      <TextInput
        className="h-11 flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-base text-zinc-50 tabular-nums"
        value={repsText}
        onChangeText={commitReps}
        keyboardType="number-pad"
        placeholder="reps"
        placeholderTextColor="#71717a"
        inputMode="numeric"
      />
      <Pressable
        onPress={() => onChange?.({ done: !set.done })}
        className={`h-11 w-11 items-center justify-center rounded-lg border ${
          set.done
            ? "border-zinc-50 bg-zinc-50"
            : "border-zinc-800 bg-zinc-950 active:bg-zinc-800"
        }`}
      >
        <Text
          className={`text-base font-bold ${set.done ? "text-zinc-950" : "text-zinc-500"}`}
        >
          ✓
        </Text>
      </Pressable>
      <Pressable
        onPress={onRemove}
        className="h-11 w-9 items-center justify-center rounded-lg active:bg-zinc-800"
      >
        <Text className="text-lg text-zinc-500">✕</Text>
      </Pressable>
    </View>
  );
}

export function SessionExerciseCard({
  entry,
  exercise,
  prevPerformance,
  editable = false,
  onChangeSet,
  onRemoveSet,
  onAddSet,
  onRemoveExercise,
}: {
  entry: SessionExercise;
  exercise: Exercise | undefined;
  prevPerformance: SessionExercise | null;
  editable?: boolean;
  onChangeSet?: (
    setId: string,
    patch: Partial<Pick<SetEntry, "weight" | "reps" | "done">>,
  ) => void;
  onRemoveSet?: (setId: string) => void;
  onAddSet?: () => void;
  onRemoveExercise?: () => void;
}) {
  return (
    <View className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <View className="flex-row items-center justify-between">
        <Title>{exercise?.name ?? "Unknown exercise"}</Title>
        {editable && onRemoveExercise && (
          <Pressable
            onPress={onRemoveExercise}
            className="px-2 py-1 active:opacity-60"
          >
            <Text className="text-sm text-zinc-500">Remove</Text>
          </Pressable>
        )}
      </View>

      {prevPerformance && (
        <View className="mt-2 rounded-lg bg-zinc-950 p-2.5">
          <Text className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Last time
          </Text>
          <Text className="mt-1 text-sm text-zinc-400 tabular-nums">
            {prevPerformance.sets
              .map((s) => `${s.weight} × ${s.reps}`)
              .join("  ·  ")}
          </Text>
        </View>
      )}

      <View className="mt-3">
        {entry.sets.map((set) => (
          <SetRow
            key={set.id}
            set={set}
            editable={editable}
            onChange={editable ? (patch) => onChangeSet?.(set.id, patch) : undefined}
            onRemove={
              editable && onRemoveSet ? () => onRemoveSet(set.id) : undefined
            }
          />
        ))}
        {entry.sets.length === 0 && (
          <Muted>{editable ? "No sets yet — add your first set." : "No sets logged."}</Muted>
        )}
      </View>

      {editable && onAddSet && (
        <Pressable
          onPress={onAddSet}
          className="mt-3 items-center rounded-lg border border-dashed border-zinc-700 py-2.5 active:bg-zinc-800"
        >
          <Text className="text-sm font-medium text-zinc-400">+ Add set</Text>
        </Pressable>
      )}

      {!editable && prevPerformance === null && (
        <Muted className="mt-2">First time logging this exercise.</Muted>
      )}
    </View>
  );
}
