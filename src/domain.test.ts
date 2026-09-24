import { describe, expect, it } from "vitest";
import {
  convertWeight,
  formatWeight,
  lastPerformanceFor,
  sessionVolume,
} from "./domain";
import type { Session, SessionExercise } from "./types";

function session(startedAt: number, entries: SessionExercise[]): Session {
  return { id: `s${startedAt}`, startedAt, endedAt: null, exercises: entries };
}

function entry(
  exerciseId: string,
  sets: [weight: number, reps: number, done: boolean][],
): SessionExercise {
  return {
    id: `e-${exerciseId}-${JSON.stringify(sets)}`,
    exerciseId,
    sets: sets.map(([weight, reps, done], i) => ({
      id: `${i}`,
      weight,
      reps,
      done,
    })),
  };
}

describe("lastPerformanceFor", () => {
  const sessions = [
    session(300, [entry("bench", [[100, 5, true]])]),
    session(200, [entry("squat", [[200, 5, true]]), entry("bench", [[95, 8, true]])]),
    session(100, [entry("bench", [[80, 10, true]])]),
  ];

  it("returns the most recent session's entry", () => {
    expect(lastPerformanceFor("bench", sessions)?.sets[0]).toMatchObject({
      weight: 100,
      reps: 5,
    });
  });

  it("ignores sessions started at or after beforeStartedAt", () => {
    const result = lastPerformanceFor("bench", sessions, 300);
    expect(result?.sets[0]).toMatchObject({ weight: 95, reps: 8 });
  });

  it("returns null for unknown exercise", () => {
    expect(lastPerformanceFor("nope", sessions)).toBeNull();
  });

  it("skips entries with zero sets", () => {
    const withEmpty = [session(400, [entry("bench", [])]), ...sessions];
    expect(lastPerformanceFor("bench", withEmpty, 300)?.sets[0]).toMatchObject({
      weight: 95,
    });
  });
});

describe("sessionVolume", () => {
  it("sums only completed sets", () => {
    const s = session(1, [entry("x", [[100, 5, true], [50, 10, false], [80, 3, true]])]);
    expect(sessionVolume(s)).toBe(100 * 5 + 80 * 3);
  });
});

describe("convertWeight", () => {
  it("round-trips lb -> kg -> lb", () => {
    const kg = convertWeight(225, "lb", "kg");
    expect(convertWeight(kg, "kg", "lb")).toBeCloseTo(225, 6);
  });

  it("is identity when units match", () => {
    expect(convertWeight(100, "kg", "kg")).toBe(100);
  });
});

describe("formatWeight", () => {
  it("drops trailing .0", () => {
    expect(formatWeight(100.0, "lb")).toBe("100 lb");
  });

  it("keeps one decimal when needed", () => {
    expect(formatWeight(102.25, "lb")).toBe("102.3 lb");
  });
});
