import { useRef } from 'react';
import Icon from './Icon';
import { useAppStore } from '../store/useAppStore';

export default function BackupTools() {
  const { data, setData } = useAppStore();
  const input = useRef<HTMLInputElement>(null);
  const exportData = () => { const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'personal-life-os-backup.json'; link.click(); URL.revokeObjectURL(url); };
  const importData = (file?: File) => { if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const next = JSON.parse(String(reader.result)); if (next.areas && next.skills && next.tasks) setData(next); else window.alert('This file is not a valid Life OS backup.'); } catch { window.alert('Could not read this backup file.'); } }; reader.readAsText(file); };
  return <section className="settings-card"><div className="settings-card-head"><div><h3>Data backup</h3><p>Keep a portable copy of your local Life OS data.</p></div><Icon name="Database" size={20}/></div><div className="backup-actions"><button className="secondary" onClick={exportData}><Icon name="Download" size={15}/> Export JSON</button><button className="secondary" onClick={() => input.current?.click()}><Icon name="Upload" size={15}/> Import JSON</button><input ref={input} type="file" accept="application/json" hidden onChange={event => importData(event.target.files?.[0])}/></div><p className="settings-warning"><Icon name="ShieldAlert" size={15}/> Backups stay on your computer. Importing replaces the current local data.</p></section>;
}
