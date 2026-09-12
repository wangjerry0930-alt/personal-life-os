import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { localDateKey, addLocalDays } from '../domain/date';

export default function UpcomingCourseTasks({ toggleTask }: { toggleTask: (id: string) => void }) {
  const { data } = useAppStore();
  const [windowDays, setWindowDays] = useState(7);
  const today = localDateKey();
  const end = localDateKey(addLocalDays(new Date(), windowDays));
  const tasks = data.tasks.filter(task => task.scheduledDate && task.scheduledDate > today && task.scheduledDate <= end && task.notes?.startsWith('Course:')).sort((a, b) => (a.scheduledDate || '').localeCompare(b.scheduledDate || ''));
  return <section className="upcoming-course-tasks"><div className="section-title upcoming-course-controls"><div><h3>Upcoming course tasks</h3><span className="muted">Next {windowDays} days · {tasks.length}</span></div><div className="upcoming-course-range" aria-label="Upcoming task window"><button className={windowDays === 7 ? 'active' : ''} onClick={() => setWindowDays(7)}>7 days</button><button className={windowDays === 30 ? 'active' : ''} onClick={() => setWindowDays(30)}>30 days</button></div></div>{tasks.length ? <div className="upcoming-course-list">{tasks.map(task => <div className="upcoming-course-row" key={task.id}><div><b>{task.title}</b><small>{task.scheduledDate} · {task.minutes} min · {task.category}</small></div><button className={'check ' + (task.status === 'done' ? 'checked' : '')} onClick={() => toggleTask(task.id)} aria-label={task.status === 'done' ? 'Mark incomplete' : 'Mark complete'}>{task.status === 'done' ? '✓' : '○'}</button><span>{task.status === 'done' ? 'Done' : 'Planned'}</span></div>)}</div> : <p className="muted">No upcoming course tasks in this window.</p>}</section>;
}
