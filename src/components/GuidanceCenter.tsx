import { useEffect, useState } from 'react';
import Icon from './Icon';

const guides = [
  ['Dashboard','从这里快速了解今天的状态。','查看 Today’s progress、学习分钟数、当前和最佳 streak、Active Areas、Skills practiced、今日任务、Focus Areas、最近活动和 Daily Knowledge。点击 Open today 进入任务页，点击 Manage 管理学习方向，点击 See journal 查看复盘。建议每天先从 Dashboard 确认一件最重要的事。','LayoutDashboard'],
  ['Today','把长期目标变成今天可以完成的小动作。','点击任务圆圈完成任务；使用 Add task 手动添加，Generate tasks 自动生成少量任务，Tune difficulty 根据表现调整难度，Regenerate 重新生成。每个任务的三点菜单可以编辑、复制、完成或删除。Focus Timer 用于专注计时，Open daily log 打开当天记录。','Sun'],
  ['Learning Areas','管理长期学习方向。','点击 New learning area 创建方向；三点菜单可以 Edit details、Pause / Resume 和 Delete。编辑窗口可以填写 Description、Priority、Status、Long-term goal、Current focus、Topics、Resources 和 Notes。进度条用于表达长期进展。','Compass'],
  ['Skills','追踪可训练的具体技能。','点击 Add skill 添加技能，填写 Current level、Target level、Current focus、Resources 和 Milestones。练习后点击 +20m 或三点菜单 Record practice；Edit details 可以修改等级和目标。系统会保存 practice count、累计分钟数、最近练习和 progress log。','Sparkles'],
  ['Habits','维护持续进步所需的日常习惯。','创建小而稳定的习惯，例如每天阅读摘要或练习 20 分钟。完成后会更新 streak；重点是保持节奏，不是堆积大量习惯。','Repeat2'],
  ['People','记住重要的人和关系。','点击 Add person 创建人物；头像相机可以上传或移除头像，Add photo 可以保存照片记录。Relationship Engine 可以选择人物并记录 Person Facts、Conversations、Promises、Follow-ups 和 Important Dates。卡片三点菜单可以编辑姓名、备注、兴趣、安排 follow-up、记录互动或删除人物。','Users'],
  ['Projects','把方向变成可交付的项目。','点击 New project 创建项目；Edit project 修改名称和下一步，Add milestone 添加阶段节点，Toggle complete 更新完成状态。Goals 区域可以增加目标、编辑标题、增加 10% 进度、添加里程碑或重置进度。','FolderKanban'],
  ['Knowledge','每天获取值得关注的新信息。','Refresh knowledge 会从 Europe PMC 和 Crossref 获取研究信号。按领域筛选，使用 Saved only、Rated、Save、Mark read、Not interested 和 1–5 星评分管理阅读队列；Open original source 会打开原始链接。','BookOpen'],
  ['Books','把整本书转化成学习路径。','上传 TXT、Markdown 或 PDF 后，打开书籍可查看 Whole-book synthesis、Tier 1–4 概念、source chunks 和 recall questions。Start 15 min、Start 1 hour、Deep learning 会记录学习 session；Add to daily plan 会生成任务；Knowledge map 展示概念关系，Active recall 用 I knew it / Need review 更新复习状态。','LibraryBig'],
  ['Resources','保存值得反复使用的资料。','Add resource 可以保存 Paper、Book、Video、Course、Website、Dataset、Tool、Podcast 或 Note。使用 Inbox、To Read、Reading、Finished、Reference 管理状态；搜索标题、备注和标签，并关联 Learning Area、Skill、Project。','Library'],
  ['Journal','记录每天真正发生的学习。','填写 What did you learn、Biggest progress today、What got in the way、Tomorrow I want to 和 Free notes。完成的任务会自动出现在 Automatically captured；Save today’s log 保存历史，搜索框可以查找日期和反思，点击历史条目查看完整内容。','NotebookPen'],
  ['Analytics','观察长期趋势，而不是只看今天。','查看最近 7 天 Learning time 柱状图、Tasks completed、Active areas、Skill practice、Focus areas 和 Weekly Review。AI Recommendations 根据近期行为生成建议；AI Weekly Review 会保存历史，可随时重新查看。','ChartNoAxesCombined'],
  ['Graph','查看知识之间的连接。','Knowledge Graph 会显示 Learning Areas、Skills、Projects 和 Resources 的节点与连线。要让关系图变丰富，先在 Resources 中把资料关联到方向、技能或项目；当前图谱是帮助理解结构的可视化，不是关系质量评分。','Share2'],
  ['Settings','管理偏好、AI 和数据。','OpenAI API 区域用于保存或移除 API key；AI Recommendations 使用 Supabase Function URL。Guidance Center 可以重新打开本指南；Theme Picker 可以选择 Lavender、Soft mint、Sky blue、Warm peach；Backup Tools 支持 JSON 导出和导入；Supabase cloud sync 支持上传和恢复 workspace；Reset app data 会清除本地数据，请谨慎使用。','Settings'],
] as const;

export default function GuidanceCenter() {
  const [open,setOpen]=useState(false); const [step,setStep]=useState(0);
  useEffect(()=>{const onOpen=()=>{setStep(0);setOpen(true)};window.addEventListener('life-os-open-guide',onOpen);if(!localStorage.getItem('personal-life-os-guidance-seen'))setOpen(true);return()=>window.removeEventListener('life-os-open-guide',onOpen)},[]);
  const close=()=>{setOpen(false);localStorage.setItem('personal-life-os-guidance-seen','1')}; const current=guides[step];
  if(!open)return null;
  return <div className="modal-backdrop guidance-backdrop"><section className="guidance-modal"><div className="guidance-head"><div><span className="pill purple">PERSONAL LIFE OS GUIDE</span><h2>Make the system work for you.</h2><p className="muted">A quick tour of every page and the best way to use it.</p></div><button className="modal-close" onClick={close}>×</button></div><div className="guidance-progress"><i style={{width:`${((step+1)/guides.length)*100}%`}}/></div><div className="guidance-step"><div className="guidance-icon"><Icon name={current[3]} size={24}/></div><div><span className="muted">{step+1} / {guides.length}</span><h3>{current[0]}</h3><b>{current[1]}</b><p>{current[2]}</p></div></div><div className="guidance-dots">{guides.map((guide,index)=><button key={guide[0]} className={index===step?'active':''} aria-label={guide[0]} onClick={()=>setStep(index)}/>)}</div><div className="guidance-actions"><button className="secondary" onClick={close}>Skip tour</button><div><button className="secondary" onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0}>Back</button>{step<guides.length-1?<button className="primary" onClick={()=>setStep(step+1)}>Next <Icon name="ArrowRight" size={15}/></button>:<button className="primary" onClick={close}>Finish guide <Icon name="Check" size={15}/></button>}</div></div></section></div>;
}

export function GuideSettingsCard() { return <section className="settings-card guide-settings-card"><div className="settings-card-head"><div><h3>Guidance Center</h3><p>重新查看每个页面能做什么，以及建议的使用方式。</p></div><Icon name="CircleHelp" size={20}/></div><button className="secondary" onClick={()=>window.dispatchEvent(new Event('life-os-open-guide'))}><Icon name="BookOpen" size={15}/> Open full guide</button></section>; }
