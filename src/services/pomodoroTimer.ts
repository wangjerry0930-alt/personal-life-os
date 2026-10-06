export const POMODORO_FOCUS_SECONDS = 30 * 60;
export const POMODORO_BREAK_SECONDS = 5 * 60;
export const POMODORO_CYCLE_SECONDS =
  POMODORO_FOCUS_SECONDS + POMODORO_BREAK_SECONDS;

export const getPomodoroState = (elapsedSeconds: number) => {
  const elapsed = Math.max(0, Math.floor(elapsedSeconds));
  const completedCycles = Math.floor(elapsed / POMODORO_CYCLE_SECONDS);
  const cycleElapsed = elapsed % POMODORO_CYCLE_SECONDS;
  const isFocus = cycleElapsed < POMODORO_FOCUS_SECONDS;
  const phaseElapsed = isFocus
    ? cycleElapsed
    : cycleElapsed - POMODORO_FOCUS_SECONDS;
  const phaseSeconds = isFocus
    ? POMODORO_FOCUS_SECONDS
    : POMODORO_BREAK_SECONDS;

  return {
    isFocus,
    round: completedCycles + 1,
    phaseElapsed,
    remainingSeconds: phaseSeconds - phaseElapsed,
    progressPercent: Math.min(100, (phaseElapsed / phaseSeconds) * 100),
    focusedSeconds:
      completedCycles * POMODORO_FOCUS_SECONDS +
      Math.min(cycleElapsed, POMODORO_FOCUS_SECONDS),
  };
};
