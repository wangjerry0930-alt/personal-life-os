import { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getAnalyticsEntries } from '../services/activityService';
import { loadSnapshot } from '../repositories/appRepository';
import { localDateKey } from '../domain/date';

type Range = 7 | 30;

export default function AnalyticsPage(){
  const { data } = useAppStore();
  const [range,setRange] = useState<Range>(7);
  const entries = useMemo(()=>getAnalyticsEntries(data,range),[data,range]);
  const minutes = entries.reduce((sum,item)=>sum+item.log.minutes,0);
  const completed = entries.reduce((sum,item)=>sum+item.tasks.length,0);
  const practices = entries.reduce((sum,item)=>sum+item.skillPractices,0);
  const average = Math.round(minutes/Math.max(entries.length,1));
  const snapshot = useMemo(()=>loadSnapshot(),[data]);
  const dates = useMemo(()=>new Set(entries.map(item=>item.date)),[entries]);
  const habitLogs = snapshot.habitLogs.filter(log=>dates.has(log.date));
  const habitRate = habitLogs.length ? Math.round(habitLogs.filter(log=>log.completed).length/habitLogs.length*100) : 0;
  const skillTotals = snapshot.skillLogs.filter(log=>dates.has(localDateKey(new Date(log.occurredAt)))).reduce<Record<string,number>>((totals,log)=>{totals[log.skillId]=(totals[log.skillId]||0)+log.durationMinutes;return totals;},{});
  const topSkills = Object.entries(skillTotals).sort(([,a],[,b])=>b-a).slice(0,5);
  const projectTotals = snapshot.timeEntries.filter(entry=>dates.has(localDateKey(new Date(entry.startedAt)))).reduce<Record<string,number>>((totals,entry)=>{const key=entry.projectId||entry.category;totals[key]=(totals[key]||0)+entry.durationMinutes;return totals;},{});
  const topProjects = Object.entries(projectTotals).sort(([,a],[,b])=>b-a).slice(0,5);
  const bestDay = entries.reduce((best,item)=>item.log.minutes>best.log.minutes?item:best,entries[0]);
  const topSkill = topSkills[0] ? data.skills.find(item=>item.id===topSkills[0][0])?.name : undefined;
  const topProject = topProjects[0] ? ((data.projects||[]).find(item=>item.id===topProjects[0][0])?.name||topProjects[0][0]) : undefined;
  const completionDates = new Set(snapshot.taskCompletions.map(item=>localDateKey(new Date(item.completedAt))));
  let learningStreak = 0;
  const streakCursor = new Date();
  while(completionDates.has(localDateKey(streakCursor))){ learningStreak++; streakCursor.setDate(streakCursor.getDate()-1); }
  const maxMinutes = Math.max(...entries.map(item=>item.log.minutes),1);
  return <div className="content">
    <div className="analytics-header"><div><span className="pill purple">PROGRESS REVIEW</span><h2>See what is compounding.</h2><p className="muted">Your history, measured from one shared repository.</p></div><div className="analytics-range" role="group" aria-label="Analytics range"><button className={range===7?'active':''} onClick={()=>setRange(7)}>7 days</button><button className={range===30?'active':''} onClick={()=>setRange(30)}>30 days</button></div></div>
    <div className="analytics-summary"><article><b>{minutes}</b><span>learning minutes</span></article><article><b>{completed}</b><span>tasks completed</span></article><article><b>{practices}</b><span>skill practices</span></article><article><b>{average}</b><span>minutes per day</span></article><article><b>{habitRate}%</b><span>habit completion</span></article><article><b>{learningStreak}</b><span>learning streak</span></article></div>
    <section className="analytics-insight-row"><article><span>Best learning day</span><b>{bestDay?.date||'—'}</b><small>{bestDay?.log.minutes||0} minutes logged</small></article><article><span>Top skill</span><b>{topSkill||'—'}</b><small>{topSkills[0]?.[1]||0} minutes practiced</small></article><article><span>Top project</span><b>{topProject||'—'}</b><small>{topProjects[0]?.[1]||0} minutes tracked</small></article></section>
    <section className="analytics-card analytics-period-card"><div className="section-title"><h3>Learning time · last {range} days</h3><span className="muted">Daily activity</span></div><div className="analytics-period-chart">{entries.map(item=><div className="analytics-period-col" key={item.date} title={`${item.date}: ${item.log.minutes} min`}><div className="analytics-period-track"><i style={{height:`${item.log.minutes/maxMinutes*100}%`}}/></div><small>{range===7?new Date(`${item.date}T12:00:00`).toLocaleDateString('en-US',{weekday:'short'}):item.date.slice(5)}</small></div>)}</div></section>
    <section className="panel"><div className="section-title"><h3>Focus areas</h3><span className="muted">Current progress</span></div>{data.areas.map(area=><div className="analytics-bar" key={area.id}><div><span>{area.name}</span><b>{area.progress}%</b></div><i><em style={{width:`${Math.max(0,Math.min(100,area.progress))}%`}}/></i></div>)}</section>
    <section className="panel analytics-skills"><div className="section-title"><h3>Skill practice</h3><span className="muted">Last {range} days</span></div>{topSkills.length?topSkills.map(([skillId,total])=>{const skill=data.skills.find(item=>item.id===skillId);return <div className="analytics-bar" key={skillId}><div><span>{skill?.name||'Skill'}</span><b>{total} min</b></div><i><em style={{width:`${Math.min(100,total/Math.max(...topSkills.map(([,value])=>value),1)*100)}%`}}/></i></div>}):<p className="muted">No skill practice recorded in this period yet.</p>}</section>
    <section className="panel analytics-skills"><div className="section-title"><h3>Project focus</h3><span className="muted">Tracked time · last {range} days</span></div>{topProjects.length?topProjects.map(([projectId,total])=>{const project=(data.projects||[]).find(item=>item.id===projectId);return <div className="analytics-bar" key={projectId}><div><span>{project?.name||projectId}</span><b>{total} min</b></div><i><em style={{width:`${Math.min(100,total/Math.max(...topProjects.map(([,value])=>value),1)*100)}%`}}/></i></div>}):<p className="muted">No tracked project time in this period yet.</p>}</section>
  </div>;
}
