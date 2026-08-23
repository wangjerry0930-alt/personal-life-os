export type Level='Beginner'|'Basic'|'Intermediate'|'Advanced'|'Expert';export type Priority='Low'|'Medium'|'High';export type TaskStatus='todo'|'done';
export interface LearningArea{id:string;name:string;description:string;priority:Priority;status:'Active'|'Paused';progress:number;focus:string;topics:string[];color:string}
export interface Skill{id:string;name:string;level:Level;target:Level;practiceCount:number;minutes:number;lastPracticed:string;focus:string;areaId?:string;progress:number}
export interface Task{id:string;title:string;description:string;minutes:number;difficulty:'Easy'|'Medium'|'Hard';category:'Daily progress'|'Habit'|'Manual';areaId?:string;skillId?:string;status:TaskStatus;completedAt?:string}
export interface Habit{id:string;name:string;frequency:string;target:string;streak:number;best:number;checked:boolean;areaId?:string;skillId?:string}
export interface Activity{id:string;label:string;type:string;time:string;meta?:string}
export interface DailyLog{date:string;learned:string;progress:string;problems:string;tomorrow:string;notes:string;minutes:number}
export interface AppData{areas:LearningArea[];skills:Skill[];tasks:Task[];habits:Habit[];activities:Activity[];log:DailyLog}
