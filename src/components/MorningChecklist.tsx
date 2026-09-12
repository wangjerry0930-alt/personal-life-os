import { useMemo, useState } from 'react';
import { localDateKey } from '../domain/date';

const defaultItems = [
  '睡前不在床上玩手机，把手机放在够不到的位置',
  '起床默念 321，快速铺好床铺',
  '用闹钟代替手机闹铃',
  '10 分钟以内运动',
  '洗澡：热水淋浴＋冷水 90 秒',
  '喝水、维生素和鱼油',
  '带一杯咖啡到室外，写下一天计划',
  '看书 15 分钟',
  '冥想 3 分钟',
  '开始完成最困难的工作',
];
const key = 'personal-life-os-morning-checklist-v1';

type Stored = { date: string; checked: boolean[]; completedDates: string[] };
const read = (): Stored => { try { const value = JSON.parse(localStorage.getItem(key) || 'null'); if (value?.date && Array.isArray(value.checked)) return value; } catch {} return { date: localDateKey(), checked: defaultItems.map(() => false), completedDates: [] }; };

export default function MorningChecklist() {
  const [stored, setStored] = useState<Stored>(() => read());
  const today = localDateKey();
  const current = stored.date === today ? stored : { ...stored, date: today, checked: defaultItems.map(() => false) };
  const done = current.checked.filter(Boolean).length;
  const streak = useMemo(() => { let count = 0; const dates = new Set(current.completedDates); const cursor = new Date(`${today}T12:00:00`); while (dates.has(localDateKey(cursor))) { count += 1; cursor.setDate(cursor.getDate() - 1); } return count; }, [current.completedDates, today]);
  const update = (checked: boolean[]) => { const complete = checked.every(Boolean); const completedDates = complete && !current.completedDates.includes(today) ? [today, ...current.completedDates].slice(0, 365) : current.completedDates.filter(date => date !== today); const next = { date: today, checked, completedDates }; setStored(next); localStorage.setItem(key, JSON.stringify(next)); };
  return <section className="morning-checklist"><div className="morning-head"><div><span className="pill teal">MORNING CHECKLIST</span><h3>Start the day on purpose.</h3><p className="muted">{done}/{defaultItems.length} complete · {streak} day streak</p></div><strong>{Math.round(done / defaultItems.length * 100)}%</strong></div><div className="morning-progress"><i style={{ width: `${done / defaultItems.length * 100}%` }} /></div><div className="morning-items">{defaultItems.map((item, index) => <label className={current.checked[index] ? 'morning-item checked' : 'morning-item'} key={item}><input type="checkbox" checked={Boolean(current.checked[index])} onChange={event => { const next = [...current.checked]; next[index] = event.target.checked; update(next); }} /><span>{index + 1}</span><b>{item}</b></label>)}</div><button className="secondary" onClick={() => update(defaultItems.map(() => false))}>Reset today</button></section>;
}
