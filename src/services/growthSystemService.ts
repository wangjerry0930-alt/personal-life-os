import type { AppData, RepositorySnapshot, Task, TimeEntry } from '../domain/types';

export type GrowthStatId='knowledge'|'proficiency'|'courage'|'kindness'|'expression';
export interface GrowthStat{id:GrowthStatId;name:string;description:string;xp:number;level:number;levelName:string;progress:number;nextAt:number|null;color:string;suggestion:string}
export interface GrowthOverview{stats:GrowthStat[];overallLevel:number;completedTasks:number;trackedHours:number;bondCount:number;interactionCount:number}

const thresholds=[0,60,180,420,780];
const levelNames:Record<GrowthStatId,string[]>={
  knowledge:['Curious','Informed','Analytical','Scholarly','Sage'],
  proficiency:['Novice','Practised','Capable','Crafted','Masterful'],
  courage:['Tentative','Steady','Bold','Resolute','Fearless'],
  kindness:['Aware','Considerate','Supportive','Compassionate','Generous'],
  expression:['Reserved','Open','Engaging','Magnetic','Radiant'],
};
const definitions:Record<GrowthStatId,Omit<GrowthStat,'id'|'xp'|'level'|'levelName'|'progress'|'nextAt'>>={
  knowledge:{name:'Knowledge',description:'Reading, courses and deliberate study.',color:'#6f7df6',suggestion:'Read, review a lecture, or explain one concept.'},
  proficiency:{name:'Proficiency',description:'Technical practice and making tangible things.',color:'#30a88f',suggestion:'Practise a skill or produce a small working artefact.'},
  courage:{name:'Courage',description:'Hard tasks, deep work and chosen discomfort.',color:'#e27762',suggestion:'Start the important task you have been avoiding.'},
  kindness:{name:'Kindness',description:'Care, contribution and maintaining relationships.',color:'#e39aaa',suggestion:'Follow up with someone or do one useful thing for them.'},
  expression:{name:'Expression',description:'Music, creativity, communication and social life.',color:'#d59a39',suggestion:'Create, perform, write, or have a real conversation.'},
};

const text=(task:Task)=>`${task.title} ${task.description||''} ${task.timeCategory||''} ${task.notes||''}`.toLowerCase();
const taskXp=(task:Task):Partial<Record<GrowthStatId,number>>=>{
  const value=6+(task.difficulty==='Hard'?6:task.difficulty==='Medium'?3:0),body=text(task),result:Partial<Record<GrowthStatId,number>>={};
  if(/study|paper|read|lecture|course|review|learn|knowledge|文献|学习|课程/.test(body))result.knowledge=value;
  if(/code|model|analysis|technical|skill|build|experiment|data|notebook|编程|分析|实验/.test(body))result.proficiency=value;
  if(task.difficulty==='Hard'||/deep|challenge|difficult|hard|deadline|困难|深度/.test(body))result.courage=value;
  if(/people|follow up|help|mentor|friend|connection|contact|关系|联系|帮助/.test(body))result.kindness=value;
  if(/music|choir|theatre|social|write|present|creative|journal|音乐|社交|写作/.test(body))result.expression=value;
  if(!Object.keys(result).length)result.proficiency=value;
  return result;
};
const entryStat=(entry:TimeEntry):GrowthStatId=>{
  const body=`${entry.category} ${entry.title} ${entry.notes||''}`.toLowerCase();
  if(/study|learn|course|reading|paper|lecture|knowledge/.test(body))return'knowledge';
  if(/music|social|creative|choir|theatre|journal/.test(body))return'expression';
  if(/connection|people|care|volunteer|family/.test(body))return'kindness';
  if(/exercise|deep|challenge/.test(body))return'courage';
  return'proficiency';
};
const makeStat=(id:GrowthStatId,xp:number):GrowthStat=>{const level=Math.min(5,thresholds.filter(value=>xp>=value).length),start=thresholds[level-1],next=level<5?thresholds[level]:null;return{id,...definitions[id],xp,level,levelName:levelNames[id][level-1],progress:next===null?100:Math.round((xp-start)/(next-start)*100),nextAt:next}};

export function buildGrowthOverview(data:AppData,snapshot:RepositorySnapshot):GrowthOverview{
  const xp:Record<GrowthStatId,number>={knowledge:0,proficiency:0,courage:0,kindness:0,expression:0};
  for(const entry of snapshot.timeEntries||[])xp[entryStat(entry)]+=Math.max(1,Math.round(entry.durationMinutes/10));
  const completed=data.tasks.filter(task=>task.status==='done');for(const task of completed)for(const[id,value]of Object.entries(taskXp(task)) as [GrowthStatId,number][])xp[id]+=value;
  for(const log of snapshot.skillLogs||[])xp.proficiency+=Math.max(1,Math.round(log.durationMinutes/15));
  for(const attempt of snapshot.recallAttempts||[])xp.knowledge+=attempt.result==='correct'?2:1;
  const people=(snapshot.people||[]) as Array<{interactions?:unknown[]}>;const interactionCount=people.reduce((sum,person)=>sum+(person.interactions?.length||0),0)+((snapshot.interactions||[]) as unknown[]).length;
  xp.kindness+=interactionCount*8;xp.expression+=interactionCount*4;
  const stats=(Object.keys(definitions) as GrowthStatId[]).map(id=>makeStat(id,xp[id]));
  return{stats,overallLevel:Math.round(stats.reduce((sum,stat)=>sum+stat.level,0)/stats.length),completedTasks:completed.length,trackedHours:Math.round((snapshot.timeEntries||[]).reduce((sum,entry)=>sum+entry.durationMinutes,0)/6)/10,bondCount:people.length,interactionCount};
}
