import { useState } from 'react';
import { localDateKey } from '../domain/date';

type Plan = { priorities: string[]; notes: string };
const key = 'personal-life-os-daily-plan-v1';
const read = (date: string): Plan => { try { const all = JSON.parse(localStorage.getItem(key) || '{}'); return all[date] || { priorities: ['', '', ''], notes: '' }; } catch { return { priorities: ['', '', ''], notes: '' }; } };

export default function DailyPlanPanel() {
  const date = localDateKey(); const [plan, setPlan] = useState<Plan>(() => read(date)); const [saved, setSaved] = useState(false);
  const save = (next: Plan) => { setPlan(next); try { const all = JSON.parse(localStorage.getItem(key) || '{}'); all[date] = next; localStorage.setItem(key, JSON.stringify(all)); } catch {} setSaved(true); window.setTimeout(() => setSaved(false), 1400); };
  return <section className="daily-plan-panel"><div className="daily-plan-head"><div><span className="pill purple">TODAY’S PLAN</span><h3>Write out your whole day.</h3><p className="muted">Add as many plans, steps and notes as you need.</p></div><span className="daily-plan-date">{date}</span></div><div className="daily-plan-priorities">{plan.priorities.map((value, index) => <label key={index}><span>{index + 1}</span><input value={value} onChange={event => { const priorities = [...plan.priorities]; priorities[index] = event.target.value; save({ ...plan, priorities }); }} placeholder={`Plan item ${index + 1} (optional)`} /></label>)}</div><label className="daily-plan-notes-label">All plans and notes<textarea value={plan.notes} onChange={event => save({ ...plan, notes: event.target.value })} placeholder="Write as much as you like: schedule, errands, study, exercise, reminders..." rows={8} /></label><small className="daily-plan-status">{saved ? 'Saved' : 'Saved automatically as you edit'}</small></section>;
}
