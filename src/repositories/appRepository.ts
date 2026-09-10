import type { ActivityEntity, EntityRelation, HabitLog, RecallAttempt, RepositorySnapshot, SkillLog, TaskCompletion, TimeEntry } from '../domain/types';
import { localDateKey } from '../domain/date';
import { upsertHabitLog } from '../services/habitService';
import { migrateLegacyData, REPOSITORY_KEY } from './migration';
import { storageAdapter } from './storageAdapter';

const liveArray=<T,>(key:string,fallback:T[]):T[]=>storageAdapter.has(key)?storageAdapter.get<T[]>(key,fallback):fallback;
export const loadSnapshot=():RepositorySnapshot=>{
  const snapshot=migrateLegacyData();
  return {...snapshot,
    people:liveArray('personal-life-os-people',snapshot.people||[]),
    personFacts:liveArray('personal-life-os-person-facts',snapshot.personFacts||[]),
    interactions:liveArray('personal-life-os-conversations',snapshot.interactions||[]),
    importantDates:liveArray('personal-life-os-important-dates',snapshot.importantDates||[]),
    books:liveArray('personal-life-os-books',snapshot.books||[]),
    captures:liveArray('personal-life-os-captures',snapshot.captures||[]),
    resources:liveArray('personal-life-os-resources',snapshot.resources||[]),
    knowledgeItems:liveArray('personal-life-os-knowledge',snapshot.knowledgeItems||[]),
    journalEntries:liveArray('personal-life-os-journal-history',snapshot.journalEntries||[]),
    questBoard:storageAdapter.has('personal-life-os-quest-board-v1')?storageAdapter.get('personal-life-os-quest-board-v1',snapshot.questBoard):snapshot.questBoard,
    food:storageAdapter.has('personal-life-os-food-v1')?storageAdapter.get('personal-life-os-food-v1',snapshot.food):snapshot.food,
    timeEntries:liveArray('personal-life-os-time-entries',snapshot.timeEntries||[]),
    rewards:snapshot.rewards,
  };
};
export const saveSnapshot=(snapshot:RepositorySnapshot)=>storageAdapter.set(REPOSITORY_KEY,{...snapshot,updatedAt:new Date().toISOString()});
export function appendTimeEntry(entry:TimeEntry){const snapshot=loadSnapshot();const activity:ActivityEntity={id:`activity-time-${entry.id}`,createdAt:entry.createdAt,updatedAt:entry.updatedAt,type:'LearningSession',title:entry.title,description:`${entry.category}${entry.entertainmentSubtype?` · ${entry.entertainmentSubtype}`:''} · ${entry.source}`,occurredAt:entry.endedAt,durationMinutes:entry.durationMinutes,source:'Time Tracking',metadata:{category:entry.category,entertainmentSubtype:entry.entertainmentSubtype,taskId:entry.taskId,projectId:entry.projectId,areaId:entry.areaId,skillId:entry.skillId}};saveSnapshot({...snapshot,timeEntries:[entry,...snapshot.timeEntries].slice(0,5000),activities:[activity,...snapshot.activities].slice(0,1000)});}
export function appendActivity(activity:ActivityEntity){const snapshot=loadSnapshot();saveSnapshot({...snapshot,activities:[activity,...snapshot.activities].slice(0,500)});}
export function appendTaskCompletion(completion:TaskCompletion){const snapshot=loadSnapshot();const duplicate=snapshot.taskCompletions.some(item=>item.taskId===completion.taskId&&localDateKey(new Date(item.completedAt))===localDateKey(new Date(completion.completedAt)));if(duplicate)return;saveSnapshot({...snapshot,taskCompletions:[completion,...snapshot.taskCompletions].slice(0,1000)});const task=snapshot.data.tasks.find(item=>item.id===completion.taskId);const questId=task?.questId||task?.notes?.match(/^Quest:\s*(.+)$/)?.[1];if(questId){try{const key='personal-life-os-quest-board-v1';const board=JSON.parse(localStorage.getItem(key)||'{"ranks":[],"quests":[]}');const quests=(board.quests||[]).map((item:any)=>item.id===questId?{...item,status:'completed',completedAt:completion.completedAt}:item);localStorage.setItem(key,JSON.stringify({...board,quests}))}catch{}}
}
export function appendHabitLog(log:HabitLog){const snapshot=loadSnapshot();saveSnapshot({...snapshot,habitLogs:upsertHabitLog(snapshot.habitLogs,log).slice(0,1000)});}
export function appendSkillLog(log:SkillLog){const snapshot=loadSnapshot();saveSnapshot({...snapshot,skillLogs:[log,...(snapshot.skillLogs||[])].slice(0,2000)});}
export function appendRecallAttempt(attempt:RecallAttempt){const snapshot=loadSnapshot();saveSnapshot({...snapshot,recallAttempts:[attempt,...(snapshot.recallAttempts||[])].slice(0,5000)});}
export function appendRelation(relation:EntityRelation){const snapshot=loadSnapshot();saveSnapshot({...snapshot,relations:[relation,...snapshot.relations].slice(0,2000)});}
