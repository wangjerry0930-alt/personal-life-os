import { beforeEach, describe, expect, it } from 'vitest';
import { localDateKey } from '../src/domain/date';
import { calculateDailyStreak } from '../src/services/habitService';
import { completeQuest, undoQuest } from '../src/domain/questActions';
import { migrateLegacyData, REPOSITORY_KEY } from '../src/repositories/migration';
import { saveSnapshot } from '../src/repositories/appRepository';
import { recipeIdsForMealPlan, upsertMealPlanForSlot } from '../src/domain/mealPlan';
import { textLayerLooksCorrupted } from '../src/services/bookParser';

const storage=new Map<string,string>();
const fakeStorage={getItem:(key:string)=>storage.get(key)||null,setItem:(key:string,value:string)=>storage.set(key,value),removeItem:(key:string)=>storage.delete(key),clear:()=>storage.clear(),key:(index:number)=>Array.from(storage.keys())[index]||null,get length(){return storage.size}};
Object.defineProperty(globalThis,'localStorage',{value:fakeStorage,configurable:true});

describe('core domain invariants',()=>{
  beforeEach(()=>storage.clear());
  it('uses local business dates',()=>{const date=new Date(2026,8,4,23,59);expect(localDateKey(date)).toBe('2026-09-04')});
  it('keeps habit streak dates in local calendar',()=>{const logs=[{id:'1',createdAt:'',updatedAt:'',habitId:'h',date:'2026-09-03',completed:true},{id:'2',createdAt:'',updatedAt:'',habitId:'h',date:'2026-09-04',completed:true}];expect(calculateDailyStreak('h',logs,'2026-09-04')).toBe(2)});
  it('completes and undoes a quest consistently',()=>{const state={ranks:[],quests:[{id:'q',title:'Quest',description:'',type:'DAILY' as const,targetId:'a',targetName:'Area',minutes:15,difficulty:1 as const,status:'accepted' as const,createdAt:'2026-09-04T10:00:00Z'}]};const completed=completeQuest(state,'q');expect(completed.quests[0].status).toBe('completed');expect(completed.ranks[0].dailyCompleted).toBe(1);const undone=undoQuest(completed,'q');expect(undone.quests[0].status).toBe('accepted');expect(undone.ranks[0].dailyCompleted).toBe(0)});
  it('migrates legacy data without resetting it and is idempotent',()=>{storage.set('personal-life-os-data',JSON.stringify({areas:[],skills:[],tasks:[{id:'t',title:'Keep me',minutes:5,status:'todo'}],habits:[],activities:[],knowledge:[],projects:[],goals:[],interests:[],log:{date:'2026-09-04',learned:'',progress:'',problems:'',tomorrow:'',notes:'',minutes:0}}));storage.set('personal-life-os-people',JSON.stringify([{id:'p',name:'Alex',interests:[]} ]));const first=migrateLegacyData();expect(first.schemaVersion).toBe(6);expect(first.data.tasks[0].title).toBe('Keep me');expect(first.people).toHaveLength(1);const second=migrateLegacyData();expect(second.data.tasks[0].id).toBe('t');expect(second.people).toHaveLength(1);expect(storage.has(REPOSITORY_KEY)).toBe(true)});
  it('round trips a complete repository snapshot',()=>{const original=migrateLegacyData();const snapshot={...original,books:[{id:'book'}],food:{plans:[{date:'2026-09-04',slot:'Dinner',recipeIds:['r1','r2']}]},taskHistory:[{taskId:'t',date:'2026-09-04'}]};saveSnapshot(snapshot);const restored=migrateLegacyData();expect(restored.books).toEqual([{id:'book'}]);expect(restored.food).toEqual(snapshot.food);expect(restored.taskHistory).toEqual(snapshot.taskHistory)});
  it('keeps a meal slot unique and preserves every dish',()=>{const first={id:'m1',date:'2026-09-04',slot:'Dinner',recipeId:'r1',recipeIds:['r1','r2'],status:'PLANNED'};const second={id:'m2',date:'2026-09-04',slot:'Dinner',recipeId:'r3',status:'PLANNED'};const plans=upsertMealPlanForSlot([first],second);expect(plans).toHaveLength(1);expect(recipeIdsForMealPlan(plans[0])).toEqual(['r3'])});
  it('rejects visibly corrupted PDF text layers',()=>{const corrupted=Array(5).fill('THE WILLPOWER INSTINCT 2 NRIRAE IR 28 |_ = bp ol re AEA').join(' ');expect(textLayerLooksCorrupted(corrupted)).toBe(true);const readable=Array(5).fill('The willpower instinct describes self control and behavior in a clear sentence.').join(' ');expect(textLayerLooksCorrupted(readable)).toBe(false)});
});
