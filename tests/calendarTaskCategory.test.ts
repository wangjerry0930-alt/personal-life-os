import { describe, expect, it } from "vitest";
import { inferCalendarTaskCategory } from "../src/services/calendarTaskCategory";

describe("calendar task category", () => {
  it("does not default an unknown calendar task to Study", () => {
    expect(inferCalendarTaskCategory("Call Alex")).toBe("Other");
  });
  it("recognises common non-study calendar activities", () => {
    expect(inferCalendarTaskCategory("Gym cardio")).toBe("Exercise");
    expect(inferCalendarTaskCategory("Buy groceries")).toBe("Life");
    expect(inferCalendarTaskCategory("Choir rehearsal")).toBe("Music");
  });
  it("uses linked project context", () => {
    expect(inferCalendarTaskCategory("Prepare next step", { id: "p", name: "MEG research", type: "Research", status: "In progress", progress: 0, deadline: "", meta: "Lab experiment", next: "", color: "#000" })).toBe("Work");
  });
});
