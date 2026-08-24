import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

export type ActionMenuItem = { label: string; onClick: () => void; danger?: boolean };

export default function ActionMenu({ items }: { items: ActionMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  return <div className="action-menu" ref={ref}><button className="more-button" title="More actions" onClick={() => setOpen(!open)}><Icon name="MoreHorizontal" size={18}/></button>{open&&<div className="action-menu-popover">{items.map(item=><button key={item.label} className={item.danger?'danger-action':''} onClick={()=>{item.onClick();setOpen(false)}}>{item.label}</button>)}</div>}</div>;
}
