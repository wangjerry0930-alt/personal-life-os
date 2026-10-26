import { localDateKey } from '../domain/date';
import { todayTaskBucket } from '../domain/taskVisibility';
import { useAppStore } from '../store/useAppStore';
import PersistentTaskRow from './PersistentTaskRow';
import './TodayTaskOverflow.css';
export default function TodayTaskOverflow(){const{data,toggleTask,setData}=useAppStore(),today=localDateKey();const groups=[{key:'overdue',title:'Overdue',hint:'Past scheduled date'},{key:'unscheduled',title:'Unscheduled',hint:'Not part of today until scheduled'},{key:'completed',title:'Completed today',hint:'Finished today'}] as const;return <section className="today-task-overflow">{groups.map(group=>{const tasks=data.tasks.filter(task=>todayTaskBucket(task,today)===group.key);return <details key={group.key}><summary><span><b>{group.title}</b><small>{group.hint}</small></span><em>{tasks.length}</em></summary>{tasks.length?<div className="task-list">{tasks.map(task=><PersistentTaskRow key={task.id} task={task} toggle={()=>toggleTask(task.id)} onDelete={id=>setData(current=>({...current,tasks:current.tasks.filter(item=>item.id!==id)}))}/>)}</div>:<p>Nothing here.</p>}</details>})}</section>}
