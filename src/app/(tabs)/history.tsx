import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Card, Muted } from "@/components/ui";
import { formatDateTime, formatWeight, sessionVolume } from "@/domain";
import { useAppStore } from "@/store";

export default function HistoryScreen() {
  const sessions = useAppStore((s) => s.sessions);
  const unit = useAppStore((s) => s.unit);
  const completed = sessions.filter((s) => s.endedAt !== null);

  return (
    <View className="flex-1 bg-zinc-950">
      <ScrollView contentContainerClassName="gap-3 p-4">
        {completed.length === 0 && (
          <Card>
            <Muted>No completed sessions yet.</Muted>
          </Card>
        )}
        {completed.map((session) => (
          <Pressable
            key={session.id}
            onPress={() => router.push(`/session/${session.id}`)}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 active:bg-zinc-800"
          >
            <Text className="text-base font-semibold text-zinc-50">
              {formatDateTime(session.endedAt ?? session.startedAt)}
            </Text>
            <Muted className="mt-1 tabular-nums">
              {session.exercises.length} exercises ·{" "}
              {formatWeight(sessionVolume(session), unit)} volume
            </Muted>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
