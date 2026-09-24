import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SessionExerciseCard } from "@/components/session-exercise-card";
import { Button, Card, Muted, Title } from "@/components/ui";
import {
  formatDateTime,
  formatWeight,
  lastPerformanceFor,
  sessionVolume,
} from "@/domain";
import { useAppStore } from "@/store";

export default function WorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const session = useAppStore((s) => s.sessions.find((x) => x.id === id));
  const exercises = useAppStore((s) => s.exercises);
  const sessions = useAppStore((s) => s.sessions);
  const unit = useAppStore((s) => s.unit);
  const removeExerciseFromSession = useAppStore(
    (s) => s.removeExerciseFromSession,
  );
  const addSet = useAppStore((s) => s.addSet);
  const updateSet = useAppStore((s) => s.updateSet);
  const removeSet = useAppStore((s) => s.removeSet);
  const finishSession = useAppStore((s) => s.finishSession);
  const discardSession = useAppStore((s) => s.discardSession);

  useEffect(() => {
    if (session && session.endedAt !== null) {
      router.replace("/(tabs)");
    }
  }, [session?.endedAt, session, id]);

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-950">
        <Muted>Session not found.</Muted>
      </View>
    );
  }

  const exerciseById = (exerciseId: string) =>
    exercises.find((e) => e.id === exerciseId);

  const markDone = (sessionId: string, sessionExerciseId: string, setId: string, patch: Parameters<typeof updateSet>[3]) => {
    updateSet(sessionId, sessionExerciseId, setId, patch);
  };

  return (
    <View className="flex-1 bg-zinc-950">
      <ScrollView contentContainerClassName="gap-4 p-4">
        <Muted>
          {formatDateTime(session.startedAt)} ·{" "}
          {formatWeight(sessionVolume(session), unit)} volume
        </Muted>

        {session.exercises.length === 0 && (
          <Card>
            <Title>Empty workout</Title>
            <Muted className="mt-1">
              Add exercises to start logging sets.
            </Muted>
          </Card>
        )}

        {session.exercises.map((entry) => (
          <SessionExerciseCard
            key={entry.id}
            entry={entry}
            exercise={exerciseById(entry.exerciseId)}
            prevPerformance={lastPerformanceFor(
              entry.exerciseId,
              sessions,
              session.startedAt,
            )}
            editable
            onChangeSet={(setId, patch) =>
              markDone(session.id, entry.id, setId, patch)
            }
            onRemoveSet={(setId) => removeSet(session.id, entry.id, setId)}
            onAddSet={() => addSet(session.id, entry.id)}
            onRemoveExercise={() =>
              removeExerciseFromSession(session.id, entry.id)
            }
          />
        ))}

        <Button
          title="Add exercise"
          variant="secondary"
          onPress={() =>
            router.push(`/exercise-picker?sessionId=${session.id}`)
          }
        />

        <View className="mt-2 gap-2">
          <Button title="Finish workout" onPress={() => {
            finishSession(session.id);
            router.replace("/(tabs)");
          }} />
          <Button
            title="Discard workout"
            variant="secondary"
            onPress={() => {
              discardSession(session.id);
              router.replace("/(tabs)");
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
