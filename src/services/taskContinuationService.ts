import type { Task, TaskContinuation } from '../domain/types';

const SAFE_PROTOCOLS=new Set(['http:','https:','mailto:']);

export function normalizeMaterialUrl(value:string){
  const trimmed=value.trim();
  if(!trimmed)return '';
  try{
    const url=new URL(trimmed);
    return SAFE_PROTOCOLS.has(url.protocol)?url.toString():'';
  }catch{return ''}
}

export function taskStartPrompt(task:Pick<Task,'title'|'firstStep'|'continuation'>){
  const resumed=task.continuation?.nextStep?.trim();
  if(resumed)return{label:'Continue',text:resumed};
  return{label:'First step',text:task.firstStep?.trim()||task.title};
}

export function makeContinuation(input:Omit<TaskContinuation,'updatedAt'>,at=new Date().toISOString()):TaskContinuation|undefined{
  const progress=input.progress?.trim()||undefined;
  const nextStep=input.nextStep?.trim()||undefined;
  const blockerNote=input.blockerNote?.trim()||undefined;
  if(!progress&&!nextStep&&!input.interruptionReason&&!blockerNote)return undefined;
  return{progress,nextStep,interruptionReason:input.interruptionReason,blockerNote,updatedAt:at};
}
