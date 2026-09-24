import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SessionExerciseCard } from "@/components/session-exercise-card";
import { Card, Muted, Title } from "@/components/ui";
import {
  formatDateTime,
  formatWeight,
  lastPerformanceFor,
  sessionVolume,
} from "@/domain";
import { useAppStore } from "@/store";

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const session = useAppStore((s) => s.sessions.find((x) => x.id === id));
  const exercises = useAppStore((s) => s.exercises);
  const sessions = useAppStore((s) => s.sessions);
  const unit = useAppStore((s) => s.unit);

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-950">
        <Muted>Session not found.</Muted>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-950">
      <ScrollView contentContainerClassName="gap-4 p-4">
        <Card>
          <Title>
            {formatDateTime(session.endedAt ?? session.startedAt)}
          </Title>
          <Muted className="mt-1 tabular-nums">
            {session.exercises.length} exercises ·{" "}
            {formatWeight(sessionVolume(session), unit)} volume
          </Muted>
        </Card>

        {session.exercises.map((entry) => (
          <SessionExerciseCard
            key={entry.id}
            entry={entry}
            exercise={exercises.find((e) => e.id === entry.exerciseId)}
            prevPerformance={lastPerformanceFor(
              entry.exerciseId,
              sessions,
              session.startedAt,
            )}
          />
        ))}
      </ScrollView>
    </View>
  );
}
