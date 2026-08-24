import { useState } from 'react';
import Icon from './Icon';

type Capture = { id: string; text: string; createdAt: string; people: string[]; topics: string[]; followUp: string };

function extract(text: string) {
  const people = Array.from(text.matchAll(/\b(?:with|and|和|跟|与)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g)).map(match => match[1]);
  const topics = ['BCI', 'neuroscience', 'AI', 'machine learning', 'Python', 'R', 'statistics', 'photography'].filter(topic => text.toLowerCase().includes(topic.toLowerCase()));
  const followUp = /next week|下周|tomorrow|明天|follow.?up|约好|计划/.test(text) ? 'Follow-up detected' : '';
  return { people, topics, followUp };
}

export default function QuickCapture({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const save = () => {
    if (!text.trim()) return;
    const parsed = extract(text.trim());
    const capture: Capture = { id: Date.now().toString(), text: text.trim(), createdAt: new Date().toISOString(), ...parsed };
    const existing = JSON.parse(localStorage.getItem('personal-life-os-captures') || '[]') as Capture[];
    localStorage.setItem('personal-life-os-captures', JSON.stringify([capture, ...existing].slice(0, 100)));
    setSaved(true);
    setTimeout(onClose, 650);
  };
  return <div className="modal-backdrop" onMouseDown={onClose}><form className="capture-modal" onSubmit={event => { event.preventDefault(); save(); }} onMouseDown={event => event.stopPropagation()}>
    <div className="modal-head"><div><span className="pill purple">QUICK CAPTURE</span><h2>Get it out of your head.</h2><p className="muted">Write naturally. We’ll organize the details later.</p></div><button type="button" className="modal-close" onClick={onClose}>×</button></div>
    <textarea autoFocus value={text} onChange={event => setText(event.target.value)} placeholder="e.g. Today I talked with Alex about BCI and we’ll read a paper together next week." rows={5}/>
    {text.trim()&&<div className="capture-preview"><Icon name="Sparkles" size={16}/><span>{extract(text).people.length ? `Person: ${extract(text).people.join(', ')}` : 'Person: none detected'} · {extract(text).topics.length ? `Topic: ${extract(text).topics.join(', ')}` : 'Topic: general note'}{extract(text).followUp ? ' · Follow-up detected' : ''}</span></div>}
    <div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button className="primary" disabled={!text.trim()}>{saved ? 'Saved' : 'Save capture'}</button></div>
  </form></div>;
}
