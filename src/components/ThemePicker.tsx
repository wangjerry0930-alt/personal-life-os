import { useState } from 'react';
import Icon from './Icon';

const themes = [{ id: 'lavender', name: 'Lavender', color: '#8b7cf6', soft: '#e9e4f9' }, { id: 'mint', name: 'Soft mint', color: '#62a98b', soft: '#dff2e8' }, { id: 'sky', name: 'Sky blue', color: '#5d91c5', soft: '#e3effa' }, { id: 'peach', name: 'Warm peach', color: '#d18b62', soft: '#fae9dd' }];
export default function ThemePicker() {
  const [current, setCurrent] = useState(() => localStorage.getItem('personal-life-os-theme') || 'lavender');
  const choose = (id: string) => { setCurrent(id); localStorage.setItem('personal-life-os-theme', id); window.dispatchEvent(new CustomEvent('life-os-theme', { detail: id })); };
  return <section className="settings-card"><div className="settings-card-head"><div><h3>Theme color</h3><p>Choose an accent for your workspace.</p></div><Icon name="Palette" size={20}/></div><div className="theme-picker">{themes.map(theme=><button key={theme.id} className={current===theme.id?'selected':''} onClick={()=>choose(theme.id)}><span style={{background:theme.color}}/><b>{theme.name}</b>{current===theme.id&&<Icon name="Check" size={14}/>}</button>)}</div></section>;
}
