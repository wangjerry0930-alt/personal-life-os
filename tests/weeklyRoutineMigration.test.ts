import { describe, expect, it } from "vitest";
import type { WeeklyRoutine } from "../src/domain/types";
import { migrateWeeklyRoutine } from "../src/domain/weeklyRoutine";

const previousRoutine: WeeklyRoutine = {
  sleepStart: "00:00",
  sleepEnd: "06:45",
  breakfastMinutes: 10,
  principles: [],
  blocks: [
    { id: "thu-semantic", day: 4, start: "09:00", end: "12:00", title: "Semantic", kind: "deep", movable: true },
    { id: "thu-grocery", day: 4, start: "17:10", end: "18:10", title: "Groceries", kind: "admin", movable: true },
    { id: "thu-maze", day: 4, start: "14:00", end: "16:30", title: "Maze", kind: "deep", movable: true },
    { id: "sun-maintenance", day: 0, start: "17:00", end: "17:30", title: "Tal maintenance", kind: "light", movable: true },
    { id: "fri-custom", day: 5, start: "09:00", end: "10:00", title: "Keep me", kind: "focus", movable: true },
  ],
};

describe("weekly routine migration", () => {
  it("moves groceries to the morning and adds choir", () => {
    const migrated = migrateWeeklyRoutine(previousRoutine);
    expect(migrated.blocks.find((item) => item.id === "thu-grocery")).toMatchObject({ start: "09:00", end: "10:00" });
    expect(migrated.blocks.find((item) => item.id === "thu-choir")).toMatchObject({ start: "17:00", end: "19:00", title: "MT Choir Rehearsal", movable: false });
  });

  it("keeps each research day focused on one project", () => {
    const migrated = migrateWeeklyRoutine(previousRoutine);
    expect(migrated.blocks.find((item) => item.id === "wed-maze")).toMatchObject({ day: 3, start: "08:45", end: "10:30" });
    expect(migrated.blocks.find((item) => item.id === "thu-semantic-pm")?.title).toContain("Semantic Decoding");
    expect(migrated.blocks.some((item) => item.id === "thu-maze")).toBe(false);
    expect(migrated.blocks.some((item) => item.id === "sun-maintenance")).toBe(false);
  });

  it("protects Monday evening for social time or recovery", () => {
    const routineWithOldSociety = {
      ...previousRoutine,
      blocks: [
        ...previousRoutine.blocks,
        { id: "mon-society", day: 1, start: "18:00", end: "22:00", title: "Society", kind: "hard" as const, movable: false },
      ],
    };
    const migrated = migrateWeeklyRoutine(routineWithOldSociety);
    expect(migrated.blocks.some((item) => item.id === "mon-society")).toBe(false);
    expect(migrated.blocks.find((item) => item.id === "mon-recovery")).toMatchObject({
      day: 1,
      start: "18:00",
      end: "22:00",
      title: "Free / social / recovery",
      kind: "recovery",
      movable: false,
    });
  });

  it("marks Anika downtime as interruptible cross-project time", () => {
    const migrated = migrateWeeklyRoutine(previousRoutine);
    for (const id of ["tue-anika", "fri-anika"]) {
      const block = migrated.blocks.find((item) => item.id === id);
      expect(block?.title).toContain("flexible project work");
      expect(block?.note).toContain("roughly 2 hours");
      expect(block?.note).toContain("no deep coding");
    }
  });

  it("keeps unrelated custom blocks", () => {
    const migrated = migrateWeeklyRoutine(previousRoutine);
    expect(migrated.blocks.find((item) => item.id === "fri-custom")?.title).toBe("Keep me");
  });
});
