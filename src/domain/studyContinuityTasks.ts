import type { AppData, Project, Task } from './types';

const normalize=(value:string)=>String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,'');
const projectId=(projects:Project[],matches:string[])=>projects.find(project=>matches.some(match=>normalize(`${project.name} ${project.meta}`).includes(normalize(match))))?.id;

export function ensureStudyContinuityTasks(data:AppData):AppData{
  const templates:Array<Omit<Task,'projectId'>&{projectMatches?:string[]}>= [
    {id:'profile-task-daily-lecture-recall',title:"Review today's lecture with active recall",description:'Without rereading first, write the key idea, three recall questions and one unclear point.',minutes:25,difficulty:'Easy',category:'Daily progress',timeCategory:'Study',priority:'High',status:'todo',notes:'Continuity starter · Lecture review'},
    {id:'profile-task-meg-baseline-step',title:'MEG decoding · implement and explain one baseline step',description:'Build one small RNN, CNN or Transformer component and leave a runnable result you can explain.',minutes:45,difficulty:'Medium',category:'Manual',timeCategory:'Work',priority:'High',status:'todo',notes:'Continuity starter · MEG Semantic Decoding',projectMatches:['Wang Haiteng','Ray Dolan','Semantic Decoding']},
    {id:'profile-task-patrick-paper',title:'Patrick review · annotate one agency paper',description:'Capture the claim, method, evidence, limitation and how it supports the literature review.',minutes:30,difficulty:'Medium',category:'Manual',timeCategory:'Study',priority:'High',status:'todo',notes:'Continuity starter · NEUR0002',projectMatches:['Patrick Haggard','NEUR0002']},
    {id:'profile-task-maze-step',title:'Maze reconstruction · complete one technical step',description:'Reconstruct or verify one function, trial or modelling assumption and record the result.',minutes:30,difficulty:'Medium',category:'Manual',timeCategory:'Work',priority:'Medium',status:'todo',notes:'Continuity starter · Maze Reconstruction',projectMatches:['Zhou Xiaoyu','Maze Reconstruction']},
    {id:'profile-task-anika-checkpoint',title:'Anika · prepare the next experiment checkpoint',description:'Check participant guidance, analysis notes and the smallest useful follow-up for Thursday.',minutes:20,difficulty:'Easy',category:'Manual',timeCategory:'Work',priority:'Medium',status:'todo',notes:'Continuity starter · Anika',projectMatches:['Anika Bolt','Metacognition Experiment']},
    {id:'profile-task-tal-maintenance',title:'Tal / Denis · check status and next follow-up',description:'Review whether new data or results arrived; record the next action or leave it waiting.',minutes:10,difficulty:'Easy',category:'Manual',timeCategory:'Admin',priority:'Low',status:'todo',notes:'Continuity starter · Boredom Agency',projectMatches:['Tal Nahari','Boredom Agency']},
  ];
  const existing=new Set(data.tasks.map(task=>task.id));
  const additions=templates.filter(task=>!existing.has(task.id)).map(({projectMatches,...task})=>({...task,projectId:projectMatches?projectId(data.projects,projectMatches):undefined}));
  return additions.length?{...data,tasks:[...additions,...data.tasks]}:data;
}
