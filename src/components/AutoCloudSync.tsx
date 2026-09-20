import { useEffect, useRef } from 'react';
import { getAppSnapshot, restoreAppSnapshot, useAppStore } from '../store/useAppStore';
import { hasSupabaseConfig, isAutoSyncEnabled, pullCloudSnapshot, pushCloudSnapshot } from '../services/supabaseSync';

const PUSH_DELAY=2500;
const PULL_INTERVAL=60000;

export default function AutoCloudSync(){
  const{data}=useAppStore();
  const ready=useRef(false);
  const applyingRemote=useRef(false);
  const lastCloudUpdate=useRef('');

  useEffect(()=>{
    let cancelled=false;
    const reconcile=async()=>{
      if(!isAutoSyncEnabled()||!hasSupabaseConfig())return;
      try{
        const remote=await pullCloudSnapshot();
        if(cancelled)return;
        if(remote?.payload?.data&&Array.isArray(remote.payload.activities)){
          const local=getAppSnapshot();
          if(Date.parse(remote.updated_at)>Date.parse(local.updatedAt||'')){
            applyingRemote.current=true;
            restoreAppSnapshot(remote.payload);
          }
          lastCloudUpdate.current=remote.updated_at;
        }else await pushCloudSnapshot(getAppSnapshot());
      }catch{ /* The app remains usable offline. */ }
      finally{if(!cancelled)ready.current=true}
    };
    void reconcile();
    const pullLatest=async()=>{
      if(!ready.current||!isAutoSyncEnabled()||!hasSupabaseConfig())return;
      try{
        const remote=await pullCloudSnapshot();
        if(!remote||remote.updated_at===lastCloudUpdate.current)return;
        if(Date.parse(remote.updated_at)>Date.parse(getAppSnapshot().updatedAt||'')){
          applyingRemote.current=true;
          restoreAppSnapshot(remote.payload);
        }
        lastCloudUpdate.current=remote.updated_at;
      }catch{ /* Retry later. */ }
    };
    const timer=window.setInterval(()=>void pullLatest(),PULL_INTERVAL);
    const onFocus=()=>void pullLatest();
    window.addEventListener('focus',onFocus);
    window.addEventListener('online',onFocus);
    return()=>{cancelled=true;window.clearInterval(timer);window.removeEventListener('focus',onFocus);window.removeEventListener('online',onFocus)};
  },[]);

  useEffect(()=>{
    if(!ready.current||!isAutoSyncEnabled()||!hasSupabaseConfig())return;
    if(applyingRemote.current){applyingRemote.current=false;return}
    const timer=window.setTimeout(async()=>{
      try{
        const rows=await pushCloudSnapshot(getAppSnapshot());
        if(rows[0]?.updated_at)lastCloudUpdate.current=rows[0].updated_at;
      }catch{ /* Retry after the next local change. */ }
    },PUSH_DELAY);
    return()=>window.clearTimeout(timer);
  },[data]);

  return null;
}
