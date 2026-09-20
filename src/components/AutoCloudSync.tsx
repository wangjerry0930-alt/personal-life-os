import { useEffect, useRef } from 'react';
import { getAppSnapshot, restoreAppSnapshot, useAppStore } from '../store/useAppStore';
import { chooseSyncDirection, getLastSync, hasSupabaseConfig, isAutoSyncEnabled, pullCloudSnapshot, pushCloudSnapshot, recordLastSync, reportSyncStatus, SUPABASE_CONFIG_EVENT } from '../services/supabaseSync';

const PUSH_DELAY=2500;
const PULL_INTERVAL=60000;

export default function AutoCloudSync(){
  const{data}=useAppStore();
  const ready=useRef(false);
  const applyingRemote=useRef(false);
  const busy=useRef(false);
  const retry=useRef<number|undefined>(undefined);

  useEffect(()=>{
    let cancelled=false;
    const reconcile=async()=>{
      if(busy.current)return;
      if(!isAutoSyncEnabled()){ready.current=false;reportSyncStatus('paused','Automatic sync is paused');return}
      if(!hasSupabaseConfig()){ready.current=false;reportSyncStatus('paused','Add Supabase settings to enable automatic sync');return}
      if(!navigator.onLine){reportSyncStatus('offline','Offline · changes stay safely on this device');return}
      busy.current=true;reportSyncStatus('syncing','Checking cloud changes…');
      try{
        const remote=await pullCloudSnapshot();
        if(cancelled)return;
        const local=getAppSnapshot();
        const direction=chooseSyncDirection(local.updatedAt||'',remote?.updated_at,getLastSync());
        if(direction==='pull'&&remote?.payload?.data&&Array.isArray(remote.payload.activities)){
          applyingRemote.current=true;restoreAppSnapshot(remote.payload);recordLastSync(remote.updated_at);reportSyncStatus('synced','Cloud changes restored',remote.updated_at);
        }else if(direction==='push'){
          const rows=await pushCloudSnapshot(local);const at=rows[0]?.updated_at||new Date().toISOString();recordLastSync(at);reportSyncStatus('synced','Local changes backed up',at);
        }else reportSyncStatus('synced','Everything is up to date',getLastSync());
        ready.current=true;
      }catch(error){
        reportSyncStatus(navigator.onLine?'error':'offline',navigator.onLine?(error instanceof Error?error.message:'Automatic sync failed'):'Offline · changes stay safely on this device');
        window.clearTimeout(retry.current);retry.current=window.setTimeout(()=>void reconcile(),15000);
      }finally{busy.current=false}
    };
    void reconcile();
    const timer=window.setInterval(()=>void reconcile(),PULL_INTERVAL);
    const refresh=()=>void reconcile();
    window.addEventListener('focus',refresh);window.addEventListener('online',refresh);window.addEventListener(SUPABASE_CONFIG_EVENT,refresh);
    return()=>{cancelled=true;window.clearInterval(timer);window.clearTimeout(retry.current);window.removeEventListener('focus',refresh);window.removeEventListener('online',refresh);window.removeEventListener(SUPABASE_CONFIG_EVENT,refresh)};
  },[]);

  useEffect(()=>{
    if(!ready.current||!isAutoSyncEnabled()||!hasSupabaseConfig())return;
    if(applyingRemote.current){applyingRemote.current=false;return}
    const timer=window.setTimeout(async()=>{
      if(busy.current||!navigator.onLine)return;
      busy.current=true;reportSyncStatus('syncing','Backing up recent changes…');
      try{const rows=await pushCloudSnapshot(getAppSnapshot());const at=rows[0]?.updated_at||new Date().toISOString();recordLastSync(at);reportSyncStatus('synced','Changes backed up automatically',at)}
      catch(error){reportSyncStatus(navigator.onLine?'error':'offline',navigator.onLine?(error instanceof Error?error.message:'Automatic backup failed'):'Offline · backup will retry later')}
      finally{busy.current=false}
    },PUSH_DELAY);
    return()=>window.clearTimeout(timer);
  },[data]);

  return null;
}
