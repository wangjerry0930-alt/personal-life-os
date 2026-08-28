import type { ActivityEntity, EntityRelation, HabitLog, RecallAttempt, RepositorySnapshot, SkillLog, TaskCompletion } from '../domain/types';
import { upsertHabitLog } from '../services/habitService';
import { migrateLegacyData, REPOSITORY_KEY } from './migration';
import { storageAdapter } from './storageAdapter';

export const loadSnapshot=()=>migrateLegacyData();
export const saveSnapshot=(snapshot:RepositorySnapshot)=>storageAdapter.set(REPOSITORY_KEY,{...snapshot,updatedAt:new Date().toISOString()});
export function appendActivity(activity:ActivityEntity){const snapshot=loadSnapshot();saveSnapshot({...snapshot,activities:[activity,...snapshot.activities].slice(0,500)});}
export function appendTaskCompletion(completion:TaskCompletion){const snapshot=loadSnapshot();const duplicate=snapshot.taskCompletions.some(item=>item.taskId===completion.taskId&&item.completedAt.slice(0,10)===completion.completedAt.slice(0,10));if(duplicate)return;saveSnapshot({...snapshot,taskCompletions:[completion,...snapshot.taskCompletions].slice(0,1000)});}
export function appendHabitLog(log:HabitLog){const snapshot=loadSnapshot();saveSnapshot({...snapshot,habitLogs:upsertHabitLog(snapshot.habitLogs,log).slice(0,1000)});}
export function appendSkillLog(log:SkillLog){const snapshot=loadSnapshot();saveSnapshot({...snapshot,skillLogs:[log,...(snapshot.skillLogs||[])].slice(0,2000)});}
export function appendRecallAttempt(attempt:RecallAttempt){const snapshot=loadSnapshot();saveSnapshot({...snapshot,recallAttempts:[attempt,...(snapshot.recallAttempts||[])].slice(0,5000)});}
export function appendRelation(relation:EntityRelation){const snapshot=loadSnapshot();saveSnapshot({...snapshot,relations:[relation,...snapshot.relations].slice(0,2000)});}
