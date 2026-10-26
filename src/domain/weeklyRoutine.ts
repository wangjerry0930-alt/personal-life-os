import { localDateKey } from './date';
import type { Project, RoutineBlockKind, Task, WeeklyRoutine, WeeklyRoutineBlock } from './types';

const block=(id:string,day:number,start:string,end:string,title:string,kind:RoutineBlockKind,movable=false,extra:Partial<WeeklyRoutineBlock>={}):WeeklyRoutineBlock=>({id,day,start,end,title,kind,movable,...extra});

export const DEFAULT_WEEKLY_ROUTINE:WeeklyRoutine={
  sleepStart:'00:00',sleepEnd:'06:45',breakfastMinutes:10,
  principles:[
    'Sleep, meals, classes and confirmed society commitments are protected hard constraints.',
    'Deep technical work needs an uninterrupted 2–3 hour block; reading and writing need 1–2 hours.',
    'Light reading, references and email belong in fragmented time or experiment downtime.',
    'Keep one main deep-work project each day, then use short touchpoints to revisit one or two other projects without losing continuity.',
    'Review lecture material every day with active recall; keep the review short enough to remain sustainable.',
    'The Thursday Anika experiment block is the exception: participant downtime can hold interruptible light work from another project, but not deep technical work.',
    'Soft research blocks may move for deadlines, participants or meetings; recovery must not be consumed just because time is empty.',
  ],
  blocks:[
    block('mon-strength',1,'07:00','08:30','Strength training','exercise',true,{note:'Allow 20 min shower afterwards'}),
    block('mon-lecture-review',1,'08:45','09:15','Daily lecture review · active recall','focus',true,{note:'Recall the key idea, write questions and identify one gap without rereading everything.'}),
    block('mon-tue-reading',1,'09:30','11:30','Prepare Tuesday scientific paper reading','focus',true,{projectMatch:['NEUR0002','Patrick','literature','paper']}),
    block('mon-project-touch',1,'11:30','12:00','Project touchpoint · review next actions','light',true,{note:'Briefly revisit another active project and leave one concrete next step.'}),
    block('mon-lunch',1,'12:00','13:30','Lunch + optional nap','meal'),block('mon-commute',1,'13:45','14:00','Walk to class','hard'),block('mon-class',1,'14:00','16:00','Course','hard'),
    block('mon-grocery',1,'16:00','17:00','Groceries · next 2–3 days','admin',true,{note:'Supermarket is about 7 min away'}),block('mon-dinner',1,'17:00','18:00','Dinner','meal'),block('mon-flexible',1,'18:00','22:00','Flexible · study / social / recovery','recovery',false,{optional:true,note:'Choose based on energy and current priorities. Study can be scheduled here manually, but the planner should not auto-fill this evening.'}),
    block('tue-commute',2,'08:45','09:00','Walk to class','hard'),block('tue-class',2,'09:00','11:00','Course','hard'),block('tue-lecture-review',2,'11:00','11:30','Daily lecture review · active recall','focus',true),block('tue-lunch',2,'11:30','12:45','Lunch + optional nap','meal'),
    block('tue-patrick',2,'13:00','15:00','Patrick · NEUR0002 reading / writing','focus',true,{projectMatch:['NEUR0002','Patrick','Agency','literature','paper'],note:'Main focus block for literature reading, synthesis or drafting after the Tuesday course.'}),block('tue-project-touch',2,'15:00','16:00','Project rotation · MEG / Maze','light',true,{projectMatch:['Wang Haiteng','Semantic','MEG','Zhou Xiaoyu','Maze'],note:'Use one or two short review tasks; do not turn this into a second deep-work block.'}),block('tue-dinner',2,'17:00','18:00','Dinner','meal'),block('tue-recovery',2,'18:00','23:30','Free / social / recovery','recovery'),
    block('wed-cardio',3,'07:00','08:15','Cardio','exercise',true,{note:'Allow 20 min shower afterwards'}),block('wed-maze',3,'08:45','10:30','Zhou Xiaoyu · Maze Reconstruction','deep',true,{projectMatch:['Zhou Xiaoyu','Maze','Reconstruction']}),block('wed-commute',3,'10:45','11:00','Walk to class','hard'),block('wed-class',3,'11:00','13:00','Course','hard'),
    block('wed-lunch',3,'13:15','14:45','Lunch + optional nap','meal'),block('wed-lecture-review',3,'14:45','15:15','Daily lecture review · active recall','focus',true),block('wed-project-touch',3,'15:15','15:45','Project touchpoint · reading / next action','light',true),block('wed-committee',3,'16:00','17:00','Musical Theatre Society Committee','hard'),block('wed-dinner',3,'17:00','18:00','Dinner','meal'),block('wed-society',3,'18:00','22:00','Society','hard'),
    block('thu-strength',4,'07:00','08:30','Strength training','exercise',true,{note:'Allow 20 min shower afterwards'}),block('thu-grocery',4,'09:00','10:00','Groceries','admin',true,{note:'Supermarket is about 7 min away'}),block('thu-semantic',4,'10:00','12:00','Wang Haiteng · Semantic Decoding','deep',true,{projectMatch:['Wang Haiteng','Ray Dolan','Semantic','MEG']}),
    block('thu-lunch',4,'12:00','13:00','Lunch','meal'),block('thu-anika',4,'13:00','16:00','Anika experiment · flexible project work','focus',true,{projectMatch:['Anika','Metacognition'],note:'Two 90-minute participants: about 30 min guidance + 60 min flexible work each. Use roughly 2 hours total for interruptible reading, references, light analysis, email or follow-up from another project; no deep coding.'}),block('thu-lecture-review',4,'16:00','16:30','Daily lecture review · active recall','focus',true),block('thu-choir',4,'17:00','19:00','MT Choir Rehearsal','hard'),block('thu-dinner',4,'19:00','20:00','Dinner','meal'),block('thu-recovery',4,'20:00','23:30','Free / social / recovery','recovery'),
    block('fri-cardio',5,'07:00','08:15','Cardio','exercise',true,{note:'Allow 20 min shower afterwards'}),block('fri-commute',5,'09:45','10:00','Walk to class','hard'),block('fri-class',5,'10:00','13:00','Course','hard'),block('fri-lunch',5,'13:00','14:00','Lunch','meal'),block('fri-lecture-review',5,'14:00','14:30','Daily lecture review · active recall','focus',true),block('fri-project-mix',5,'14:30','17:30','Mixed projects · MEG / Maze / Patrick','focus',true,{projectMatch:['Wang Haiteng','Semantic','MEG','Zhou Xiaoyu','Maze','Patrick','NEUR0002'],note:'Choose two projects: one 90-minute focus task and one 30–60 minute review or next-action task.'}),
    block('fri-dinner',5,'18:00','19:00','Dinner','meal'),block('fri-society',5,'19:00','21:00','Society','hard'),
    block('sat-cardio',6,'08:00','09:15','Cardio · optional if society activity appears','exercise',true,{optional:true,note:'Saturday morning stays flexible; allow 20 min shower'}),block('sat-lecture-review',6,'10:30','11:00','Daily lecture review · active recall','focus',true),block('sat-project-touch',6,'11:00','11:45','Project touchpoint · Patrick / Maze','light',true,{projectMatch:['Patrick','NEUR0002','Zhou Xiaoyu','Maze']}),block('sat-lunch',6,'12:00','13:30','Lunch + optional nap','meal'),block('sat-semantic',6,'14:00','17:00','Wang Haiteng · Semantic Decoding','deep',true,{projectMatch:['Wang Haiteng','Ray Dolan','Semantic','MEG']}),block('sat-dinner',6,'17:30','18:30','Dinner','meal'),block('sat-recovery',6,'18:30','23:30','Light evening / recovery','recovery'),
    block('sun-cardio',0,'08:00','09:15','Cardio','exercise',true,{note:'Allow 20 min shower afterwards'}),block('sun-admin',0,'10:00','11:00','Reimbursement + weekly admin','admin',true),block('sun-reading',0,'11:00','13:00','Prepare Monday scientific paper reading','focus',true,{projectMatch:['NEUR0002','Patrick','literature','paper']}),
    block('sun-lunch',0,'13:00','14:30','Lunch + optional nap','meal'),block('sun-lecture-review',0,'14:30','15:00','Daily lecture review · active recall','focus',true),block('sun-patrick',0,'15:00','16:30','Patrick · NEUR0002 literature review','focus',true,{projectMatch:['NEUR0002','Patrick','Agency']}),block('sun-project-touch',0,'16:30','17:15','Project touchpoint · weekly continuity','light',true),block('sun-dinner',0,'18:00','19:00','Dinner','meal'),block('sun-review',0,'19:30','20:00','Weekly Review / Planning','admin',true),block('sun-recovery',0,'20:00','23:30','Free / recovery','recovery'),
  ]
};

export const WEEKLY_ROUTINE_VERSION=9;
const UPDATED_ROUTINE_IDS=new Set(['mon-flexible','mon-lecture-review','mon-project-touch','tue-patrick','tue-lecture-review','tue-project-touch','wed-maze','wed-lecture-review','wed-project-touch','thu-grocery','thu-semantic','thu-lunch','thu-anika','thu-lecture-review','thu-choir','thu-dinner','thu-recovery','fri-lecture-review','fri-project-mix','sat-lecture-review','sat-project-touch','sun-lecture-review','sun-patrick','sun-project-touch']);
const RETIRED_ROUTINE_IDS=new Set(['mon-society','mon-recovery','tue-anika','thu-maze','thu-semantic-pm','fri-anika','sun-maintenance']);
const ROUTINE_UPDATES=new Map(DEFAULT_WEEKLY_ROUTINE.blocks.filter(item=>UPDATED_ROUTINE_IDS.has(item.id)).map(item=>[item.id,item]));
export function migrateWeeklyRoutine(routine:WeeklyRoutine):WeeklyRoutine{
  const existing=new Map(routine.blocks.map(item=>[item.id,item]));
  const blocks=routine.blocks.filter(item=>!RETIRED_ROUTINE_IDS.has(item.id)).map(item=>ROUTINE_UPDATES.has(item.id)?{...item,...ROUTINE_UPDATES.get(item.id)!}:item);
  for(const [id,item] of ROUTINE_UPDATES)if(!existing.has(id))blocks.push(item);
  return{...routine,blocks};
}
export const migrateThursdayRoutine=migrateWeeklyRoutine;

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
  const score=(item:WeeklyRoutineBlock)=>matches(item,project)?(kind==='deep'&&item.kind!=='deep'?6:0):item.projectMatch?.length?(kind==='light'&&item.title.includes('Anika')?2:8):item.kind===kind?1:kind==='light'&&['focus','admin'].includes(item.kind)?3:5;
  const occurrences=candidates.map(item=>{let offset=(item.day-from.getDay()+7)%7;let date=addDays(from,offset);let start=new Date(`${localDateKey(date)}T${item.start}:00`);if(start.getTime()<=from.getTime()+30*60000){offset+=7;date=addDays(from,offset);start=new Date(`${localDateKey(date)}T${item.start}:00`)}return{item,date,start,score:score(item)}}).sort((a,b)=>a.score-b.score||a.start.getTime()-b.start.getTime());
  const chosen=occurrences[0];if(!chosen)return null;return{block:chosen.item,date:localDateKey(chosen.date),reason:matches(chosen.item,project)?'Protected block for this project':kind==='deep'?'Needs an uninterrupted 2–3 hour block':kind==='focus'?'Best in a 1–2 hour focus block':kind==='admin'?'Fits weekend or fragmented admin time':'Fits fragmented time or experiment downtime'};
}

export const routineDuration=(item:WeeklyRoutineBlock)=>minutes(item.end)-minutes(item.start);
export function routineTaskEnd(item:WeeklyRoutineBlock,duration:number){const end=Math.min(minutes(item.end),minutes(item.start)+Math.max(1,duration));return`${String(Math.floor(end/60)).padStart(2,'0')}:${String(end%60).padStart(2,'0')}`}
