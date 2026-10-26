import { describe,expect,it } from 'vitest';
import { DEFAULT_WEEKLY_ROUTINE,recommendRoutineSlot,routineTaskEnd,taskAllocationKind } from './weeklyRoutine';
import type { Project } from './types';

const project=(name:string):Project=>({id:name,name,type:'Research project',status:'In progress',progress:0,deadline:'No deadline',meta:'',next:'',color:'#000'});

describe('weekly routine allocation',()=>{
  it('protects long technical tasks as deep work',()=>expect(taskAllocationKind({title:'Implement Transformer',description:'code model',minutes:180,timeCategory:'Work'})).toBe('deep'));
  it('routes semantic decoding work into its next protected block',()=>{const slot=recommendRoutineSlot({title:'Implement RNN',description:'technical work',minutes:180,timeCategory:'Work'},project('Wang Haiteng MEG Semantic Decoding'),DEFAULT_WEEKLY_ROUTINE,new Date('2026-10-06T12:00:00'));expect(slot?.block.id).toBe('thu-semantic');expect(slot?.date).toBe('2026-10-08')});
  it('routes Patrick reading into the nearest matching focus block',()=>{const slot=recommendRoutineSlot({title:'Read agency papers',description:'literature review',minutes:90,timeCategory:'Study'},project('Patrick Haggard NEUR0002'),DEFAULT_WEEKLY_ROUTINE,new Date('2026-10-06T12:00:00'));expect(slot?.block.id).toBe('tue-patrick')});
  it('uses only the requested duration inside a larger block',()=>{const item=DEFAULT_WEEKLY_ROUTINE.blocks.find(block=>block.id==='tue-patrick')!;expect(routineTaskEnd(item,30)).toBe('15:15');expect(routineTaskEnd(item,240)).toBe('16:45')});
  it('places training after study or after a morning-class nap',()=>{
    const byId=(id:string)=>DEFAULT_WEEKLY_ROUTINE.blocks.find(block=>block.id===id)!;
    expect(byId('mon-tue-reading').end<=byId('mon-strength').start).toBe(true);
    expect(byId('wed-maze').end<=byId('wed-cardio').start).toBe(true);
    expect(byId('thu-semantic').end<=byId('thu-strength').start).toBe(true);
    expect(byId('sat-morning-study').end<=byId('sat-cardio').start).toBe(true);
    expect(byId('sun-morning-study').end<=byId('sun-cardio').start).toBe(true);
    expect(byId('tue-cardio').start>=byId('tue-lunch').end).toBe(true);
    expect(byId('fri-cardio').start>=byId('fri-lunch').end).toBe(true);
  });
  it('keeps every day free of overlapping routine blocks',()=>{
    for(const day of [0,1,2,3,4,5,6]){
      const blocks=DEFAULT_WEEKLY_ROUTINE.blocks.filter(block=>block.day===day).sort((a,b)=>a.start.localeCompare(b.start));
      for(let index=1;index<blocks.length;index++)expect(blocks[index].start.localeCompare(blocks[index-1].end),`${blocks[index-1].id} overlaps ${blocks[index].id}`).toBeGreaterThanOrEqual(0);
    }
  });
});
