import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { Button, Card, Muted, Title } from "@/components/ui";
import { formatDateTime, formatWeight, sessionVolume } from "@/domain";
import { useAppStore } from "@/store";

export default function LogScreen() {
  const activeSessionId = useAppStore((s) => s.activeSessionId);
  const sessions = useAppStore((s) => s.sessions);
  const unit = useAppStore((s) => s.unit);
  const startSession = useAppStore((s) => s.startSession);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const lastSession = sessions.find((s) => s.endedAt !== null);

  return (
    <View className="flex-1 bg-zinc-950">
      <ScrollView contentContainerClassName="gap-4 p-4">
        {activeSession ? (
          <Card>
            <Title>Workout in progress</Title>
            <Muted className="mt-1">
              Started {formatDateTime(activeSession.startedAt)}
            </Muted>
            <Button
              title="Continue workout"
              onPress={() => router.push(`/workout/${activeSession.id}`)}
              className="mt-3"
            />
          </Card>
        ) : (
          <Button
            title="Start workout"
            onPress={() => router.push(`/workout/${startSession()}`)}
          />
        )}

        {lastSession ? (
          <Card>
            <Muted>Last session</Muted>
            <Title className="mt-1">
              {lastSession.endedAt ? formatDateTime(lastSession.endedAt) : ""}
            </Title>
            <Muted className="mt-2 tabular-nums">
              {lastSession.exercises.length} exercises ·{" "}
              {formatWeight(sessionVolume(lastSession), unit)} volume
            </Muted>
          </Card>
        ) : (
          <Card>
            <Muted>No sessions yet. Start your first workout.</Muted>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}
