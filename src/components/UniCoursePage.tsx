import CourseTaskTemplates from './CourseTaskTemplates';
import UpcomingCourseTasks from './UpcomingCourseTasks';
import { useAppStore } from '../store/useAppStore';

export default function UniCoursePage() {
  const { data, toggleTask } = useAppStore();
  const courses = Array.from(new Set(data.tasks.filter(task => task.notes?.startsWith('Course:')).map(task => task.notes?.split(' · ')[1] || 'Course')));
  return <div className="content uni-course-page">
    <div className="uni-course-page-header"><div><span className="pill purple">UNI COURSE</span><h2>Turn university courses into a steady rhythm.</h2><p className="muted">Plan preview, study, review, assignment and exam work in one focused place.</p></div><span className="uni-course-count">{courses.length} course{courses.length === 1 ? '' : 's'}</span></div>
    <CourseTaskTemplates />
    <UpcomingCourseTasks toggleTask={toggleTask} />
  </div>;
}
