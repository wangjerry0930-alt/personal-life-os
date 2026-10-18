import type { AppData, TimeEntry } from "../domain/types";
import { getDailyRhythm } from "./dailyRhythmService";

export interface DailyShareSummary {
  date: string;
  totalMinutes: number;
  wakeTime?: string;
  sleepTime?: string;
  categories: Array<{ name: string; minutes: number }>;
  highlights: Array<{ title: string; minutes: number }>;
}

export const buildDailyShareSummary = (data: AppData, entries: TimeEntry[], date: string): DailyShareSummary => {
  const rhythm = getDailyRhythm(data, date);
  const categoryTotals = new Map<string, number>();
  const activityTotals = new Map<string, number>();
  for (const entry of entries) {
    categoryTotals.set(entry.category, (categoryTotals.get(entry.category) || 0) + entry.durationMinutes);
    activityTotals.set(entry.title, (activityTotals.get(entry.title) || 0) + entry.durationMinutes);
  }
  const descending = (a: [string, number], b: [string, number]) => b[1] - a[1];
  return {
    date,
    totalMinutes: entries.reduce((sum, entry) => sum + entry.durationMinutes, 0),
    wakeTime: rhythm.wakeTime,
    sleepTime: rhythm.sleepTime,
    categories: [...categoryTotals].sort(descending).map(([name, minutes]) => ({ name, minutes })),
    highlights: [...activityTotals].sort(descending).slice(0, 4).map(([title, minutes]) => ({ title, minutes })),
  };
};

const formatDuration = (minutes: number) => minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60 ? `${minutes % 60}m` : ""}`.trim() : `${minutes}m`;
const categoryColors: Record<string, string> = { Study: "#8c7cf6", Work: "#4f9adc", Music: "#d36cae", Entertainment: "#ec9657", Exercise: "#4fb58a", Life: "#d6ad43", Other: "#9299a7" };

export const renderDailyShareImage = (canvas: HTMLCanvasElement, summary: DailyShareSummary) => {
  canvas.width = 1080; canvas.height = 1350;
  const context = canvas.getContext("2d"); if (!context) throw new Error("Canvas is unavailable.");
  const gradient = context.createLinearGradient(0, 0, 1080, 1350); gradient.addColorStop(0, "#f8f6ff"); gradient.addColorStop(1, "#eee9ff"); context.fillStyle = gradient; context.fillRect(0, 0, 1080, 1350);
  context.fillStyle = "#7666dd"; context.beginPath(); context.arc(930, 120, 240, 0, Math.PI * 2); context.globalAlpha = .13; context.fill(); context.globalAlpha = 1;
  context.fillStyle = "#7163d4"; context.font = "700 28px Arial"; context.fillText("PERSONAL LIFE OS", 76, 92);
  context.fillStyle = "#24202d"; context.font = "700 67px Arial"; context.fillText("1% better today.", 76, 188);
  context.fillStyle = "#817b8c"; context.font = "28px Arial"; context.fillText(new Date(`${summary.date}T12:00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }), 78, 240);
  context.fillStyle = "#fff"; context.shadowColor = "rgba(65,48,120,.10)"; context.shadowBlur = 28; context.fillRect(76, 294, 928, 250); context.shadowBlur = 0;
  context.fillStyle = "#8a8195"; context.font = "700 24px Arial"; context.fillText("INTENTIONAL TIME", 116, 350);
  context.fillStyle = "#25202e"; context.font = "700 92px Arial"; context.fillText(formatDuration(summary.totalMinutes), 112, 460);
  context.font = "26px Arial"; context.fillStyle = "#817b8c"; context.fillText(`Wake  ${summary.wakeTime || "—"}`, 600, 390); context.fillText(`Sleep  ${summary.sleepTime || "—"}`, 600, 445);
  context.fillStyle = "#292431"; context.font = "700 30px Arial"; context.fillText("WHERE THE DAY WENT", 78, 625);
  const max = Math.max(1, ...summary.categories.map((item) => item.minutes));
  summary.categories.slice(0, 5).forEach((item, index) => { const y = 680 + index * 72; context.fillStyle = "#ded9ea"; context.fillRect(78, y, 730, 22); context.fillStyle = categoryColors[item.name] || categoryColors.Other; context.fillRect(78, y, Math.max(12, 730 * item.minutes / max), 22); context.fillStyle = "#494151"; context.font = "24px Arial"; context.fillText(item.name, 78, y - 12); context.textAlign = "right"; context.fillText(formatDuration(item.minutes), 995, y + 19); context.textAlign = "left"; });
  const highlightY = 680 + Math.min(5, summary.categories.length) * 72 + 35; context.fillStyle = "#292431"; context.font = "700 30px Arial"; context.fillText("TODAY’S PROOF", 78, highlightY);
  context.font = "25px Arial"; summary.highlights.slice(0, 3).forEach((item, index) => { const y = highlightY + 54 + index * 48; context.fillStyle = "#7163d4"; context.fillText("•", 82, y); context.fillStyle = "#4e4655"; const title = item.title.length > 45 ? `${item.title.slice(0, 42)}…` : item.title; context.fillText(`${title}  ·  ${formatDuration(item.minutes)}`, 112, y); });
  context.fillStyle = "#7163d4"; context.font = "700 27px Arial"; context.fillText("Small actions compound.", 78, 1280); context.textAlign = "right"; context.font = "22px Arial"; context.fillStyle = "#938aa0"; context.fillText("Built with Personal Life OS", 1000, 1280); context.textAlign = "left";
};
