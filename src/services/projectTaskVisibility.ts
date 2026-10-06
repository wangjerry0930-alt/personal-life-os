import type { Task } from "../domain/types";
import { localDateKey } from "../domain/date";

export const shouldShowProjectTask = (task: Task, today = localDateKey()): boolean => {
  if (task.status !== "done") return true;
  if (!task.completedAt) return false;
  const completed = new Date(task.completedAt);
  return !Number.isNaN(completed.getTime()) && localDateKey(completed) === today;
};
