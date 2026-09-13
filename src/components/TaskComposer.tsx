import { useState } from 'react';
import Icon from './Icon';
import { useAppStore } from '../store/useAppStore';
import { localDateKey } from '../domain/date';

const categories = ['Study', 'Work', 'Music', 'Entertainment', 'Exercise', 'Life', 'Other'];

export default function TaskComposer() {
  const { data, setData } = useAppStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState('20');
  const [scheduledDate, setScheduledDate] = useState(localDateKey());
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [priority, setPriority] = useState('Medium');
  const [projectId, setProjectId] = useState('');
  const [timeCategory, setTimeCategory] = useState('Study');
  const [notes, setNotes] = useState('');

  const close = () => setOpen(false);
  const add = () => {
    if (!title.trim()) return;
    setData(current => ({
      ...current,
      tasks: [{
        id: 'task-' + Date.now(),
        title: title.trim(),
        description: 'A manually added next step.',
        minutes: Number(minutes) || 20,
        difficulty,
        priority: priority as any,
        projectId: projectId || undefined,
        scheduledDate: scheduledDate || undefined,
        timeCategory: timeCategory === 'Study' ? undefined : timeCategory,
        notes,
        category: 'Manual',
        status: 'todo',
      }, ...current.tasks],
    }));
    setTitle(''); setNotes(''); setTimeCategory('Study'); setProjectId(''); setScheduledDate(localDateKey()); close();
  };

  return <>
    <button className="secondary" onClick={() => setOpen(true)}><Icon name="Plus" size={16} /> Add task</button>
    {open && <div className="modal-backdrop" onMouseDown={close}>
      <form className="create-modal" onSubmit={event => { event.preventDefault(); add(); }} onMouseDown={event => event.stopPropagation()}>
        <div className="modal-head"><div><span className="pill purple">NEW TASK</span><h2>What is the next small step?</h2></div><button type="button" className="modal-close" onClick={close}>×</button></div>
        <label>Task title<input autoFocus value={title} onChange={event => setTitle(event.target.value)} placeholder="e.g. Read one paper abstract" /></label>
        <label>Estimated minutes<input type="number" min="1" max="480" value={minutes} onChange={event => setMinutes(event.target.value)} /></label>
        <label>Plan for<input type="date" value={scheduledDate} onChange={event => setScheduledDate(event.target.value)} /></label>
        <div className="form-two">
          <label>Priority<select value={priority} onChange={event => setPriority(event.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label>
          <label>Difficulty<select value={difficulty} onChange={event => setDifficulty(event.target.value as typeof difficulty)}><option>Easy</option><option>Medium</option><option>Hard</option></select></label>
        </div>
        <label>Time category<select value={timeCategory} onChange={event => setTimeCategory(event.target.value)}>{categories.map(category => <option key={category}>{category}</option>)}</select></label>
        <label>Project<select value={projectId} onChange={event => setProjectId(event.target.value)}><option value="">No project</option>{(data.projects || []).map(project => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
        <label>Notes<textarea rows={2} value={notes} onChange={event => setNotes(event.target.value)} placeholder="Optional task notes" /></label>
        <div className="modal-actions"><button type="button" className="secondary" onClick={close}>Cancel</button><button className="primary" disabled={!title.trim()}>Create task</button></div>
      </form>
    </div>}
  </>;
}
