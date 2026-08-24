import { useState } from 'react';
import Icon from './Icon';
import { useAppStore } from '../store/useAppStore';

export default function TaskComposer() {
  const { setData } = useAppStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState('20');
  const [difficulty, setDifficulty] = useState<'Easy'|'Medium'|'Hard'>('Easy');
  const add = () => { if (!title.trim()) return; setData(d => ({ ...d, tasks: [{ id: 'task-' + Date.now(), title: title.trim(), description: 'A manually added next step.', minutes: Number(minutes) || 20, difficulty, category: 'Manual', status: 'todo' }, ...d.tasks] })); setTitle(''); setOpen(false); };
  return <><button className="secondary" onClick={() => setOpen(true)}><Icon name="Plus" size={16}/> Add task</button>{open&&<div className="modal-backdrop" onMouseDown={() => setOpen(false)}><form className="create-modal" onSubmit={event => { event.preventDefault(); add(); }} onMouseDown={event => event.stopPropagation()}><div className="modal-head"><div><span className="pill purple">NEW TASK</span><h2>What is the next small step?</h2></div><button type="button" className="modal-close" onClick={() => setOpen(false)}>×</button></div><label>Task title<input autoFocus value={title} onChange={event => setTitle(event.target.value)} placeholder="e.g. Read one paper abstract"/></label><label>Estimated minutes<input type="number" min="1" max="480" value={minutes} onChange={event => setMinutes(event.target.value)}/></label><label>Difficulty<select value={difficulty} onChange={event => setDifficulty(event.target.value as typeof difficulty)}><option>Easy</option><option>Medium</option><option>Hard</option></select></label><div className="modal-actions"><button type="button" className="secondary" onClick={() => setOpen(false)}>Cancel</button><button className="primary" disabled={!title.trim()}>Create task</button></div></form></div>}</>;
}
