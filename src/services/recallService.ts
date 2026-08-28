const intervals=[1,3,7,14,30];
export function scheduleRecall(attemptNumber:number,correct:boolean,from=new Date()){const index=Math.max(0,Math.min(intervals.length-1,correct?attemptNumber:0));const date=new Date(from);date.setDate(date.getDate()+intervals[index]);return date.toISOString().slice(0,10);}
export function isRecallDue(nextReview:string,today=new Date().toISOString().slice(0,10)){return nextReview<=today;}
export function recallAccuracy(attempts:Array<{result:'correct'|'incorrect'}>){return attempts.length?Math.round(attempts.filter(item=>item.result==='correct').length/attempts.length*100):0;}
