export type QuestType='DAILY'|'WEEKLY'|'PRACTICE'|'LEARNING'|'EXPLORATION'|'RESEARCH'|'CREATIVE'|'CHALLENGE'|'PROMOTION'|'CAPSTONE'|'CUSTOM';
export interface Quest{ id:string; title:string; description:string; type:QuestType; targetId:string; targetName:string; minutes:number; difficulty:1|2|3|4|5; prerequisites?:string[]; status:'available'|'accepted'|'completed'|'skipped'; createdAt:string; completedAt?:string; source?:'generated'|'imported' }
export interface AreaRank{ targetId:string; targetName:string; rank:number; dailyCompleted:number; weeklyCompleted:number; promotionUnlocked:boolean; promotionCompleted:boolean }
export const rankNames=['Initiate','Beginner','Developing','Intermediate','Advanced','High Rank','Master Rank','Expert'];
export const questTemplates=(name:string):Omit<Quest,'id'|'targetId'|'targetName'|'createdAt'|'status'>[]=>[
 {title:`Review one ${name} concept`,description:`Recall one idea from ${name} without notes, then check your understanding.`,type:'DAILY',minutes:10,difficulty:1},
 {title:`Explore one question in ${name}`,description:`Write down one question and spend a focused session finding a useful answer.`,type:'EXPLORATION',minutes:15,difficulty:2},
 {title:`Make one small practice step in ${name}`,description:`Turn your current interest into a concrete, observable exercise.`,type:'PRACTICE',minutes:20,difficulty:2},
 {title:`Study one deeper source on ${name}`,description:`Read a section of a paper, book or course and capture three takeaways.`,type:'WEEKLY',minutes:45,difficulty:3},
 {title:`Explain ${name} in your own words`,description:`Create a short explanation that demonstrates understanding rather than recognition.`,type:'CHALLENGE',minutes:30,difficulty:3},
 {title:`Promotion: demonstrate ${name}`,description:`Complete a small artifact or explanation that proves your current level.`,type:'PROMOTION',minutes:40,difficulty:4}
];
export const makeQuest=(template:ReturnType<typeof questTemplates>[number],targetId:string,targetName:string):Quest=>({...template,id:`quest-${targetId}-${template.type}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,targetId,targetName,status:'available',createdAt:new Date().toISOString()});
