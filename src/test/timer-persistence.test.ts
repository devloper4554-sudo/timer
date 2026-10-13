import { describe, expect, it } from "vitest";
import { computeActiveState, defaultTimerState, TOTAL_SECONDS, TimerPersistedState } from "@/lib/timer-sync";

describe("Timer Interruption & Persistence Recovery", () => {
  it("preserves elapsed time across simulation of power cut or browser close", () => {
    const startTime = 1000000000000;
    const targetEndTime = startTime + TOTAL_SECONDS * 1000;

    const savedState: TimerPersistedState = {
      ...defaultTimerState,
      isRunning: true,
      viewMode: "main",
      startTime,
      targetEndTime,
      remainingSeconds: TOTAL_SECONDS,
      updatedAt: startTime,
    };

    // Simulate power outage or browser closure of 2 hours (7200 seconds)
    const simulatedNowAfterTwoHours = startTime + 7200 * 1000;
    const originalDateNow = Date.now;
    Date.now = () => simulatedNowAfterTwoHours;

    try {
      const activeState = computeActiveState(savedState);
      expect(activeState.isRunning).toBe(true);
      expect(activeState.remainingSeconds).toBe(TOTAL_SECONDS - 7200);
      expect(activeState.viewMode).toBe("main");
    } finally {
      Date.now = originalDateNow;
    }
  });

  it("handles timer completion when power returns after duration has fully elapsed", () => {
    const startTime = 1000000000000;
    const targetEndTime = startTime + TOTAL_SECONDS * 1000;

    const savedState: TimerPersistedState = {
      ...defaultTimerState,
      isRunning: true,
      viewMode: "main",
      startTime,
      targetEndTime,
      remainingSeconds: TOTAL_SECONDS,
      updatedAt: startTime,
    };

    // Simulate reopening after 25 hours (past 24h limit)
    const simulatedNowAfterExpiry = startTime + 25 * 3600 * 1000;
    const originalDateNow = Date.now;
    Date.now = () => simulatedNowAfterExpiry;

    try {
      const activeState = computeActiveState(savedState);
      expect(activeState.isRunning).toBe(false);
      expect(activeState.remainingSeconds).toBe(0);
    } finally {
      Date.now = originalDateNow;
    }
  });

  it("preserves exact remaining time when paused during interruption", () => {
    const savedState: TimerPersistedState = {
      ...defaultTimerState,
      isRunning: false,
      viewMode: "main",
      startTime: 1000000000000,
      targetEndTime: null,
      remainingSeconds: 12345,
      updatedAt: 1000000000000,
    };

    const activeState = computeActiveState(savedState);
    expect(activeState.isRunning).toBe(false);
    expect(activeState.remainingSeconds).toBe(12345);
  });
});
