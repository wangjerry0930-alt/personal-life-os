import {StrictMode} from 'react';import{createRoot}from'react-dom/client';import AppErrorBoundary from './components/AppErrorBoundary';import App from './App';import'./styles.css';import'./taskTimer.css';
createRoot(document.getElementById('root')!).render(<StrictMode><AppErrorBoundary><App/></AppErrorBoundary></StrictMode>);
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`,{updateViaCache:'none'}).then(reg=>{reg.update();return reg}).catch(()=>undefined))}
