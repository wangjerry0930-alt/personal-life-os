import { useEffect } from 'react';

const KEY='personal-life-os-today-activity-open';

export default function TodayActivityCollapse(){
 useEffect(()=>{
  const timeline=document.querySelector<HTMLElement>('.timeline');
  const heading=timeline?.querySelector<HTMLElement>('.section-title');
  const list=timeline?.querySelector<HTMLElement>('.activity-list');
  if(!timeline||!heading||!list)return;
  const button=document.createElement('button');
  button.type='button';button.className='today-activity-toggle';
  const update=(open:boolean)=>{timeline.classList.toggle('activity-collapsed',!open);button.setAttribute('aria-expanded',String(open));button.textContent=`${open?'收起':'展开'} · ${list.children.length} 条`;localStorage.setItem(KEY,String(open))};
  update(localStorage.getItem(KEY)!=='false');
  const click=()=>update(timeline.classList.contains('activity-collapsed'));
  button.addEventListener('click',click);heading.appendChild(button);
  return()=>{button.removeEventListener('click',click);button.remove();timeline.classList.remove('activity-collapsed')};
 },[]);
 return null;
}
