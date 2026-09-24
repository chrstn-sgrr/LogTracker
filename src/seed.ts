import type { Exercise, MuscleGroup } from "./types";
import { uid } from "./uid";

type SeedLift = [name: string, muscleGroup: MuscleGroup];

const SEED_LIFTS: SeedLift[] = [
  // chest
  ["Barbell Bench Press", "chest"],
  ["Incline Dumbbell Press", "chest"],
  ["Machine Chest Press", "chest"],
  ["Cable Fly", "chest"],
  ["Dumbbell Fly", "chest"],
  ["Push-Up", "chest"],
  // back
  ["Barbell Deadlift", "back"],
  ["Barbell Row", "back"],
  ["Chest-Supported Row", "back"],
  ["Seated Cable Row", "back"],
  ["Lat Pulldown", "back"],
  ["Pull-Up", "back"],
  ["T-Bar Row", "back"],
  // legs
  ["Back Squat", "legs"],
  ["Front Squat", "legs"],
  ["Hack Squat", "legs"],
  ["Leg Press", "legs"],
  ["Romanian Deadlift", "legs"],
  ["Leg Extension", "legs"],
  ["Leg Curl", "legs"],
  ["Bulgarian Split Squat", "legs"],
  ["Standing Calf Raise", "legs"],
  // shoulders
  ["Overhead Press", "shoulders"],
  ["Seated Dumbbell Press", "shoulders"],
  ["Lateral Raise", "shoulders"],
  ["Cable Lateral Raise", "shoulders"],
  ["Rear Delt Fly", "shoulders"],
  ["Face Pull", "shoulders"],
  // arms
  ["Barbell Curl", "arms"],
  ["Dumbbell Curl", "arms"],
  ["Hammer Curl", "arms"],
  ["Preacher Curl", "arms"],
  ["Triceps Pushdown", "arms"],
  ["Skull Crusher", "arms"],
  ["Overhead Triceps Extension", "arms"],
  ["Dip", "arms"],
  // core
  ["Plank", "core"],
  ["Hanging Leg Raise", "core"],
  ["Cable Crunch", "core"],
  ["Ab Wheel Rollout", "core"],
];

export function createSeedExercises(): Exercise[] {
  const now = Date.now();
  return SEED_LIFTS.map(([name, muscleGroup]) => ({
    id: uid(),
    name,
    muscleGroup,
    isCustom: false,
    createdAt: now,
  }));
}
