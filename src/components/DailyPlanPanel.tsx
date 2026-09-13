import { useState } from 'react';
import { localDateKey } from '../domain/date';

type Plan = { priorities: string[]; notes: string };
const key = 'personal-life-os-daily-plan-v1';
const read = (date: string): Plan => { try { const all = JSON.parse(localStorage.getItem(key) || '{}'); return all[date] || { priorities: ['', '', ''], notes: '' }; } catch { return { priorities: ['', '', ''], notes: '' }; } };

export default function DailyPlanPanel() {
  const date = localDateKey(); const [plan, setPlan] = useState<Plan>(() => read(date)); const [saved, setSaved] = useState(false);
  const save = (next: Plan) => { setPlan(next); try { const all = JSON.parse(localStorage.getItem(key) || '{}'); all[date] = next; localStorage.setItem(key, JSON.stringify(all)); } catch {} setSaved(true); window.setTimeout(() => setSaved(false), 1400); };
  return <section className="daily-plan-panel"><div className="daily-plan-head"><div><span className="pill purple">TODAY’S PLAN</span><h3>Write the day before it writes you.</h3><p className="muted">Choose the three things that matter most today.</p></div><span className="daily-plan-date">{date}</span></div><div className="daily-plan-priorities">{plan.priorities.map((value, index) => <label key={index}><span>{index + 1}</span><input value={value} onChange={event => { const priorities = [...plan.priorities]; priorities[index] = event.target.value; save({ ...plan, priorities }); }} placeholder={index === 0 ? 'The hardest important task' : 'Another meaningful priority'} /></label>)}</div><textarea value={plan.notes} onChange={event => save({ ...plan, notes: event.target.value })} placeholder="Schedule, appointments, ideas or anything else for today..." rows={3} /><small className="daily-plan-status">{saved ? 'Saved' : 'Saved automatically as you edit'}</small></section>;
}
