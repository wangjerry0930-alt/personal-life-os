import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { playCompletionSound } from '../services/completionSoundService';

const START='personal-life-os-sedentary-start',SNOOZE='personal-life-os-sedentary-snooze';
const HOUR=60*60*1000,AWAY=10*60*1000;
const storedNumber=(key:string,fallback:number)=>{const value=Number(localStorage.getItem(key));return Number.isFinite(value)&&value>0?value:fallback};

export default function SedentaryReminder(){
 const[visible,setVisible]=useState(false),lastActivity=useRef(Date.now()),start=useRef(storedNumber(START,Date.now())),snooze=useRef(storedNumber(SNOOZE,0)),shown=useRef(false);
 useEffect(()=>{if(!localStorage.getItem(START))localStorage.setItem(START,String(start.current));const activity=()=>{const now=Date.now();if(now-lastActivity.current>AWAY){start.current=now;localStorage.setItem(START,String(now));shown.current=false}lastActivity.current=now};const check=()=>{if(shown.current||document.visibilityState!=='visible')return;const now=Date.now();if(now-lastActivity.current<AWAY&&now-start.current>=HOUR&&now>=snooze.current){shown.current=true;setVisible(true);playCompletionSound('break');if('Notification'in window&&Notification.permission==='granted')new Notification('Time to stand up',{body:'You have been at the computer for about an hour. Move for a few minutes.',tag:'life-os-sedentary'})}};for(const event of['pointerdown','keydown','focus'] as const)window.addEventListener(event,activity,{passive:true});document.addEventListener('visibilitychange',activity);const timer=window.setInterval(check,30000);check();return()=>{for(const event of['pointerdown','keydown','focus'] as const)window.removeEventListener(event,activity);document.removeEventListener('visibilitychange',activity);window.clearInterval(timer)}},[]);
 const reset=()=>{const now=Date.now();start.current=now;snooze.current=0;shown.current=false;localStorage.setItem(START,String(now));localStorage.removeItem(SNOOZE);setVisible(false)};const later=()=>{snooze.current=Date.now()+10*60*1000;shown.current=false;localStorage.setItem(SNOOZE,String(snooze.current));setVisible(false)};
 if(!visible)return null;return <div className="sedentary-backdrop" role="dialog" aria-modal="true" aria-labelledby="sedentary-title"><section className="sedentary-reminder"><div className="sedentary-figure"><Icon name="PersonStanding" size={43}/><i/><i/></div><span className="pill teal">60 MINUTE RESET</span><h2 id="sedentary-title">起来活动一下</h2><p>你已经连续使用电脑约一小时。站起来走动、伸展肩颈，看看远处，再回来继续。</p><div className="sedentary-actions"><button className="primary" onClick={reset}><Icon name="Check" size={15}/> 我去活动了</button><button className="secondary" onClick={later}><Icon name="Clock3" size={15}/> 10 分钟后提醒</button></div></section></div>;
}
