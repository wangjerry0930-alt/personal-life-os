export type Level='Beginner'|'Basic'|'Intermediate'|'Advanced'|'Expert';export type Priority='Low'|'Medium'|'High';export type TaskStatus='todo'|'done';
export interface LearningArea{id:string;name:string;description:string;priority:Priority;status:'Active'|'Paused';progress:number;focus:string;topics:string[];color:string;longTermGoal?:string;resources?:string[];notes?:string}
export interface Skill{id:string;name:string;level:Level;target:Level;practiceCount:number;minutes:number;lastPracticed:string;focus:string;areaId?:string;progress:number;resources?:string[];milestones?:string[];progressLog?:Array<{date:string;minutes:number;note:string}>}
export interface Task{id:string;title:string;description:string;minutes:number;difficulty:'Easy'|'Medium'|'Hard';category:'Daily progress'|'Habit'|'Manual';areaId?:string;skillId?:string;projectId?:string;bookId?:string;conceptId?:string;goalId?:string;priority?:Priority;notes?:string;status:TaskStatus;completedAt?:string}
export interface Habit{id:string;name:string;frequency:string;target:string;streak:number;best:number;checked:boolean;areaId?:string;skillId?:string}
export interface Activity{id:string;label:string;type:string;time:string;meta?:string}
export interface DailyLog{date:string;learned:string;progress:string;problems:string;tomorrow:string;notes:string;minutes:number}
export interface KnowledgeItem{id:string;title:string;source:string;publishedAt:string;field:string;summary:string;whyItMatters:string;url:string;authors?:string[];tags?:string[];rating?:number;read?:boolean;saved?:boolean}
export interface Project{id:string;name:string;type:string;status:'Planning'|'In progress'|'Completed';progress:number;deadline:string;meta:string;next:string;color:string;notes?:string;milestones?:string[]}
export interface Goal{id:string;title:string;period:string;progress:number;detail:string;milestones?:string[]}
export type ResourceType='Paper'|'Book'|'Video'|'Course'|'Website'|'Dataset'|'Tool'|'Podcast'|'Note';
export type ResourceStatus='Inbox'|'To Read'|'Reading'|'Finished'|'Reference';
export interface ResourceItem{id:string;title:string;type:ResourceType;status:ResourceStatus;url:string;notes:string;tags:string[];areaId?:string;skillId?:string;projectId?:string;createdAt:string}
export interface AppData{areas:LearningArea[];skills:Skill[];tasks:Task[];habits:Habit[];activities:Activity[];knowledge:KnowledgeItem[];projects:Project[];goals:Goal[];log:DailyLog}
export interface BaseEntity{id:string;createdAt:string;updatedAt:string;deletedAt?:string}
export type ActivityType='TaskCompleted'|'SkillPractice'|'HabitCompleted'|'LearningSession'|'BookLearning'|'PaperRead'|'Interaction'|'Conversation'|'Meeting'|'ProjectWork'|'KnowledgeRead'|'JournalEntry'|'Custom';
export interface ActivityEntity extends BaseEntity{id:string;type:ActivityType;title:string;description?:string;occurredAt:string;durationMinutes?:number;source?:string;metadata?:Record<string,unknown>;relations?:EntityRelation[]}
export interface HabitLog extends BaseEntity{habitId:string;date:string;completed:boolean;value?:number}
export interface TaskCompletion extends BaseEntity{taskId:string;completedAt:string;durationMinutes?:number;source?:string}
export type EntityType='LearningArea'|'Skill'|'Task'|'Habit'|'Project'|'Goal'|'Person'|'Book'|'Concept'|'Resource'|'KnowledgeItem'|'Activity'|'Location'|'Organisation';
export interface EntityRelation extends BaseEntity{sourceType:EntityType;sourceId:string;relationType:string;targetType:EntityType;targetId:string;metadata?:Record<string,unknown>}
export interface RepositorySnapshot{schemaVersion:5;data:AppData;activities:ActivityEntity[];habitLogs:HabitLog[];taskCompletions:TaskCompletion[];relations:EntityRelation[];legacy?:Record<string,unknown>;updatedAt:string}
