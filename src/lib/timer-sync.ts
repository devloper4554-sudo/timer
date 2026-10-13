import { createServerFn } from "@tanstack/react-start";

export interface TimerPersistedState {
  isRunning: boolean;
  viewMode: "launch" | "main";
  startTime: number | null;
  targetEndTime: number | null;
  remainingSeconds: number;
  totalSeconds: number;
  updatedAt: number;
}

export const TOTAL_SECONDS = 24 * 60 * 60;

// Default initial state
export const defaultTimerState: TimerPersistedState = {
  isRunning: false,
  viewMode: "launch",
  startTime: null,
  targetEndTime: null,
  remainingSeconds: TOTAL_SECONDS,
  totalSeconds: TOTAL_SECONDS,
  updatedAt: Date.now(),
};

// Compute active remaining seconds based on real-world wall clock
export function computeActiveState(state: TimerPersistedState): TimerPersistedState {
  if (state.isRunning && state.targetEndTime) {
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((state.targetEndTime - now) / 1000));
    if (remaining <= 0) {
      return {
        ...state,
        isRunning: false,
        remainingSeconds: 0,
        updatedAt: now,
      };
    }
    return {
      ...state,
      remainingSeconds: remaining,
      updatedAt: now,
    };
  }
  return state;
}

// In-memory cache for server process
let inMemoryServerState: TimerPersistedState = { ...defaultTimerState };

async function loadServerStateFromFile(): Promise<TimerPersistedState> {
  if (typeof window !== "undefined") return inMemoryServerState;
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const filePath = path.resolve(process.cwd(), ".timer-state.json");
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed.totalSeconds === "number") {
        inMemoryServerState = { ...defaultTimerState, ...parsed };
        return inMemoryServerState;
      }
    }
  } catch {
    // Disk persistence unavailable or unneeded (e.g. serverless memory)
  }
  return inMemoryServerState;
}

async function saveServerStateToFile(state: TimerPersistedState) {
  inMemoryServerState = { ...state, updatedAt: Date.now() };
  if (typeof window !== "undefined") return;
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const filePath = path.resolve(process.cwd(), ".timer-state.json");
    fs.writeFileSync(filePath, JSON.stringify(inMemoryServerState, null, 2), "utf-8");
  } catch {
    // Fallback to in-memory
  }
}

// Server functions:
export const getServerTimerState = createServerFn({ method: "GET" }).handler(async () => {
  const loaded = await loadServerStateFromFile();
  const computed = computeActiveState(loaded);
  if (loaded.isRunning && computed.remainingSeconds <= 0 && loaded.remainingSeconds > 0) {
    await saveServerStateToFile(computed);
  }
  return computed;
});

export const updateServerTimerState = createServerFn({ method: "POST" })
  .validator((data: Partial<TimerPersistedState>) => data)
  .handler(async ({ data }) => {
    const current = await loadServerStateFromFile();
    const nextState: TimerPersistedState = {
      ...current,
      ...data,
      updatedAt: Date.now(),
    };
    await saveServerStateToFile(nextState);
    return computeActiveState(nextState);
  });
