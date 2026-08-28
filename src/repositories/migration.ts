import type { AppData, RepositorySnapshot } from '../domain/types';
import { seed } from '../domain/seed';
import { storageAdapter } from './storageAdapter';

export const REPOSITORY_KEY='personal-life-os-repository-v5';
const legacyKeys=['personal-life-os-people','personal-life-os-person-facts','personal-life-os-conversations','personal-life-os-important-dates','personal-life-os-books','personal-life-os-captures','personal-life-os-resources','personal-life-os-knowledge','personal-life-os-journal-history'];
const now=()=>new Date().toISOString();
const empty=(data:AppData):RepositorySnapshot=>({schemaVersion:5,data,activities:[],habitLogs:[],taskCompletions:[],skillLogs:[],relations:[],updatedAt:now()});
export function migrateLegacyData():RepositorySnapshot {
  const current=storageAdapter.get<RepositorySnapshot|null>(REPOSITORY_KEY,null);
  if(current?.schemaVersion===5)return {...current,skillLogs:current.skillLogs||[]};
  const legacy:Record<string,unknown>={}; legacyKeys.forEach(key=>{if(storageAdapter.has(key))legacy[key]=storageAdapter.get(key,[])});
  const oldData=storageAdapter.get<AppData|null>('personal-life-os-data',null); const snapshot=empty({...seed,...(oldData||{}),projects:oldData?.projects||seed.projects,goals:oldData?.goals||seed.goals});
  const legacyActivities=Array.isArray(oldData?.activities)?oldData.activities:[];
  snapshot.activities=legacyActivities.map((item:any,index)=>{const occurredAt=typeof item.time==='string'&&item.time.includes('T')?item.time:now();return{id:`legacy-activity-${index}-${Date.now()}`,createdAt:occurredAt,updatedAt:occurredAt,type:'Custom',title:item.label||'Legacy activity',occurredAt,source:'Legacy',metadata:{legacyType:item.type,legacyMeta:item.meta}}});
  snapshot.legacy=legacy; storageAdapter.set(REPOSITORY_KEY,snapshot); storageAdapter.set('personal-life-os-migration-v5',{completedAt:now(),legacyKeys}); return snapshot;
}
