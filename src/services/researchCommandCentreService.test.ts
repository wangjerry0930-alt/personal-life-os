import { describe, expect, it } from 'vitest';
import { seed } from '../domain/seed';
import { allocateWeeklyPlanTasks, CURRENT_RESEARCH_WEEK_ID, exportResearchStatus, importResearchStatus, INITIAL_RESEARCH_WEEK_ID, integrateInitialResearchCommandCentre, NEXT_RESEARCH_WEEK_ID, updateResearchCheckpoint } from './researchCommandCentreService';

const clean=()=>({...seed,projects:[],tasks:[],researchWeeklyPlans:[]});

describe('Research Command Centre',()=>{
  it('imports the initial portfolio and leaves every weekly deliverable pending',()=>{
    const data=integrateInitialResearchCommandCentre(clean());const plan=data.researchWeeklyPlans?.find(item=>item.id===INITIAL_RESEARCH_WEEK_ID);
    expect(data.projects).toHaveLength(6);expect(plan?.taskIds).toHaveLength(20);expect(data.tasks).toHaveLength(31);expect(data.tasks.every(task=>task.status==='todo')).toBe(true);
    expect(data.projects.find(project=>project.id==='project-google-researcher-2027')?.deadline).toBe('2026-12-13');
    expect(data.tasks.every(task=>Boolean(task.acceptanceCriteria)&&Boolean(task.dueDate))).toBe(true);
  });

  it('is safe to run the initial import repeatedly',()=>{
    const once=integrateInitialResearchCommandCentre(clean());const twice=integrateInitialResearchCommandCentre(once);
    expect(twice.projects).toHaveLength(once.projects.length);expect(twice.tasks).toHaveLength(once.tasks.length);expect(twice.researchWeeklyPlans).toHaveLength(3);
  });

  it('adds the manual RNN and CNN work to the current weekly plan',()=>{
    const data=integrateInitialResearchCommandCentre(clean());const plan=data.researchWeeklyPlans?.find(item=>item.id===CURRENT_RESEARCH_WEEK_ID);const tasks=data.tasks.filter(task=>task.weeklyPlanId===CURRENT_RESEARCH_WEEK_ID&&task.projectId==='project-meg-semantic');
    expect(plan).toMatchObject({startDate:'2026-11-02',endDate:'2026-11-08'});expect(plan?.taskIds).toHaveLength(8);expect(tasks).toHaveLength(5);expect(tasks.reduce((sum,task)=>sum+task.minutes,0)).toBe(360);expect(tasks.every(task=>Boolean(task.firstStep)&&Boolean(task.acceptanceCriteria))).toBe(true);
  });

  it('splits the NEUR0002 presentation work across the meeting and delivery weeks',()=>{
    const data=integrateInitialResearchCommandCentre(clean());const current=data.tasks.filter(task=>task.weeklyPlanId===CURRENT_RESEARCH_WEEK_ID&&task.projectId==='project-neur0002-agency');const next=data.tasks.filter(task=>task.weeklyPlanId===NEXT_RESEARCH_WEEK_ID);
    expect(current.map(task=>task.dueDate)).toEqual(expect.arrayContaining(['2026-11-02','2026-11-04']));expect(current).toHaveLength(3);expect(next).toHaveLength(3);expect(next.map(task=>task.dueDate)).toEqual(['2026-11-09','2026-11-12','2026-11-13']);expect(next.every(task=>task.projectId==='project-neur0002-agency'&&Boolean(task.firstStep))).toBe(true);
  });

  it('exports status and imports updates without duplicating or reverting completed work',()=>{
    const initial=integrateInitialResearchCommandCentre(clean());const firstId=initial.tasks[0].id;const completed={...initial,tasks:initial.tasks.map(task=>task.id===firstId?{...task,status:'done' as const,completedAt:'2026-10-27T12:00:00.000Z'}:task)};const payload=exportResearchStatus(completed,'2026-10-26','2026-11-01');
    expect(payload.schema).toBe('life-os-research-command-centre');expect(payload.tasks.find(task=>task.id===firstId)?.status).toBe('done');
    const stale={...payload,tasks:payload.tasks.map(task=>task.id===firstId?{...task,status:'todo' as const,completedAt:undefined}:task)};const imported=importResearchStatus(completed,stale);
    expect(imported.tasks).toHaveLength(completed.tasks.length);expect(imported.tasks.find(task=>task.id===firstId)?.status).toBe('done');
  });

  it('persists checkpoint notes in the weekly plan',()=>{
    const data=integrateInitialResearchCommandCentre(clean());const updated=updateResearchCheckpoint(data,INITIAL_RESEARCH_WEEK_ID,'thursday','MEG split audit is at risk.');
    expect(updated.researchWeeklyPlans?.[0].checkpoints.thursday).toMatchObject({status:'reviewed',notes:'MEG split audit is at risk.'});
  });

  it('allocates weekly deliverables into daily routine blocks without overlap',()=>{
    const initial=integrateInitialResearchCommandCentre(clean());const unscheduled={...initial,tasks:initial.tasks.map(task=>({...task,scheduledDate:undefined,scheduledStartTime:undefined,scheduledEndTime:undefined}))};const allocated=allocateWeeklyPlanTasks(unscheduled,INITIAL_RESEARCH_WEEK_ID,'2026-10-26');const scheduled=allocated.tasks.filter(task=>task.weeklyPlanId===INITIAL_RESEARCH_WEEK_ID&&task.scheduledDate);
    expect(scheduled).toHaveLength(20);expect(scheduled.every(task=>task.scheduledDate!>='2026-10-26'&&task.scheduledDate!<='2026-11-01')).toBe(true);
    for(const date of new Set(scheduled.map(task=>task.scheduledDate))){const day=scheduled.filter(task=>task.scheduledDate===date).sort((a,b)=>a.scheduledStartTime!.localeCompare(b.scheduledStartTime!));for(let index=1;index<day.length;index++)expect(day[index].scheduledStartTime!.localeCompare(day[index-1].scheduledEndTime!)).toBeGreaterThanOrEqual(0)}
    const repeated=allocateWeeklyPlanTasks(allocated,INITIAL_RESEARCH_WEEK_ID,'2026-10-26');expect(repeated).toBe(allocated);expect(repeated.tasks.map(task=>[task.id,task.scheduledDate,task.scheduledStartTime])).toEqual(allocated.tasks.map(task=>[task.id,task.scheduledDate,task.scheduledStartTime]));
  });
});
