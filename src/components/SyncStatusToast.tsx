import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { SUPABASE_STATUS_EVENT } from '../services/supabaseSync';

type SyncStatus={state:'syncing'|'synced'|'offline'|'error'|'paused';message:string;at?:string};
export default function SyncStatusToast(){
  const[status,setStatus]=useState<SyncStatus|null>(null);
  const hideTimer=useRef<number|undefined>(undefined);
  useEffect(()=>{
    const update=(event:Event)=>{
      const next=(event as CustomEvent<SyncStatus>).detail;
      window.clearTimeout(hideTimer.current);
      if(next.state==='paused'){setStatus(null);return}
      setStatus(next);
      if(next.state==='synced')hideTimer.current=window.setTimeout(()=>setStatus(null),2600);
    };
    window.addEventListener(SUPABASE_STATUS_EVENT,update);
    return()=>{window.clearTimeout(hideTimer.current);window.removeEventListener(SUPABASE_STATUS_EVENT,update)};
  },[]);
  if(!status)return null;
  const icon=status.state==='synced'?'CheckCircle2':status.state==='error'?'CircleHelp':status.state==='offline'?'Cloud':'RefreshCw';
  return <aside className={`sync-toast ${status.state}`} role="status" aria-live="polite"><Icon name={icon} size={17}/><div><b>{status.state==='syncing'?'Syncing':status.state==='synced'?'Saved':status.state==='offline'?'Working offline':'Sync needs attention'}</b><span>{status.message}</span></div>{status.state!=='syncing'&&<button onClick={()=>setStatus(null)} aria-label="Dismiss sync status">×</button>}</aside>;
}
