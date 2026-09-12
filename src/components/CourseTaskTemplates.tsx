import { useMemo, useState } from 'react';
import Icon from './Icon';
import { useAppStore } from '../store/useAppStore';
import { addLocalDays, localDateKey } from '../domain/date';

const templates = { Preview: ['Read the assigned chapter', 'Write 3 questions before class'], Study: ['Review lecture notes', 'Create a one-page concept summary'], Review: ['Recall the key concepts from memory', 'Complete practice questions'], Assignment: ['Break the assignment into the next small step', 'Review requirements and submit a draft'], Exam: ['Build a topic checklist', 'Do a timed practice set'] } as const;
type Kind = keyof typeof templates;
const reviewOffsets = [0, 1, 2, 4, 7, 14, 28];

export default function CourseTaskTemplates() {
  const { data, setData } = useAppStore();
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState('');
  const [kind, setKind] = useState<Kind>('Preview');
  const [topic, setTopic] = useState('');
  const [minutes, setMinutes] = useState('30');
  const [custom, setCustom] = useState('');
  const [areaId, setAreaId] = useState('');
  const [skillId, setSkillId] = useState('');
  const [date, setDate] = useState(localDateKey());
  const [customMode, setCustomMode] = useState(false);
  const [reviewPlan, setReviewPlan] = useState(true);
  const selectedTitle = customMode ? custom : (custom || templates[kind][0]);
  const plannedOffsets = reviewPlan ? reviewOffsets : [0];
  const previewDates = useMemo(() => plannedOffsets.map(offset => localDateKey(addLocalDays(new Date(`${date}T12:00:00`), offset))), [date, reviewPlan]);
  const add = (title: string) => {
    if (!course.trim() || !title.trim()) return;
    const tasks = plannedOffsets.map((offset, index) => ({
      id: `course-task-${Date.now()}-${index}`,
      title: `${index === 0 ? '' : 'Review · '}${course.trim()}: ${title.trim()}`,
      description: `${topic.trim() ? `Topic: ${topic.trim()} · ` : ''}${index === 0 ? 'Course task' : `Spaced review after ${offset} days`}`,
      minutes: Number(minutes) || 30,
      difficulty: 'Medium' as const,
      priority: 'High' as const,
      category: 'Manual' as const,
      areaId: areaId || undefined,
      skillId: skillId || undefined,
      scheduledDate: previewDates[index],
      status: 'todo' as const,
      notes: `Course: ${course.trim()} · ${kind}${index === 0 ? '' : ` · Review ${offset}d`}`,
    }));
    setData(current => ({ ...current, tasks: [...tasks, ...current.tasks] }));
    setCustom(''); setCustomMode(false); setOpen(false);
  };
  return <>
    <button className="secondary" onClick={() => setOpen(true)}><Icon name="GraduationCap" size={16}/> Course task</button>
    {open && <div className="modal-backdrop" onMouseDown={() => setOpen(false)}><form className="create-modal" onSubmit={event => { event.preventDefault(); add(selectedTitle); }} onMouseDown={event => event.stopPropagation()}>
      <div className="modal-head"><div><span className="pill purple">COURSE TASK</span><h2>Add a university study task</h2></div><button type="button" className="modal-close" onClick={() => setOpen(false)}>×</button></div>
      <label>Course name<input autoFocus value={course} onChange={event => setCourse(event.target.value)} placeholder="e.g. Cognitive Neuroscience"/></label>
      <div className="form-two"><label>Task type<select value={kind} onChange={event => { setKind(event.target.value as Kind); setCustom(''); setCustomMode(false); }}>{Object.keys(templates).map(item => <option key={item}>{item}</option>)}</select></label><label>Minutes<input type="number" min="5" max="480" value={minutes} onChange={event => setMinutes(event.target.value)}/></label></div>
      <div className="form-two"><label>Learning Area<select value={areaId} onChange={event => setAreaId(event.target.value)}><option value="">No area</option>{data.areas.map(area => <option key={area.id} value={area.id}>{area.name}</option>)}</select></label><label>Skill<select value={skillId} onChange={event => setSkillId(event.target.value)}><option value="">No skill</option>{data.skills.map(skill => <option key={skill.id} value={skill.id}>{skill.name}</option>)}</select></label></div>
      <label>Planned date<input type="date" value={date} onChange={event => setDate(event.target.value)}/></label><label>Topic / week<input value={topic} onChange={event => setTopic(event.target.value)} placeholder="e.g. Week 4 · decision making"/></label>
      <label className="check-label"><input type="checkbox" checked={reviewPlan} onChange={event => setReviewPlan(event.target.checked)}/> Create review tasks at 1, 2, 4, 7, 14 and 28 days</label>
      <label>Task template<select value={customMode ? '__custom__' : selectedTitle} onChange={event => { const value = event.target.value; setCustomMode(value === '__custom__'); setCustom(value === '__custom__' ? '' : value); }}>{templates[kind].map(item => <option key={item}>{item}</option>)}<option value="__custom__">Custom task…</option></select></label>
      {customMode && <label>Custom task<input value={custom} onChange={event => setCustom(event.target.value)} placeholder="What do you need to do?"/></label>}
      <div className="course-plan-preview"><b>{plannedOffsets.length} tasks will be created</b><span>{previewDates.join(' · ')}</span></div>
      <div className="modal-actions"><button type="button" className="secondary" onClick={() => setOpen(false)}>Cancel</button><button className="primary" disabled={!course.trim() || !selectedTitle.trim()}>Add course plan</button></div>
    </form></div>}
  </>;
}
