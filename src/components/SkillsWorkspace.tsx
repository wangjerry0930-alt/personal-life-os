import { useMemo, useState } from 'react';
import ActionMenu from './ActionMenu';
import Icon from './Icon';
import SkillEditor from './SkillEditor';
import { localDateKey } from '../domain/date';
import type { Level, Skill } from '../domain/types';
import { useAppStore } from '../store/useAppStore';

const levels: Level[] = ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'];

function SkillCreateModal({ onCancel, onSave }: { onCancel: () => void; onSave: (skill: Skill) => void }) {
  const { data } = useAppStore();
  const [name, setName] = useState('');
  const [focus, setFocus] = useState('');
  const [areaId, setAreaId] = useState('');
  const [target, setTarget] = useState<Level>('Intermediate');
  return <div className="modal-backdrop" onMouseDown={onCancel}><form className="create-modal skill-create-modal" onMouseDown={event => event.stopPropagation()} onSubmit={event => { event.preventDefault(); if (!name.trim()) return; onSave({ id: `skill-${Date.now()}`, name: name.trim(), level: 'Beginner', target, practiceCount: 0, minutes: 0, lastPracticed: 'Not yet', focus: focus.trim() || 'Choose what to practice next', areaId: areaId || undefined, progress: 0 }); }}>
    <div className="modal-head"><div><span className="pill purple">NEW SKILL</span><h2>Choose what to grow</h2></div><button type="button" className="modal-close" onClick={onCancel}>×</button></div>
    <label>Skill name<input autoFocus value={name} onChange={event => setName(event.target.value)} placeholder="e.g. Scientific writing" /></label>
    <label>Next practice focus<input value={focus} onChange={event => setFocus(event.target.value)} placeholder="What will you practice next?" /></label>
    <div className="form-two"><label>Learning area<select value={areaId} onChange={event => setAreaId(event.target.value)}><option value="">No area</option>{data.areas.map(area => <option value={area.id} key={area.id}>{area.name}</option>)}</select></label><label>Target level<select value={target} onChange={event => setTarget(event.target.value as Level)}>{levels.map(level => <option key={level}>{level}</option>)}</select></label></div>
    <div className="modal-actions"><button type="button" className="secondary" onClick={onCancel}>Cancel</button><button className="primary"><Icon name="Plus" size={15} /> Add skill</button></div>
  </form></div>;
}

export default function SkillsWorkspace() {
  const { data, setData, deleteSkill, practiceSkill } = useAppStore();
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('all');
  const [level, setLevel] = useState('all');
  const [sort, setSort] = useState('attention');
  const [visible, setVisible] = useState(12);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [message, setMessage] = useState('');
  const areas = new Map(data.areas.map(item => [item.id, item]));
  const totalMinutes = data.skills.reduce((sum, skill) => sum + skill.minutes, 0);
  const practiced = data.skills.filter(skill => skill.practiceCount > 0).length;
  const needsAttention = data.skills.filter(skill => skill.progress < 35 || skill.lastPracticed === 'Not yet').length;
  const filtered = useMemo(() => data.skills.filter(skill => {
    const text = `${skill.name} ${skill.focus} ${areas.get(skill.areaId || '')?.name || ''}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) && (area === 'all' || skill.areaId === area) && (level === 'all' || skill.level === level);
  }).sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'progress' ? b.progress - a.progress : sort === 'recent' ? b.lastPracticed.localeCompare(a.lastPracticed) : a.progress - b.progress), [data.skills, query, area, level, sort]);
  const addToToday = (skill: Skill) => {
    const today = localDateKey();
    const exists = data.tasks.some(task => task.skillId === skill.id && task.status !== 'done' && (!task.scheduledDate || task.scheduledDate === today));
    if (exists) { setMessage(`${skill.name} is already in Today.`); return; }
    setData(current => ({ ...current, tasks: [{ id: `skill-task-${Date.now()}`, title: `Practice ${skill.name}`, description: skill.focus, minutes: 20, difficulty: 'Easy', category: 'Manual', timeCategory: 'Study', skillId: skill.id, scheduledDate: today, priority: 'Medium', status: 'todo' }, ...current.tasks] }));
    setMessage(`Added a 20-minute ${skill.name} session to Today.`);
  };
  const remove = (skill: Skill) => { if (window.confirm(`Delete “${skill.name}”? This cannot be undone.`)) deleteSkill(skill.id); };
  return <div className="content skills-workspace">
    <section className="skills-hero"><div><span className="pill purple">SKILL WORKSPACE</span><h2>Turn a long skill list into a practice plan.</h2><p>Find the skill that needs attention, define the next move, and record the work while it is fresh.</p></div><button className="primary" onClick={() => setCreating(true)}><Icon name="Plus" size={16} /> Add skill</button></section>
    <div className="skills-summary"><div><span>Total skills</span><b>{data.skills.length}</b><small>across {new Set(data.skills.map(skill => skill.areaId).filter(Boolean)).size || data.areas.length} areas</small></div><div><span>Practiced</span><b>{practiced}</b><small>{data.skills.length ? Math.round(practiced / data.skills.length * 100) : 0}% have evidence</small></div><div><span>Practice time</span><b>{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</b><small>all recorded sessions</small></div><div className="attention"><span>Needs attention</span><b>{needsAttention}</b><small>low progress or not started</small></div></div>
    <section className="skills-control-panel"><div className="skills-search"><Icon name="Search" size={17} /><input value={query} onChange={event => { setQuery(event.target.value); setVisible(12); }} placeholder="Search skills, focus or learning area…" /></div><select value={area} onChange={event => { setArea(event.target.value); setVisible(12); }}><option value="all">All areas</option>{data.areas.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select value={level} onChange={event => { setLevel(event.target.value); setVisible(12); }}><option value="all">All levels</option>{levels.map(item => <option key={item}>{item}</option>)}</select><select value={sort} onChange={event => setSort(event.target.value)}><option value="attention">Needs attention</option><option value="recent">Recently active</option><option value="progress">Highest progress</option><option value="name">Name A–Z</option></select></section>
    <div className="skills-results-head"><div><h3>Your skills</h3><span>{filtered.length} result{filtered.length === 1 ? '' : 's'}</span></div>{(query || area !== 'all' || level !== 'all') && <button className="text-button" onClick={() => { setQuery(''); setArea('all'); setLevel('all'); }}>Clear filters</button>}</div>
    {message && <div className="skills-message"><Icon name="CheckCircle2" size={16} />{message}<button onClick={() => setMessage('')}>×</button></div>}
    <div className="skills-card-grid">{filtered.slice(0, visible).map(skill => { const skillArea = areas.get(skill.areaId || ''); return <article className="skill-work-card" key={skill.id}>
      <div className="skill-card-top"><div className="skill-card-mark" style={{ background: skillArea?.color || 'var(--accent)' }}>{skill.name.slice(0, 1).toUpperCase()}</div><div className="grow"><div className="skill-card-title"><h3>{skill.name}</h3><ActionMenu items={[{ label: 'Record 20 min practice', onClick: () => practiceSkill(skill.id, 20) }, { label: 'Add practice to Today', onClick: () => addToToday(skill) }, { label: 'Edit details', onClick: () => setEditing(skill) }, { label: 'Delete skill', danger: true, onClick: () => remove(skill) }]} /></div><span className="skill-area-label">{skillArea?.name || 'Independent skill'}</span></div></div>
      <p className="skill-card-focus">{skill.focus || 'Choose what to practice next.'}</p>
      <div className="skill-level-line"><span>{skill.level}</span><Icon name="ArrowRight" size={14} /><b>{skill.target}</b></div>
      <div className="skill-card-progress"><div><span>Progress</span><b>{skill.progress}%</b></div><div className="progress"><i style={{ width: `${skill.progress}%`, background: skillArea?.color }} /></div></div>
      <div className="skill-card-evidence"><span><Icon name="Repeat2" size={14} /><b>{skill.practiceCount}</b> sessions</span><span><Icon name="Clock3" size={14} /><b>{skill.minutes}</b> min</span><span><Icon name="CalendarDays" size={14} />{skill.lastPracticed}</span></div>
      <div className="skill-card-actions"><button className="primary" onClick={() => { practiceSkill(skill.id, 20); setMessage(`Recorded 20 minutes for ${skill.name}.`); }}><Icon name="Timer" size={15} /> Practice +20m</button><button className="secondary" onClick={() => addToToday(skill)}><Icon name="Sun" size={15} /> Today</button></div>
    </article>; })}</div>
    {!filtered.length && <div className="skills-empty"><Icon name="SearchX" size={28} /><h3>No skills match these filters</h3><p>Try another search or clear the filters to see the full library.</p><button className="secondary" onClick={() => { setQuery(''); setArea('all'); setLevel('all'); }}>Show all skills</button></div>}
    {visible < filtered.length && <button className="skills-show-more" onClick={() => setVisible(value => value + 12)}>Show 12 more <span>{filtered.length - visible} remaining</span></button>}
    {creating && <SkillCreateModal onCancel={() => setCreating(false)} onSave={skill => { setData(current => ({ ...current, skills: [skill, ...current.skills] })); setCreating(false); setMessage(`${skill.name} was added.`); }} />}
    {editing && <SkillEditor skill={editing} onCancel={() => setEditing(null)} onSave={skill => { setData(current => ({ ...current, skills: current.skills.map(item => item.id === skill.id ? skill : item) })); setEditing(null); setMessage(`${skill.name} was updated.`); }} />}
  </div>;
}
