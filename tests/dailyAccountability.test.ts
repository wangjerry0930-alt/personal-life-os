import { describe, expect, it } from "vitest";
import type { AppData, TimeEntry } from "../src/domain/types";
import { getDailyRhythm, sleepDurationMinutes, updateDailyRhythm } from "../src/services/dailyRhythmService";
import { buildDailyShareSummary } from "../src/services/dailyShareService";

const data = { dailyRhythm: [], tasks: [], areas: [], skills: [], habits: [], activities: [], knowledge: [], projects: [], goals: [], interests: [], log: { date: "", learned: "", progress: "", problems: "", tomorrow: "", notes: "", minutes: 0 } } as AppData;
const entry = (title: string, category: string, minutes: number): TimeEntry => ({ id: `${title}-${minutes}`, createdAt: "2026-10-18T12:00:00Z", updatedAt: "2026-10-18T12:00:00Z", title, category, startedAt: "2026-10-18T11:00:00Z", endedAt: "2026-10-18T12:00:00Z", durationMinutes: minutes, source: "manual" });

describe("daily accountability", () => {
  it("records editable wake and sleep times in app data", () => {
    const updated = updateDailyRhythm(data, "2026-10-18", { wakeTime: "06:45", sleepTime: "23:55" });
    expect(getDailyRhythm(updated, "2026-10-18")).toMatchObject({ wakeTime: "06:45", sleepTime: "23:55" });
  });

  it("handles sleep after midnight", () => {
    expect(sleepDurationMinutes("06:45", "00:15")).toBe(1050);
  });

  it("builds a privacy-limited share summary from tracked totals", () => {
    const withRhythm = updateDailyRhythm(data, "2026-10-18", { wakeTime: "07:00", sleepTime: "23:30" });
    const summary = buildDailyShareSummary(withRhythm, [entry("Research", "Work", 90), entry("Reading", "Study", 30), entry("Research", "Work", 20)], "2026-10-18");
    expect(summary.totalMinutes).toBe(140);
    expect(summary.categories[0]).toEqual({ name: "Work", minutes: 110 });
    expect(summary.highlights[0]).toEqual({ title: "Research", minutes: 110 });
    expect(summary).not.toHaveProperty("notes");
  });
});
