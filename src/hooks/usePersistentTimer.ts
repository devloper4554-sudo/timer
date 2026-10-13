import { useState, useEffect, useCallback, useRef } from "react";
import {
  TimerPersistedState,
  TOTAL_SECONDS,
  defaultTimerState,
  computeActiveState,
  getServerTimerState,
  updateServerTimerState,
} from "@/lib/timer-sync";

const STORAGE_KEY = "odyssey_timer_state_v1";

function readLocalState(): TimerPersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.totalSeconds === "number") {
      return computeActiveState({ ...defaultTimerState, ...parsed });
    }
  } catch (err) {
    console.warn("[TimerHook] Error reading localStorage:", err);
  }
  return null;
}

function writeLocalState(state: TimerPersistedState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("[TimerHook] Error writing localStorage:", err);
  }
}

export function usePersistentTimer() {
  const [viewMode, setViewModeState] = useState<"launch" | "main">("launch");
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [targetEndTime, setTargetEndTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Keep a ref of state for event handlers & synchronization
  const stateRef = useRef<TimerPersistedState>({ ...defaultTimerState });

  const applyState = useCallback((s: TimerPersistedState) => {
    stateRef.current = s;
    setViewModeState(s.viewMode);
    setRemaining(s.remainingSeconds);
    setIsRunning(s.isRunning);
    setTargetEndTime(s.targetEndTime);
    setStartTime(s.startTime);
  }, []);

  // 1. Initial mount: Load from localStorage first (0ms delay), then sync with server
  useEffect(() => {
    const local = readLocalState();
    if (local) {
      applyState(local);
    }

    // Reconcile with server backend
    getServerTimerState()
      .then((serverState) => {
        if (!serverState) return;
        const currentLocal = readLocalState();
        // If server is currently running, or server state is newer, prioritize server
        if (
          serverState.isRunning ||
          !currentLocal ||
          serverState.updatedAt > (currentLocal.updatedAt ?? 0)
        ) {
          applyState(serverState);
          writeLocalState(serverState);
        } else if (currentLocal && currentLocal.updatedAt > serverState.updatedAt) {
          // Push local state up to server if local is ahead
          updateServerTimerState({ data: currentLocal }).catch(() => {});
        }
      })
      .catch((err) => {
        console.warn("[TimerHook] Server sync fallback to local:", err);
      });
  }, [applyState]);

  // 2. High-precision tick interval based on absolute wall clock (Date.now())
  useEffect(() => {
    if (!isRunning || !targetEndTime) return;

    const tick = () => {
      const now = Date.now();
      const secondsLeft = Math.max(0, Math.ceil((targetEndTime - now) / 1000));
      setRemaining(secondsLeft);

      if (secondsLeft <= 0) {
        const finishedState: TimerPersistedState = {
          ...stateRef.current,
          isRunning: false,
          remainingSeconds: 0,
          targetEndTime: null,
          updatedAt: now,
        };
        applyState(finishedState);
        writeLocalState(finishedState);
        updateServerTimerState({ data: finishedState }).catch(() => {});
      }
    };

    // Immediate check
    tick();

    // Check frequently (every 250ms) so seconds transitions are frame-perfect
    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, [isRunning, targetEndTime, applyState]);

  // 3. Handle tab visibility change, window focus, power resume, and multi-tab storage events
  useEffect(() => {
    const syncFromClock = () => {
      const current = readLocalState();
      if (current) {
        applyState(current);
      } else if (stateRef.current.isRunning && stateRef.current.targetEndTime) {
        const computed = computeActiveState(stateRef.current);
        applyState(computed);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const computed = computeActiveState({ ...defaultTimerState, ...parsed });
          applyState(computed);
        } catch {
          // Ignore
        }
      }
    };

    window.addEventListener("focus", syncFromClock);
    document.addEventListener("visibilitychange", syncFromClock);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("focus", syncFromClock);
      document.removeEventListener("visibilitychange", syncFromClock);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [applyState]);

  // Actions
  const handleStartVoyage = useCallback((durationSeconds: number = TOTAL_SECONDS) => {
    const now = Date.now();
    const target = now + durationSeconds * 1000;
    const newState: TimerPersistedState = {
      isRunning: true,
      viewMode: "main",
      startTime: now,
      targetEndTime: target,
      remainingSeconds: durationSeconds,
      totalSeconds: durationSeconds,
      updatedAt: now,
    };
    writeLocalState(newState);
    applyState(newState);
    updateServerTimerState({ data: newState }).catch(() => {});
  }, [applyState]);

  const handleTogglePlay = useCallback(() => {
    const now = Date.now();
    const cur = stateRef.current;
    if (cur.isRunning) {
      // Pause
      const currentRemaining = cur.targetEndTime
        ? Math.max(0, Math.ceil((cur.targetEndTime - now) / 1000))
        : remaining;
      const pausedState: TimerPersistedState = {
        ...cur,
        isRunning: false,
        targetEndTime: null,
        remainingSeconds: currentRemaining,
        updatedAt: now,
      };
      writeLocalState(pausedState);
      applyState(pausedState);
      updateServerTimerState({ data: pausedState }).catch(() => {});
    } else {
      // Resume
      const resumeRemaining = cur.remainingSeconds <= 0 ? TOTAL_SECONDS : cur.remainingSeconds;
      const target = now + resumeRemaining * 1000;
      const resumedState: TimerPersistedState = {
        ...cur,
        isRunning: true,
        startTime: cur.startTime ?? now,
        targetEndTime: target,
        remainingSeconds: resumeRemaining,
        updatedAt: now,
      };
      writeLocalState(resumedState);
      applyState(resumedState);
      updateServerTimerState({ data: resumedState }).catch(() => {});
    }
  }, [remaining, applyState]);

  const handleReset = useCallback(
    (durationSeconds: number = TOTAL_SECONDS, targetViewMode: "launch" | "main" = "launch") => {
      const now = Date.now();
      const resetState: TimerPersistedState = {
        isRunning: false,
        viewMode: targetViewMode,
        startTime: null,
        targetEndTime: null,
        remainingSeconds: durationSeconds,
        totalSeconds: durationSeconds,
        updatedAt: now,
      };
      writeLocalState(resetState);
      applyState(resetState);
      updateServerTimerState({ data: resetState }).catch(() => {});
    },
    [applyState],
  );

  const setViewMode = useCallback(
    (mode: "launch" | "main" | ((prev: "launch" | "main") => "launch" | "main")) => {
      const nextMode = typeof mode === "function" ? mode(stateRef.current.viewMode) : mode;
      const updated: TimerPersistedState = {
        ...stateRef.current,
        viewMode: nextMode,
        updatedAt: Date.now(),
      };
      writeLocalState(updated);
      applyState(updated);
      updateServerTimerState({ data: updated }).catch(() => {});
    },
    [applyState],
  );

  return {
    viewMode,
    remaining,
    isRunning,
    targetEndTime,
    startTime,
    setViewMode,
    handleStartVoyage,
    handleTogglePlay,
    handleReset,
  };
}
