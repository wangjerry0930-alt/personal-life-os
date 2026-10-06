import { localDateKey } from './date';
import type { Project, RoutineBlockKind, Task, WeeklyRoutine, WeeklyRoutineBlock } from './types';

const block=(id:string,day:number,start:string,end:string,title:string,kind:RoutineBlockKind,movable=false,extra:Partial<WeeklyRoutineBlock>={}):WeeklyRoutineBlock=>({id,day,start,end,title,kind,movable,...extra});

export const DEFAULT_WEEKLY_ROUTINE:WeeklyRoutine={
  sleepStart:'00:00',sleepEnd:'06:45',breakfastMinutes:10,
  principles:[
    'Sleep, meals, classes and society commitments are protected hard constraints.',
    'Deep technical work needs an uninterrupted 2–3 hour block; reading and writing need 1–2 hours.',
    'Light reading, references and email belong in fragmented time or experiment downtime.',
    'Soft research blocks may move for deadlines, participants or meetings; recovery must not be consumed just because time is empty.',
  ],
  blocks:[
    block('mon-strength',1,'07:00','08:30','Strength training','exercise',true,{note:'Allow 20 min shower afterwards'}),
    block('mon-tue-reading',1,'09:30','11:30','Prepare Tuesday scientific paper reading','focus',true,{projectMatch:['NEUR0002','Patrick','literature','paper']}),
    block('mon-lunch',1,'12:00','13:30','Lunch + optional nap','meal'),block('mon-commute',1,'13:45','14:00','Walk to class','hard'),block('mon-class',1,'14:00','16:00','Course','hard'),
    block('mon-grocery',1,'16:00','17:00','Groceries · next 2–3 days','admin',true,{note:'Supermarket is about 7 min away'}),block('mon-dinner',1,'17:00','18:00','Dinner','meal'),block('mon-society',1,'18:00','22:00','Society','hard'),
    block('tue-commute',2,'08:45','09:00','Walk to class','hard'),block('tue-class',2,'09:00','11:00','Course','hard'),block('tue-lunch',2,'11:30','12:45','Lunch + optional nap','meal'),
    block('tue-anika',2,'13:00','16:00','Anika · Metacognition experiment','focus',true,{projectMatch:['Anika','Metacognition'],note:'Two participants; use downtime only for light reading, references or email'}),block('tue-dinner',2,'17:00','18:00','Dinner','meal'),block('tue-recovery',2,'18:00','23:30','Free / social / recovery','recovery'),
    block('wed-cardio',3,'07:00','08:15','Cardio','exercise',true,{note:'Allow 20 min shower afterwards'}),block('wed-commute',3,'10:45','11:00','Walk to class','hard'),block('wed-class',3,'11:00','13:00','Course','hard'),
    block('wed-lunch',3,'13:15','14:45','Lunch + optional nap','meal'),block('wed-committee',3,'16:00','17:00','Musical Theatre Society Committee','hard'),block('wed-dinner',3,'17:00','18:00','Dinner','meal'),block('wed-society',3,'18:00','22:00','Society','hard'),
    block('thu-strength',4,'07:00','08:30','Strength training','exercise',true,{note:'Allow 20 min shower afterwards'}),block('thu-semantic',4,'09:00','12:00','Wang Haiteng · Semantic Decoding','deep',true,{projectMatch:['Wang Haiteng','Ray Dolan','Semantic','MEG']}),
    block('thu-lunch',4,'12:00','13:30','Lunch + optional nap','meal'),block('thu-maze',4,'14:00','17:00','Zhou Xiaoyu · Maze Reconstruction','deep',true,{projectMatch:['Zhou Xiaoyu','Maze','Reconstruction']}),block('thu-grocery',4,'17:10','18:10','Groceries','admin',true),block('thu-dinner',4,'18:10','19:10','Dinner','meal'),block('thu-recovery',4,'19:10','23:30','Free / social / recovery','recovery'),
    block('fri-cardio',5,'07:00','08:15','Cardio','exercise',true,{note:'Allow 20 min shower afterwards'}),block('fri-commute',5,'09:45','10:00','Walk to class','hard'),block('fri-class',5,'10:00','13:00','Course','hard'),block('fri-lunch',5,'13:00','14:00','Lunch','meal'),
    block('fri-anika',5,'15:00','18:00','Anika · Metacognition experiment','focus',true,{projectMatch:['Anika','Metacognition'],note:'Participant-dependent; light reading/email during downtime'}),block('fri-dinner',5,'18:00','19:00','Dinner','meal'),block('fri-society',5,'19:00','21:00','Society','hard'),
    block('sat-cardio',6,'08:00','09:15','Cardio · optional if society activity appears','exercise',true,{optional:true,note:'Saturday morning stays flexible; allow 20 min shower'}),block('sat-lunch',6,'12:00','13:30','Lunch + optional nap','meal'),block('sat-semantic',6,'14:00','17:00','Wang Haiteng · Semantic Decoding','deep',true,{projectMatch:['Wang Haiteng','Ray Dolan','Semantic','MEG']}),block('sat-dinner',6,'17:30','18:30','Dinner','meal'),block('sat-recovery',6,'18:30','23:30','Light evening / recovery','recovery'),
    block('sun-cardio',0,'08:00','09:15','Cardio','exercise',true,{note:'Allow 20 min shower afterwards'}),block('sun-admin',0,'10:00','11:00','Reimbursement + weekly admin','admin',true),block('sun-reading',0,'11:00','13:00','Prepare Monday scientific paper reading','focus',true,{projectMatch:['NEUR0002','Patrick','literature','paper']}),
    block('sun-lunch',0,'13:00','14:30','Lunch + optional nap','meal'),block('sun-patrick',0,'15:00','17:00','Patrick · NEUR0002 literature review','focus',true,{projectMatch:['NEUR0002','Patrick','Agency']}),block('sun-maintenance',0,'17:00','17:30','Tal + Denis · project maintenance','light',true,{projectMatch:['Tal','Denis','Boredom']}),block('sun-dinner',0,'18:00','19:00','Dinner','meal'),block('sun-review',0,'19:30','20:00','Weekly Review / Planning','admin',true),block('sun-recovery',0,'20:00','23:30','Free / recovery','recovery'),
  ]
};

const minutes=(value:string)=>{const[h,m]=value.split(':').map(Number);return h*60+m};
const addDays=(date:Date,amount:number)=>{const next=new Date(date);next.setDate(next.getDate()+amount);return next};
const matches=(block:WeeklyRoutineBlock,project?:Project)=>{if(!project||!block.projectMatch?.length)return false;const text=`${project.name} ${project.type} ${project.meta} ${project.notes||''}`.toLowerCase();return block.projectMatch.some(value=>text.includes(value.toLowerCase()))};
export function taskAllocationKind(task:Pick<Task,'title'|'description'|'minutes'|'timeCategory'>,project?:Project):RoutineBlockKind{
  const text=`${task.title} ${task.description} ${project?.name||''} ${project?.meta||''}`.toLowerCase();
  if(/\b(admin|reimburse|expense|form|housework)\b/.test(text))return'admin';
  if(/email|abstract|reference|references|follow.?up/.test(text)||task.minutes<=30)return'light';
  if(/code|coding|implement|model|rnn|cnn|transformer|meg|maze|reconstruct|analysis/.test(text)||task.minutes>=120)return'deep';
  if(/paper|read|reading|literature|review|write|writing/.test(text))return'focus';
  return task.timeCategory==='Work'?'focus':'light';
}
export function recommendRoutineSlot(task:Pick<Task,'title'|'description'|'minutes'|'timeCategory'>,project?:Project,routine=DEFAULT_WEEKLY_ROUTINE,from=new Date()){
  const kind=taskAllocationKind(task,project);const candidates=routine.blocks.filter(item=>item.movable&&item.kind!=='recovery'&&item.kind!=='meal'&&item.kind!=='exercise');
  const score=(item:WeeklyRoutineBlock)=>matches(item,project)?0:item.projectMatch?.length?(kind==='light'&&item.title.includes('Anika')?2:8):item.kind===kind?1:kind==='light'&&['focus','admin'].includes(item.kind)?3:5;
  const occurrences=candidates.map(item=>{let offset=(item.day-from.getDay()+7)%7;let date=addDays(from,offset);let start=new Date(`${localDateKey(date)}T${item.start}:00`);if(start.getTime()<=from.getTime()+30*60000){offset+=7;date=addDays(from,offset);start=new Date(`${localDateKey(date)}T${item.start}:00`)}return{item,date,start,score:score(item)}}).sort((a,b)=>a.score-b.score||a.start.getTime()-b.start.getTime());
  const chosen=occurrences[0];if(!chosen)return null;return{block:chosen.item,date:localDateKey(chosen.date),reason:matches(chosen.item,project)?'Protected block for this project':kind==='deep'?'Needs an uninterrupted 2–3 hour block':kind==='focus'?'Best in a 1–2 hour focus block':kind==='admin'?'Fits weekend or fragmented admin time':'Fits fragmented time or experiment downtime'};
}

export const routineDuration=(item:WeeklyRoutineBlock)=>minutes(item.end)-minutes(item.start);
export function routineTaskEnd(item:WeeklyRoutineBlock,duration:number){const end=Math.min(minutes(item.end),minutes(item.start)+Math.max(1,duration));return`${String(Math.floor(end/60)).padStart(2,'0')}:${String(end%60).padStart(2,'0')}`}
