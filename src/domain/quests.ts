export type QuestType='DAILY'|'WEEKLY'|'PRACTICE'|'LEARNING'|'EXPLORATION'|'RESEARCH'|'CREATIVE'|'CHALLENGE'|'PROMOTION'|'CAPSTONE'|'BOSS'|'CUSTOM';
export interface Quest{ id:string; title:string; description:string; type:QuestType; targetId:string; targetName:string; minutes:number; difficulty:1|2|3|4|5; prerequisites?:string[]; cooldownDays?:number; weight?:number; weekKey?:string; evidence?:string; status:'available'|'accepted'|'completed'|'skipped'; createdAt:string; completedAt?:string; source?:'generated'|'imported' }
export interface AreaRank{ targetId:string; targetName:string; rank:number; dailyCompleted:number; weeklyCompleted:number; promotionUnlocked:boolean; promotionCompleted:boolean }
export const rankNames=['Initiate','Beginner','Developing','Intermediate','Advanced','High Rank','Master Rank','Expert'];
export const questSeedAreas=[
 ...['Neuroscience','Computational Neuroscience','Computational Cognitive Neuroscience','Computational Psychiatry','Decision Making','Metacognition','Agency','Sense of Agency','Controllability','BCI','AI','Machine Learning','Research','Confidence','Attention','Boredom','Flow','Curiosity','EEG','Neural Decoding','Reinforcement Learning','Bayesian Models','Neural Interfaces'],
 ...['Computational Modelling','Python','AI Tools','App Development','GitHub','Signal Processing','自动化','数据分析'],
 ...['Product Thinking','管理','创业','商业模式','领导力','团队管理','市场与增长'],
 ...['剪辑','摄影','内容创作','视觉叙事','视频制作'],
 ...['音乐','长号','声乐','古典音乐','管弦乐','歌剧','音乐制作','编曲'],
 ...['健身','烹饪','咖啡','茶','鸡尾酒','酒吧文化','旅行','美食'],
 ...['中医','易经','相术','塔罗牌','中国哲学']
];
const seedDaily=['定义一个核心概念，并写出机制与例子','读一篇摘要，用一句话写出研究问题','只看一张图，解释坐标、条件与结论','写3个主动回忆问题并闭卷回答','比较两个易混概念','找一个经典研究并说明影响','找一个近12个月研究并记录新意','提出一个可证伪假设与预测','识别一个混淆变量或替代解释','画一张5节点概念图','解释一种常用测量或分析方法','检查一项证据的样本与推断边界','把生活现象转成研究问题','提出一个后续实验','用100字总结今天最值得保留的知识'];
const seedWeekly=['完成一次60–90分钟专题学习并输出一页笔记','完成一个可展示的小项目或实践样品','比较至少3个来源/范例并写综合结论','向他人讲解或演示，并记录反馈','做一次闭卷复盘或技能测评','整理本周证据、错误与下周改进计划'];
const seedChallenge=['连续7天完成最小练习并保留证据','在限定90分钟内从零完成一个小成果','选择一个陌生子主题，产出结构化入门指南','接受一次外部反馈并完成可见修订'];
const seedPromotion=['12次Daily + 2次Weekly，并完成一次闭卷解释','20次Daily + 4次Weekly + 1次Challenge，并提交作品','30次Daily + 6次Weekly + 2次Challenge，完成方法比较','40次Daily + 8次Weekly，完成端到端真实项目','完成跨领域项目并进行正式展示','形成个人方法论、旗舰成果并指导他人'];
const seedBoss=['解决一个真实问题的端到端项目','作品集或研究档案与正式答辩'];
export const defaultQuestPool=questSeedAreas.flatMap((area,areaIndex)=>[...seedDaily.map((title,index)=>({id:`seed-${areaIndex}-d${index+1}`,area,type:'DAILY' as const,title:`${title}：${area}`,description:`围绕 ${area} 完成这项小任务。`,minutes:15,difficulty:1 as const})),...seedWeekly.map((title,index)=>({id:`seed-${areaIndex}-w${index+1}`,area,type:'WEEKLY' as const,title:`${title}：${area}`,description:`保留可复查产物。`,minutes:75,difficulty:3 as const})),...seedChallenge.map((title,index)=>({id:`seed-${areaIndex}-c${index+1}`,area,type:'CHALLENGE' as const,title:`${title}：${area}`,description:'记录过程证据与结果。',minutes:60,difficulty:4 as const})),...seedPromotion.map((title,index)=>({id:`seed-${areaIndex}-p${index+1}`,area,type:'PROMOTION' as const,title:`晋级任务 R${index+1}：${area}`,description:title,minutes:90,difficulty:4 as const})),...seedBoss.map((title,index)=>({id:`seed-${areaIndex}-b${index+1}`,area,type:'BOSS' as const,title:`Boss Quest：${title} · ${area}`,description:'综合多个能力完成最终成果。',minutes:180,difficulty:5 as const}))]);
export const questTemplates=(name:string):Omit<Quest,'id'|'targetId'|'targetName'|'createdAt'|'status'>[]=>{const seeded=defaultQuestPool.filter(item=>item.area.toLowerCase()===name.toLowerCase());if(seeded.length)return seeded as any;return [
 {title:`Review one ${name} concept`,description:`Recall one idea from ${name} without notes, then check your understanding.`,type:'DAILY',minutes:10,difficulty:1},
 {title:`Explore one question in ${name}`,description:`Write down one question and spend a focused session finding a useful answer.`,type:'EXPLORATION',minutes:15,difficulty:2},
 {title:`Make one small practice step in ${name}`,description:`Turn your current interest into a concrete, observable exercise.`,type:'PRACTICE',minutes:20,difficulty:2},
 {title:`Study one deeper source on ${name}`,description:`Read a section of a paper, book or course and capture three takeaways.`,type:'WEEKLY',minutes:45,difficulty:3},
 {title:`Explain ${name} in your own words`,description:`Create a short explanation that demonstrates understanding rather than recognition.`,type:'CHALLENGE',minutes:30,difficulty:3},
 {title:`Promotion: demonstrate ${name}`,description:`Complete a small artifact or explanation that proves your current level.`,type:'PROMOTION',minutes:40,difficulty:4}
]};
export const makeQuest=(template:ReturnType<typeof questTemplates>[number],targetId:string,targetName:string):Quest=>({...template,id:`quest-${targetId}-${template.type}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,targetId,targetName,cooldownDays:template.type==='WEEKLY'?7:2,weight:1,status:'available',createdAt:new Date().toISOString()});
export function weightedSample<T extends {weight?:number}>(items:T[],count:number){const pool=[...items];const result:T[]=[];while(pool.length&&result.length<count){const total=pool.reduce((sum,item)=>sum+Math.max(.01,item.weight||1),0);let pick=Math.random()*total;const index=pool.findIndex(item=>{pick-=Math.max(.01,item.weight||1);return pick<=0});result.push(pool.splice(index<0?pool.length-1:index,1)[0])}return result}
export const prerequisitesMet=(quest:Quest,completed:Quest[])=>!quest.prerequisites?.length||quest.prerequisites.every(requirement=>completed.some(item=>item.id===requirement||item.title.toLowerCase()===requirement.toLowerCase()));
