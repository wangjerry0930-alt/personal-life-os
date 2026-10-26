import { describe, expect, it } from 'vitest';
import { seed } from './seed';
import { ensureStudyContinuityTasks } from './studyContinuityTasks';

const projects=[
  {id:'meg',name:'Wang Haiteng / Ray Dolan Lab — MEG Semantic Decoding',type:'Research project',status:'In progress' as const,progress:0,deadline:'No deadline',meta:'',next:'',color:'#000'},
  {id:'patrick',name:'Patrick Haggard + Chunlin — NEUR0002 Literature Review',type:'Research project',status:'In progress' as const,progress:0,deadline:'No deadline',meta:'',next:'',color:'#000'},
  {id:'maze',name:'Zhou Xiaoyu — Maze Reconstruction Project',type:'Research project',status:'In progress' as const,progress:0,deadline:'No deadline',meta:'',next:'',color:'#000'},
  {id:'anika',name:'Anika Bolt — Metacognition Experiment',type:'Research project',status:'In progress' as const,progress:0,deadline:'No deadline',meta:'',next:'',color:'#000'},
  {id:'tal',name:'Tal Nahari + Denis Lan — Boredom × Agency',type:'Research project',status:'In progress' as const,progress:0,deadline:'No deadline',meta:'',next:'',color:'#000'},
];

describe('study continuity tasks',()=>{
  it('adds concrete lecture and project tasks with project links',()=>{
    const result=ensureStudyContinuityTasks({...seed,tasks:[],projects});
    expect(result.tasks).toHaveLength(6);
    expect(result.tasks.find(task=>task.id==='profile-task-daily-lecture-recall')?.minutes).toBe(25);
    expect(result.tasks.find(task=>task.id==='profile-task-meg-baseline-step')?.projectId).toBe('meg');
    expect(result.tasks.find(task=>task.id==='profile-task-patrick-paper')?.projectId).toBe('patrick');
    expect(result.tasks.find(task=>task.id==='profile-task-maze-step')?.projectId).toBe('maze');
  });

  it('does not duplicate starter tasks',()=>{
    const once=ensureStudyContinuityTasks({...seed,tasks:[],projects});
    expect(ensureStudyContinuityTasks(once).tasks).toHaveLength(6);
  });
});
