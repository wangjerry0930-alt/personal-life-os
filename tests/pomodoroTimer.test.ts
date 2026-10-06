import { describe, expect, it } from "vitest";
import {
  POMODORO_BREAK_SECONDS,
  POMODORO_FOCUS_SECONDS,
  getPomodoroState,
} from "../src/services/pomodoroTimer";

describe("pomodoro timer", () => {
  it("switches from focus to break without ending the timer", () => {
    const lastFocusSecond = getPomodoroState(POMODORO_FOCUS_SECONDS - 1);
    const breakStart = getPomodoroState(POMODORO_FOCUS_SECONDS);

    expect(lastFocusSecond.isFocus).toBe(true);
    expect(lastFocusSecond.remainingSeconds).toBe(1);
    expect(breakStart.isFocus).toBe(false);
    expect(breakStart.remainingSeconds).toBe(POMODORO_BREAK_SECONDS);
  });

  it("starts a new focus round after the break", () => {
    const secondRound = getPomodoroState(
      POMODORO_FOCUS_SECONDS + POMODORO_BREAK_SECONDS,
    );

    expect(secondRound.isFocus).toBe(true);
    expect(secondRound.round).toBe(2);
    expect(secondRound.remainingSeconds).toBe(POMODORO_FOCUS_SECONDS);
  });

  it("counts only focus time when saving", () => {
    const fiveMinutesIntoBreak = getPomodoroState(
      POMODORO_FOCUS_SECONDS + 5 * 60,
    );
    expect(fiveMinutesIntoBreak.focusedSeconds).toBe(POMODORO_FOCUS_SECONDS);
  });
});
