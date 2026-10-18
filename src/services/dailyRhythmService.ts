import type { AppData, DailyRhythmEntry } from "../domain/types";

export const localTimeValue = (date = new Date()) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

export const getDailyRhythm = (data: AppData, date: string): DailyRhythmEntry =>
  data.dailyRhythm?.find((item) => item.date === date) || { date, updatedAt: "" };

export const updateDailyRhythm = (
  data: AppData,
  date: string,
  patch: Pick<DailyRhythmEntry, "wakeTime" | "sleepTime">,
): AppData => {
  const current = getDailyRhythm(data, date);
  const entry: DailyRhythmEntry = { ...current, ...patch, date, updatedAt: new Date().toISOString() };
  return { ...data, dailyRhythm: [entry, ...(data.dailyRhythm || []).filter((item) => item.date !== date)].slice(0, 400) };
};

export const sleepDurationMinutes = (wakeTime?: string, sleepTime?: string) => {
  if (!wakeTime || !sleepTime) return null;
  const toMinutes = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const wake = toMinutes(wakeTime);
  let sleep = toMinutes(sleepTime);
  if (!Number.isFinite(wake) || !Number.isFinite(sleep)) return null;
  if (sleep <= wake) sleep += 24 * 60;
  return sleep - wake;
};
