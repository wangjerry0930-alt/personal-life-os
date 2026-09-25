import{localDateKey}from'./date';
import type{Task}from'./types';
export function isTaskVisibleToday(task:Pick<Task,'status'|'scheduledDate'|'completedAt'>,today=localDateKey()){if(task.status!=='done')return!task.scheduledDate||task.scheduledDate<=today;const completedDate=task.completedAt?localDateKey(new Date(task.completedAt)):task.scheduledDate;return completedDate===today}
