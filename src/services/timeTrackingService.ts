import type { Task, TimeEntry } from '../domain/types';
import { localDateKey } from '../domain/date';
import { appendTimeEntry, loadSnapshot, saveSnapshot } from '../repositories/appRepository';
import { consumeGamingMinutes } from './rewardService';

export const TIME_CATEGORIES=['Study','Work','Music','Entertainment','Exercise','Life','Other'];
export function createTaskTimeEntry(task:Task,startedAt:string,endedAt:string,durationMinutes:number,category='Study',notes=''):TimeEntry{return{id:`time-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,createdAt:endedAt,updatedAt:endedAt,title:task.title,category,taskId:task.id,projectId:task.projectId,areaId:task.areaId,skillId:task.skillId,startedAt,endedAt,durationMinutes,source:'task',notes}}
export function createManualTimeEntry(title:string,category:string,startedAt:string,endedAt:string,durationMinutes:number,notes='',entertainmentSubtype?:TimeEntry['entertainmentSubtype']):TimeEntry{return{id:`time-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,createdAt:endedAt,updatedAt:endedAt,title,category,entertainmentSubtype,startedAt,endedAt,durationMinutes,source:'manual',notes}}
export function saveTimeEntry(entry:TimeEntry){appendTimeEntry(entry)}
export function saveTrackedTimeEntry(entry:TimeEntry){saveTimeEntry(entry);if(entry.taskId){const snapshot=loadSnapshot();saveSnapshot({...snapshot,data:{...snapshot.data,tasks:snapshot.data.tasks.map(task=>task.id===entry.taskId?{...task,trackedMinutes:(task.trackedMinutes||0)+entry.durationMinutes}:task)}})}if(entry.category==='Entertainment'&&entry.entertainmentSubtype==='Gaming')consumeGamingMinutes(entry.durationMinutes,localDateKey(new Date(entry.endedAt)))}
export function getTimeEntries(date=localDateKey()){return loadSnapshot().timeEntries.filter(item=>localDateKey(new Date(item.endedAt))===date)}
export function getCategoryTotals(date=localDateKey()){return getTimeEntries(date).reduce<Record<string,number>>((out,item)=>{out[item.category]=(out[item.category]||0)+item.durationMinutes;return out},{})}
export function getWeeklyTotals(end=new Date()){const result:Array<{date:string;minutes:number}>=[];for(let i=6;i>=0;i--){const date=new Date(end);date.setDate(date.getDate()-i);const key=localDateKey(date);result.push({date:key,minutes:getTimeEntries(key).reduce((sum,item)=>sum+item.durationMinutes,0)})}return result}
export function startTaskTimer(task:Task){const active={title:task.title,category:'Study',task,startedAt:new Date().toISOString(),elapsed:0,running:true};localStorage.setItem('personal-life-os-active-timer',JSON.stringify(active));window.dispatchEvent(new CustomEvent('life-os-start-task-timer',{detail:active}));}
