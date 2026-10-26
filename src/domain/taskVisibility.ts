import{localDateKey}from'./date';
import type{Task}from'./types';
export function isTaskVisibleToday(task:Pick<Task,'status'|'scheduledDate'|'completedAt'>,today=localDateKey()){if(task.status!=='done')return task.scheduledDate===today;const completedDate=task.completedAt?localDateKey(new Date(task.completedAt)):task.scheduledDate;return completedDate===today}
export type TodayTaskBucket='today'|'overdue'|'unscheduled'|'completed'|'other';
export function todayTaskBucket(task:Pick<Task,'status'|'scheduledDate'|'completedAt'>,today=localDateKey()):TodayTaskBucket{const completedDate=task.completedAt?localDateKey(new Date(task.completedAt)):undefined;if(task.status==='done')return completedDate===today?'completed':'other';if(!task.scheduledDate)return'unscheduled';if(task.scheduledDate<today)return'overdue';if(task.scheduledDate===today)return'today';return'other'}
