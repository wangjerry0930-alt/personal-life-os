import type { ActivityEntity, EntityRelation, HabitLog, RepositorySnapshot, TaskCompletion } from '../domain/types';
import { migrateLegacyData, REPOSITORY_KEY } from './migration';
import { storageAdapter } from './storageAdapter';

export const loadSnapshot=()=>migrateLegacyData();
export const saveSnapshot=(snapshot:RepositorySnapshot)=>storageAdapter.set(REPOSITORY_KEY,{...snapshot,updatedAt:new Date().toISOString()});
export function appendActivity(activity:ActivityEntity){const snapshot=loadSnapshot();saveSnapshot({...snapshot,activities:[activity,...snapshot.activities].slice(0,500)});}
export function appendTaskCompletion(completion:TaskCompletion){const snapshot=loadSnapshot();saveSnapshot({...snapshot,taskCompletions:[completion,...snapshot.taskCompletions].slice(0,1000)});}
export function appendHabitLog(log:HabitLog){const snapshot=loadSnapshot();saveSnapshot({...snapshot,habitLogs:[log,...snapshot.habitLogs].slice(0,1000)});}
export function appendRelation(relation:EntityRelation){const snapshot=loadSnapshot();saveSnapshot({...snapshot,relations:[relation,...snapshot.relations].slice(0,2000)});}
