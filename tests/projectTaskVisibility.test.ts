import { describe, expect, it } from "vitest";
import type { Task } from "../src/domain/types";
import { shouldShowProjectTask } from "../src/services/projectTaskVisibility";

const task = (values: Partial<Task>): Task => ({ id: "task-1", title: "Project task", description: "", minutes: 30, difficulty: "Medium", category: "Manual", status: "todo", ...values });

describe("project task visibility", () => {
  it("keeps open tasks visible", () => {
    expect(shouldShowProjectTask(task({ status: "todo" }), "2026-10-06")).toBe(true);
  });
  it("keeps a completed task visible for the completion day", () => {
    expect(shouldShowProjectTask(task({ status: "done", completedAt: "2026-10-06T12:00:00" }), "2026-10-06")).toBe(true);
  });
  it("hides completed tasks from the next day onward", () => {
    expect(shouldShowProjectTask(task({ status: "done", completedAt: "2026-10-05T23:59:00" }), "2026-10-06")).toBe(false);
  });
  it("hides legacy completed tasks without a completion timestamp", () => {
    expect(shouldShowProjectTask(task({ status: "done" }), "2026-10-06")).toBe(false);
  });
});
