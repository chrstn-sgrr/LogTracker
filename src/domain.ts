import type { Session, SessionExercise, Unit } from "./types";

/**
 * Sessions are expected newest-first in the store.
 * Returns the most recent session exercise (with at least one set)
 * for `exerciseId`, optionally ignoring sessions started at or after
 * `beforeStartedAt` (used to exclude the session currently being logged).
 */
export function lastPerformanceFor(
  exerciseId: string,
  sessions: Session[],
  beforeStartedAt?: number,
): SessionExercise | null {
  for (const session of sessions) {
    if (beforeStartedAt !== undefined && session.startedAt >= beforeStartedAt) {
      continue;
    }
    const entry = session.exercises.find((e) => e.exerciseId === exerciseId);
    if (entry && entry.sets.length > 0) {
      return entry;
    }
  }
  return null;
}

/** Total volume (weight x reps) over completed sets. */
export function sessionVolume(session: Session): number {
  let volume = 0;
  for (const entry of session.exercises) {
    for (const set of entry.sets) {
      if (set.done) {
        volume += set.weight * set.reps;
      }
    }
  }
  return volume;
}

export const LB_PER_KG = 2.2046226218;

export function convertWeight(weight: number, from: Unit, to: Unit): number {
  if (from === to) return weight;
  return from === "kg" ? weight * LB_PER_KG : weight / LB_PER_KG;
}

export function formatWeight(weight: number, unit: Unit): string {
  const rounded = Math.round(weight * 10) / 10;
  const display = rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1);
  return `${display} ${unit}`;
}

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
