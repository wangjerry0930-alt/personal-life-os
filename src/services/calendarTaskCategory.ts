import type { Project } from "../domain/types";

export const CALENDAR_TIME_CATEGORIES = [
  "Study",
  "Work",
  "Music",
  "Entertainment",
  "Exercise",
  "Life",
  "Other",
] as const;

export const inferCalendarTaskCategory = (
  title: string,
  project?: Project,
): string => {
  const text = `${title} ${project?.name || ""} ${project?.type || ""} ${project?.meta || ""}`.toLowerCase();
  if (/\b(gym|run|running|workout|exercise|cardio|strength|training)\b|健身|跑步|运动|训练/.test(text)) return "Exercise";
  if (/\b(rehearsal|choir|music|sing|singing|piano|guitar|theatre)\b|排练|合唱|音乐|声乐/.test(text)) return "Music";
  if (/\b(game|gaming|movie|film|novel|youtube)\b|游戏|电影|小说/.test(text)) return "Entertainment";
  if (/\b(shop|shopping|grocery|groceries|cook|meal|laundry|clean|chore|appointment)\b|买菜|购物|做饭|家务|打扫/.test(text)) return "Life";
  if (/\b(research|project|experiment|participant|analysis|admin|meeting|application|cv|lab)\b|研究|项目|实验|数据|申请|会议|报销/.test(text)) return "Work";
  if (/\b(study|course|lecture|seminar|class|exam|revision|reading|paper|assignment)\b|学习|课程|上课|复习|论文|作业|考试/.test(text)) return "Study";
  return "Other";
};
