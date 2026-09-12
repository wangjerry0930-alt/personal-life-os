import { useState } from 'react';
import CourseTaskTemplates from './CourseTaskTemplates';
import UpcomingCourseTasks from './UpcomingCourseTasks';
import { useAppStore } from '../store/useAppStore';

export default function UniCoursePage() {
  const { data, toggleTask } = useAppStore();
  const courses = Array.from(new Set(data.tasks.filter(task => task.notes?.startsWith('Course:')).map(task => task.notes?.split(' · ')[1] || 'Course')));
  const [files, setFiles] = useState<Record<string, { name: string; size: number; type: string; dataUrl: string }>>(() => { try { return JSON.parse(localStorage.getItem('personal-life-os-course-files-v1') || '{}'); } catch { return {}; } });
  const saveFiles = (next: typeof files) => { setFiles(next); localStorage.setItem('personal-life-os-course-files-v1', JSON.stringify(next)); };
  const upload = (course: string, file: File) => { const reader = new FileReader(); reader.onload = () => saveFiles({ ...files, [course]: { name: file.name, size: file.size, type: file.type, dataUrl: String(reader.result) } }); reader.readAsDataURL(file); };
  const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return <div className="content uni-course-page">
    <div className="uni-course-page-header"><div><span className="pill purple">UNI COURSE</span><h2>Turn university courses into a steady rhythm.</h2><p className="muted">Plan preview, study, review, assignment and exam work in one focused place.</p></div><span className="uni-course-count">{courses.length} course{courses.length === 1 ? '' : 's'}</span></div>
    <CourseTaskTemplates />
    <section className="course-materials"><div className="section-title"><div><span className="pill teal">COURSE MATERIALS</span><h3>Slides and lecture files</h3><span className="muted">Upload one current PPT/PPTX deck per course.</span></div></div>{courses.length ? <div className="course-material-grid">{courses.map(course => { const file = files[course]; return <article className="course-material-card" key={course}><div><b>{course}</b>{file ? <small>{file.name} · {formatSize(file.size)}</small> : <small className="muted">No slide deck uploaded</small>}</div><div className="course-material-actions">{file && <a className="secondary" href={file.dataUrl} download={file.name}>Download</a>}<label className="secondary upload-button">{file ? 'Replace' : 'Upload PPT'}<input type="file" accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" onChange={event => { const selected = event.target.files?.[0]; if (selected) upload(course, selected); event.currentTarget.value = ''; }}/></label>{file && <button className="secondary danger-action" onClick={() => { if (window.confirm(`Delete ${file.name}?`)) { const next = { ...files }; delete next[course]; saveFiles(next); } }}>Delete</button>}</div></article>; })}</div> : <p className="muted">Create a course plan first, then its lecture materials will appear here.</p>}</section>
    <UpcomingCourseTasks toggleTask={toggleTask} />
  </div>;
}
