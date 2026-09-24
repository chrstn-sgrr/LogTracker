import { create } from "zustand";
import { createSeedExercises } from "./seed";
import type { Exercise, MuscleGroup, Session, SetEntry, Unit } from "./types";
import { uid } from "./uid";

interface AppState {
  exercises: Exercise[];
  /** Completed and in-progress sessions, newest first. */
  sessions: Session[];
  activeSessionId: string | null;
  unit: Unit;

  addCustomExercise: (name: string, muscleGroup: MuscleGroup) => void;
  startSession: (startedAt?: number) => string;
  addExerciseToSession: (sessionId: string, exerciseId: string) => void;
  removeExerciseFromSession: (sessionId: string, sessionExerciseId: string) => void;
  addSet: (sessionId: string, sessionExerciseId: string) => void;
  updateSet: (
    sessionId: string,
    sessionExerciseId: string,
    setId: string,
    patch: Partial<Pick<SetEntry, "weight" | "reps" | "done">>,
  ) => void;
  removeSet: (sessionId: string, sessionExerciseId: string, setId: string) => void;
  finishSession: (sessionId: string) => void;
  discardSession: (sessionId: string) => void;
  setUnit: (unit: Unit) => void;
}

export const useAppStore = create<AppState>((set) => ({
  exercises: createSeedExercises(),
  sessions: [],
  activeSessionId: null,
  unit: "lb",

  addCustomExercise: (name, muscleGroup) =>
    set((state) => ({
      exercises: [
        ...state.exercises,
        {
          id: uid(),
          name,
          muscleGroup,
          isCustom: true,
          createdAt: Date.now(),
        },
      ],
    })),

  startSession: (startedAt) => {
    const id = uid();
    const session: Session = {
      id,
      startedAt: startedAt ?? Date.now(),
      endedAt: null,
      exercises: [],
    };
    set((state) => ({
      sessions: [session, ...state.sessions],
      activeSessionId: id,
    }));
    return id;
  },

  addExerciseToSession: (sessionId, exerciseId) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              exercises: [
                ...session.exercises,
                { id: uid(), exerciseId, sets: [] },
              ],
            }
          : session,
      ),
    })),

  removeExerciseFromSession: (sessionId, sessionExerciseId) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              exercises: session.exercises.filter(
                (e) => e.id !== sessionExerciseId,
              ),
            }
          : session,
      ),
    })),

  addSet: (sessionId, sessionExerciseId) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              exercises: session.exercises.map((entry) =>
                entry.id === sessionExerciseId
                  ? {
                      ...entry,
                      sets: [
                        ...entry.sets,
                        { id: uid(), weight: 0, reps: 0, done: false },
                      ],
                    }
                  : entry,
              ),
            }
          : session,
      ),
    })),

  updateSet: (sessionId, sessionExerciseId, setId, patch) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              exercises: session.exercises.map((entry) =>
                entry.id === sessionExerciseId
                  ? {
                      ...entry,
                      sets: entry.sets.map((s) =>
                        s.id === setId ? { ...s, ...patch } : s,
                      ),
                    }
                  : entry,
              ),
            }
          : session,
      ),
    })),

  removeSet: (sessionId, sessionExerciseId, setId) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              exercises: session.exercises.map((entry) =>
                entry.id === sessionExerciseId
                  ? {
                      ...entry,
                      sets: entry.sets.filter((s) => s.id !== setId),
                    }
                  : entry,
              ),
            }
          : session,
      ),
    })),

  finishSession: (sessionId) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, endedAt: Date.now() }
          : session,
      ),
      activeSessionId:
        state.activeSessionId === sessionId ? null : state.activeSessionId,
    })),

  discardSession: (sessionId) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== sessionId),
      activeSessionId:
        state.activeSessionId === sessionId ? null : state.activeSessionId,
    })),

  setUnit: (unit) => set({ unit }),
}));
