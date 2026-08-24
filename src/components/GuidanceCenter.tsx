import { useEffect, useState } from 'react';
import Icon from './Icon';

const guides = [
  ['Dashboard','从这里快速了解今天的状态。','查看今日任务、学习时间、当前 streak、重点 Learning Areas、最近活动和 Daily Knowledge。建议每天打开一次，先确认今天最重要的一步。','LayoutDashboard'],
  ['Today','把长期目标变成今天可以完成的小动作。','完成或新增 Daily Progress Tasks，使用 Generate、Tune difficulty、Regenerate 调整任务；可以启动 Focus Timer，并打开 Daily Log 记录当天学习。','Sun'],
  ['Learning Areas','管理长期学习方向。','创建 Neuroscience、BCI、AI 等方向，填写长期目标、当前重点、主题、资源和备注。建议只保留真正长期投入的方向。','Compass'],
  ['Skills','追踪可训练的具体技能。','添加 Python、Statistics、Scientific Writing 等技能，设置当前水平和目标水平。每次练习后使用 +20m 或菜单记录练习，系统会累计次数、时间和进度。','Sparkles'],
  ['Habits','维护持续进步所需的日常习惯。','创建小而稳定的习惯，例如每天阅读摘要或练习 20 分钟。完成后会更新 streak；重点是保持节奏，不是堆积大量习惯。','Repeat2'],
  ['People','记住重要的人和关系。','添加朋友、导师、同事或研究合作者，记录兴趣、备注、互动和 follow-up。People 会和 Today 的关系提醒配合使用。','Users'],
  ['Projects','把方向变成可交付的项目。','创建项目、编辑下一步、添加里程碑、更新完成状态。适合文献综述、研究计划、作品集和其他需要多步推进的事情。','FolderKanban'],
  ['Knowledge','每天获取值得关注的新信息。','浏览 Daily Knowledge，按领域筛选，保存、标记已读、评分或隐藏内容。Refresh knowledge 会从可靠来源更新研究信息。','BookOpen'],
  ['Books','把整本书转化成学习路径。','上传 TXT、Markdown 或 PDF，查看概念分层、15 分钟 / 1 小时 / Deep Learning 路径、Knowledge Map 和 Active Recall。','LibraryBig'],
  ['Resources','保存值得反复使用的资料。','管理论文、书、课程、视频、网站、数据集、工具和笔记；使用类型、状态、标签和 Learning Area / Skill / Project 关联来整理。','Library'],
  ['Journal','记录每天真正发生的学习。','填写学到了什么、最大进步、遇到的问题、明天继续做什么和自由笔记。完成的任务会自动带入，并可以搜索历史记录。','NotebookPen'],
  ['Analytics','观察长期趋势，而不是只看今天。','查看最近 7 天学习时间、任务完成、技能练习、领域投入和 Weekly Review；还可以生成并保存 AI Weekly Review。','ChartNoAxesCombined'],
  ['Graph','查看知识之间的连接。','Learning Areas、Skills、Projects 和 Resources 会在图中形成连接。先给资源关联方向、技能或项目，Knowledge Graph 才会逐渐丰富。','Share2'],
  ['Settings','管理偏好、AI 和数据。','设置 OpenAI / Supabase AI、主题颜色、暗色模式、备份恢复、Supabase 云同步和应用版本。云同步前请先配置表结构与安全策略。','Settings'],
] as const;

export default function GuidanceCenter() {
  const [open,setOpen]=useState(false); const [step,setStep]=useState(0);
  useEffect(()=>{const onOpen=()=>{setStep(0);setOpen(true)};window.addEventListener('life-os-open-guide',onOpen);if(!localStorage.getItem('personal-life-os-guidance-seen'))setOpen(true);return()=>window.removeEventListener('life-os-open-guide',onOpen)},[]);
  const close=()=>{setOpen(false);localStorage.setItem('personal-life-os-guidance-seen','1')}; const current=guides[step];
  if(!open)return null;
  return <div className="modal-backdrop guidance-backdrop"><section className="guidance-modal"><div className="guidance-head"><div><span className="pill purple">PERSONAL LIFE OS GUIDE</span><h2>Make the system work for you.</h2><p className="muted">A quick tour of every page and the best way to use it.</p></div><button className="modal-close" onClick={close}>×</button></div><div className="guidance-progress"><i style={{width:`${((step+1)/guides.length)*100}%`}}/></div><div className="guidance-step"><div className="guidance-icon"><Icon name={current[3]} size={24}/></div><div><span className="muted">{step+1} / {guides.length}</span><h3>{current[0]}</h3><b>{current[1]}</b><p>{current[2]}</p></div></div><div className="guidance-dots">{guides.map((guide,index)=><button key={guide[0]} className={index===step?'active':''} aria-label={guide[0]} onClick={()=>setStep(index)}/>)}</div><div className="guidance-actions"><button className="secondary" onClick={close}>Skip tour</button><div><button className="secondary" onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0}>Back</button>{step<guides.length-1?<button className="primary" onClick={()=>setStep(step+1)}>Next <Icon name="ArrowRight" size={15}/></button>:<button className="primary" onClick={close}>Finish guide <Icon name="Check" size={15}/></button>}</div></div></section></div>;
}

export function GuideSettingsCard() { return <section className="settings-card guide-settings-card"><div className="settings-card-head"><div><h3>Guidance Center</h3><p>重新查看每个页面能做什么，以及建议的使用方式。</p></div><Icon name="CircleHelp" size={20}/></div><button className="secondary" onClick={()=>window.dispatchEvent(new Event('life-os-open-guide'))}><Icon name="BookOpen" size={15}/> Open full guide</button></section>; }
