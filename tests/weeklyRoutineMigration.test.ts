import { describe, expect, it } from "vitest";
import type { WeeklyRoutine } from "../src/domain/types";
import { migrateThursdayRoutine } from "../src/domain/weeklyRoutine";

const previousRoutine: WeeklyRoutine = {
  sleepStart: "00:00",
  sleepEnd: "06:45",
  breakfastMinutes: 10,
  principles: [],
  blocks: [
    { id: "thu-semantic", day: 4, start: "09:00", end: "12:00", title: "Semantic", kind: "deep", movable: true },
    { id: "thu-grocery", day: 4, start: "17:10", end: "18:10", title: "Groceries", kind: "admin", movable: true },
    { id: "fri-custom", day: 5, start: "09:00", end: "10:00", title: "Keep me", kind: "focus", movable: true },
  ],
};

describe("Thursday routine migration", () => {
  it("moves groceries to the morning and adds choir", () => {
    const migrated = migrateThursdayRoutine(previousRoutine);
    expect(migrated.blocks.find((item) => item.id === "thu-grocery")).toMatchObject({ start: "09:00", end: "10:00" });
    expect(migrated.blocks.find((item) => item.id === "thu-choir")).toMatchObject({ start: "17:00", end: "19:00", title: "MT Choir Rehearsal", movable: false });
  });

  it("keeps unrelated custom blocks", () => {
    const migrated = migrateThursdayRoutine(previousRoutine);
    expect(migrated.blocks.find((item) => item.id === "fri-custom")?.title).toBe("Keep me");
  });
});
