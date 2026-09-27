export type PersistedTaskTimer={accumulatedSeconds:number;startedAt:number|null;running:boolean};
const prefix='personal-life-os-task-timer-v1:';
export const emptyTaskTimer=():PersistedTaskTimer=>({accumulatedSeconds:0,startedAt:null,running:false});
export const taskTimerKey=(taskId:string)=>prefix+taskId;
export function elapsedTaskSeconds(timer:PersistedTaskTimer,now=Date.now()){const live=timer.running&&timer.startedAt?Math.max(0,Math.floor((now-timer.startedAt)/1000)):0;return Math.max(0,timer.accumulatedSeconds+live)}
export function startTaskClock(timer:PersistedTaskTimer,now=Date.now()):PersistedTaskTimer{return timer.running?timer:{...timer,startedAt:now,running:true}}
export function pauseTaskClock(timer:PersistedTaskTimer,now=Date.now()):PersistedTaskTimer{return{accumulatedSeconds:elapsedTaskSeconds(timer,now),startedAt:null,running:false}}
export function loadTaskTimer(taskId:string):PersistedTaskTimer{try{const value=JSON.parse(localStorage.getItem(taskTimerKey(taskId))||'null');if(value&&Number.isFinite(value.accumulatedSeconds))return{accumulatedSeconds:Math.max(0,value.accumulatedSeconds),startedAt:Number.isFinite(value.startedAt)?value.startedAt:null,running:Boolean(value.running&&Number.isFinite(value.startedAt))}}catch{}return emptyTaskTimer()}
export function saveTaskTimer(taskId:string,timer:PersistedTaskTimer){localStorage.setItem(taskTimerKey(taskId),JSON.stringify(timer))}
export function clearTaskTimer(taskId:string){localStorage.removeItem(taskTimerKey(taskId))}
export function startExclusiveTaskTimer(taskId:string,now=Date.now()){for(let index=0;index<localStorage.length;index++){const key=localStorage.key(index);if(!key?.startsWith(prefix)||key===taskTimerKey(taskId))continue;const otherId=key.slice(prefix.length);const other=loadTaskTimer(otherId);if(other.running)saveTaskTimer(otherId,pauseTaskClock(other,now))}const next=startTaskClock(loadTaskTimer(taskId),now);saveTaskTimer(taskId,next);window.dispatchEvent(new CustomEvent('life-os-task-timers-changed'));return next}
