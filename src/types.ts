export type MuscleGroup =
  | "chest"
  | "back"
  | "legs"
  | "shoulders"
  | "arms"
  | "core";

export type Unit = "lb" | "kg";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  isCustom: boolean;
  createdAt: number;
}

export interface SetEntry {
  id: string;
  weight: number;
  reps: number;
  done: boolean;
}

export interface SessionExercise {
  id: string;
  exerciseId: string;
  sets: SetEntry[];
}

export interface Session {
  id: string;
  startedAt: number;
  endedAt: number | null;
  exercises: SessionExercise[];
}

export const MUSCLE_GROUPS: MuscleGroup[] = [
  "chest",
  "back",
  "legs",
  "shoulders",
  "arms",
  "core",
];
