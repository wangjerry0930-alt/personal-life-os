import type { ActivityEntity, AppData, HabitLog, RepositorySnapshot, TaskCompletion } from '../domain/types';
import { loadSnapshot } from '../repositories/appRepository';

export function getUnifiedActivities(snapshot:RepositorySnapshot=loadSnapshot()):ActivityEntity[]{return snapshot.activities.sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt));}
export function getActivitiesForDate(date:string,snapshot:RepositorySnapshot=loadSnapshot()){return getUnifiedActivities(snapshot).filter(activity=>activity.occurredAt.slice(0,10)===date);}
export function getTaskCompletionsForDate(date:string,snapshot:RepositorySnapshot=loadSnapshot()):TaskCompletion[]{return snapshot.taskCompletions.filter(item=>item.completedAt.slice(0,10)===date);}
export function getHabitLogsForDate(date:string,snapshot:RepositorySnapshot=loadSnapshot()):HabitLog[]{return snapshot.habitLogs.filter(item=>item.date===date);}
export function summarizeToday(data:AppData,date:string=new Date().toISOString().slice(0,10)){const snapshot=loadSnapshot();const activities=getActivitiesForDate(date,snapshot);const taskCompletions=getTaskCompletionsForDate(date,snapshot);const habitLogs=getHabitLogsForDate(date,snapshot);return{activities,taskCompletions,habitLogs,tasksCompleted:new Set(taskCompletions.map(x=>x.taskId)).size,habitsCompleted:habitLogs.filter(x=>x.completed).length,minutes:activities.reduce((sum,x)=>sum+(x.durationMinutes||0),0)+data.log.minutes};}
