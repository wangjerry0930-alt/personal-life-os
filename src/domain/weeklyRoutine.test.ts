import { describe,expect,it } from 'vitest';
import { DEFAULT_WEEKLY_ROUTINE,recommendRoutineSlot,routineTaskEnd,taskAllocationKind } from './weeklyRoutine';
import type { Project } from './types';

const project=(name:string):Project=>({id:name,name,type:'Research project',status:'In progress',progress:0,deadline:'No deadline',meta:'',next:'',color:'#000'});

describe('weekly routine allocation',()=>{
  it('protects long technical tasks as deep work',()=>expect(taskAllocationKind({title:'Implement Transformer',description:'code model',minutes:180,timeCategory:'Work'})).toBe('deep'));
  it('routes semantic decoding work into its next protected block',()=>{const slot=recommendRoutineSlot({title:'Implement RNN',description:'technical work',minutes:180,timeCategory:'Work'},project('Wang Haiteng MEG Semantic Decoding'),DEFAULT_WEEKLY_ROUTINE,new Date('2026-10-06T12:00:00'));expect(slot?.block.id).toBe('thu-semantic');expect(slot?.date).toBe('2026-10-08')});
  it('routes Patrick reading into the nearest matching focus block',()=>{const slot=recommendRoutineSlot({title:'Read agency papers',description:'literature review',minutes:90,timeCategory:'Study'},project('Patrick Haggard NEUR0002'),DEFAULT_WEEKLY_ROUTINE,new Date('2026-10-06T12:00:00'));expect(slot?.block.id).toBe('sun-reading')});
  it('uses only the requested duration inside a larger block',()=>{const item=DEFAULT_WEEKLY_ROUTINE.blocks.find(block=>block.id==='tue-anika')!;expect(routineTaskEnd(item,30)).toBe('13:30');expect(routineTaskEnd(item,240)).toBe('16:00')});
});
