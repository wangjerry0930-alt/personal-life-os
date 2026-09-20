import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppErrorBoundary from './components/AppErrorBoundary';
import AutoCloudSync from './components/AutoCloudSync';
import SyncStatusToast from './components/SyncStatusToast';
import App from './App';
import { APP_VERSION } from './version';
import './styles.css';
import './taskTimer.css';

createRoot(document.getElementById('root')!).render(<StrictMode><AppErrorBoundary><AutoCloudSync/><SyncStatusToast/><App/></AppErrorBoundary></StrictMode>);

if('serviceWorker' in navigator){
  window.addEventListener('load',async()=>{
    let refreshing=false;
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(refreshing)return;
      refreshing=true;
      window.location.reload();
    });
    try{
      const registration=await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js?v=${APP_VERSION}`,{updateViaCache:'none'});
      await registration.update();
      const check=()=>registration.update().catch(()=>undefined);
      window.setInterval(check,15*60*1000);
      document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check()});
    }catch{ /* The app still works without offline support. */ }
  });
}
