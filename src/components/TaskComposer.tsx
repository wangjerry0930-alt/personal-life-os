import { useMemo, useState } from 'react';
import Icon from './Icon';
import { useAppStore } from '../store/useAppStore';
import { localDateKey } from '../domain/date';
import { startExclusiveTaskTimer } from '../services/taskTimerPersistence';
import { DEFAULT_WEEKLY_ROUTINE, recommendRoutineSlot, routineTaskEnd } from '../domain/weeklyRoutine';

const categories = ['Study', 'Work', 'Music', 'Entertainment', 'Exercise', 'Life', 'Other'];

export default function TaskComposer() {
  const { data, setData } = useAppStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState('20');
  const [scheduledDate, setScheduledDate] = useState(localDateKey());
  const [scheduledStartTime,setScheduledStartTime]=useState('');
  const [scheduledEndTime,setScheduledEndTime]=useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [priority, setPriority] = useState('Medium');
  const [projectId, setProjectId] = useState('');
  const [timeCategory, setTimeCategory] = useState('Study');
  const [notes, setNotes] = useState('');
  const [timerMode, setTimerMode] = useState<'countdown' | 'pomodoro'>('countdown');
  const suggestion=useMemo(()=>title.trim()?recommendRoutineSlot({title,description:notes,minutes:Number(minutes)||20,timeCategory},data.projects.find(project=>project.id===projectId),data.weeklyRoutine||DEFAULT_WEEKLY_ROUTINE):null,[title,notes,minutes,timeCategory,projectId,data.projects,data.weeklyRoutine]);

  const close = () => setOpen(false);
  const add = (startNow = false) => {
    if (!title.trim()) return;
    const task = {
      id: 'task-' + Date.now(),
      title: title.trim(),
      description: 'A manually added next step.',
      minutes: Number(minutes) || 20,
      timerMode,
      difficulty,
      priority: priority as any,
      projectId: projectId || undefined,
      scheduledDate: scheduledDate || undefined,
      scheduledStartTime:scheduledStartTime||undefined,
      scheduledEndTime:scheduledEndTime||undefined,
      timeCategory: timeCategory === 'Study' ? undefined : timeCategory,
      notes,
      category: 'Manual' as const,
      status: 'todo' as const,
    };
    if (startNow) startExclusiveTaskTimer(task.id);
    setData(current => ({
      ...current,
      tasks: [task, ...current.tasks],
    }));
    setTitle(''); setNotes(''); setTimeCategory('Study'); setProjectId(''); setScheduledDate(localDateKey());setScheduledStartTime('');setScheduledEndTime(''); setTimerMode('countdown'); close();
  };

  return <>
    <button className="secondary" onClick={() => setOpen(true)}><Icon name="Plus" size={16} /> Add task</button>
    {open && <div className="modal-backdrop" onMouseDown={close}>
      <form className="create-modal" onSubmit={event => { event.preventDefault(); add(); }} onKeyDown={event=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();add(true)}}} onMouseDown={event => event.stopPropagation()}>
        <div className="modal-head"><div><span className="pill purple">NEW TASK</span><h2>What is the next small step?</h2></div><button type="button" className="modal-close" onClick={close}>×</button></div>
        <label>Task title<input autoFocus value={title} onChange={event => setTitle(event.target.value)} placeholder="e.g. Read one paper abstract" /></label>
        <label>Estimated minutes<input type="number" min="1" max="480" value={minutes} onChange={event => setMinutes(event.target.value)} /></label><div className="duration-presets">{[15,30,60,90].map(value=><button type="button" key={value} className={Number(minutes)===value?'active':''} onClick={()=>setMinutes(String(value))}>{value} min</button>)}</div>
        <div className="task-timer-choice"><button type="button" className={timerMode==='countdown'?'selected':''} onClick={()=>setTimerMode('countdown')}><Icon name="Timer" size={18}/><span><b>Task timer</b><small>Stop at the estimated duration</small></span></button><button type="button" className={timerMode==='pomodoro'?'selected':''} onClick={()=>setTimerMode('pomodoro')}><Icon name="Tomato" size={18}/><span><b>Pomodoro loop</b><small>30 min focus · 5 min break · repeat until stopped</small></span></button></div>
        <label>Plan for<input type="date" value={scheduledDate} onChange={event => setScheduledDate(event.target.value)} /></label>
        <div className="form-two">
          <label>Priority<select value={priority} onChange={event => setPriority(event.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label>
          <label>Difficulty<select value={difficulty} onChange={event => setDifficulty(event.target.value as typeof difficulty)}><option>Easy</option><option>Medium</option><option>Hard</option></select></label>
        </div>
        <label>Time category<select value={timeCategory} onChange={event => setTimeCategory(event.target.value)}>{categories.map(category => <option key={category}>{category}</option>)}</select></label>
        <label>Project<select value={projectId} onChange={event => setProjectId(event.target.value)}><option value="">No project</option>{(data.projects || []).map(project => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
        {suggestion&&<div className="task-allocation-suggestion"><span><b>{suggestion.block.title}</b><small>{suggestion.reason} · {suggestion.date} {suggestion.block.start}–{routineTaskEnd(suggestion.block,Number(minutes)||20)}</small></span><button type="button" className="secondary" onClick={()=>{setScheduledDate(suggestion.date);setScheduledStartTime(suggestion.block.start);setScheduledEndTime(routineTaskEnd(suggestion.block,Number(minutes)||20))}}>Use routine block</button></div>}
        <label>Notes<textarea rows={2} value={notes} onChange={event => setNotes(event.target.value)} placeholder="Optional task notes" /></label>
        <p className="task-create-hint"><kbd>Ctrl</kbd> + <kbd>Enter</kbd> creates and starts immediately</p><div className="modal-actions task-create-actions"><button type="button" className="secondary" onClick={close}>Cancel</button><button type="submit" className="secondary" disabled={!title.trim()}>Create only</button><button type="button" className="primary" disabled={!title.trim()} onClick={()=>add(true)}><Icon name="Play" size={14}/> Create & start</button></div>
      </form>
    </div>}
  </>;
}
