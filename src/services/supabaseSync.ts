import type { RepositorySnapshot } from '../domain/types';

export const SUPABASE_URL_KEY='personal-life-os-supabase-url';
export const SUPABASE_ANON_KEY='personal-life-os-supabase-anon-key';
export const SUPABASE_AUTO_SYNC_KEY='personal-life-os-supabase-auto-sync';
export const SUPABASE_LAST_SYNC_KEY='personal-life-os-supabase-last-sync';
export const SUPABASE_CONFIG_EVENT='life-os-supabase-config-changed';
export const SUPABASE_STATUS_EVENT='life-os-supabase-sync-status';

export type CloudSnapshotRow={payload:RepositorySnapshot;updated_at:string};

function config(){
  const url=localStorage.getItem(SUPABASE_URL_KEY)?.trim().replace(/\/$/,'')||'';
  const key=localStorage.getItem(SUPABASE_ANON_KEY)?.trim()||'';
  if(!url||!key)return null;
  return{endpoint:url+'/rest/v1/life_os_snapshots',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'}};
}

export function isAutoSyncEnabled(){return localStorage.getItem(SUPABASE_AUTO_SYNC_KEY)!=='false'}
export function hasSupabaseConfig(){return Boolean(config())}
export type SyncDirection='push'|'pull'|'none';
export function chooseSyncDirection(localUpdatedAt:string,remoteUpdatedAt:string|undefined,lastSyncedAt:string|undefined):SyncDirection{
  if(!remoteUpdatedAt)return'push';
  if(!lastSyncedAt)return'pull';
  const local=Date.parse(localUpdatedAt)||0,remote=Date.parse(remoteUpdatedAt)||0,last=Date.parse(lastSyncedAt)||0;
  const localChanged=local>last,remoteChanged=remote>last;
  if(remoteChanged&&!localChanged)return'pull';
  if(localChanged&&!remoteChanged)return'push';
  if(localChanged&&remoteChanged)return remote>=local?'pull':'push';
  return'none';
}
export function recordLastSync(value:string){localStorage.setItem(SUPABASE_LAST_SYNC_KEY,value)}
export function getLastSync(){return localStorage.getItem(SUPABASE_LAST_SYNC_KEY)||undefined}
export function reportSyncStatus(state:'syncing'|'synced'|'offline'|'error'|'paused',message:string,at?:string){window.dispatchEvent(new CustomEvent(SUPABASE_STATUS_EVENT,{detail:{state,message,at}}))}

export async function pushCloudSnapshot(snapshot:RepositorySnapshot){
  const settings=config();if(!settings)throw new Error('Enter Supabase URL and anon key first.');
  const response=await fetch(settings.endpoint+'?on_conflict=user_key',{method:'POST',headers:{...settings.headers,Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify({user_key:'local',payload:snapshot,updated_at:new Date().toISOString()})});
  if(!response.ok)throw new Error(`Supabase ${response.status}`);
  return response.json() as Promise<CloudSnapshotRow[]>;
}

export async function pullCloudSnapshot(){
  const settings=config();if(!settings)throw new Error('Enter Supabase URL and anon key first.');
  const response=await fetch(settings.endpoint+'?user_key=eq.local&order=updated_at.desc&limit=1',{headers:settings.headers});
  if(!response.ok)throw new Error(`Supabase ${response.status}`);
  const rows=await response.json() as CloudSnapshotRow[];
  return rows[0]||null;
}
