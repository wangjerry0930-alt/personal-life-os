import { useMemo, useState } from 'react';
import type { KnowledgeItem } from '../domain/types';
import Icon from './Icon';
import { metadataRepository } from '../repositories/legacyRepositories';

export default function KnowledgePage({items}:{items:KnowledgeItem[]}){
  const [query,setQuery]=useState('');
  const [field,setField]=useState('All');
  const [history,setHistory]=useState(false);
  const current=useMemo(()=>metadataRepository.get<KnowledgeItem[]>('personal-life-os-knowledge',items),[items]);
  const archived=metadataRepository.get<KnowledgeItem[]>('personal-life-os-knowledge-history',[]);
  const source=history?archived:current;
  const fields=['All',...Array.from(new Set(source.map(item=>item.field)))];
  const visible=source.filter(item=>(field==='All'||item.field===field)&&(item.title+' '+item.summary+' '+item.field).toLowerCase().includes(query.toLowerCase()));
  return <div className="content"><div className="knowledge-header"><div><span className="pill teal">DAILY KNOWLEDGE</span><h2>{history?'Knowledge history':'Signals worth your attention.'}</h2><p className="muted">{history?'Review previously surfaced research and ideas.':'Search, filter and save the ideas worth returning to.'}</p></div><button className="secondary" onClick={()=>setHistory(!history)}><Icon name="History" size={15}/>{history?'Today’s knowledge':'View history'}</button></div><div className="knowledge-toolbar"><div className="search-field"><Icon name="Search" size={15}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search knowledge…"/></div><div className="knowledge-filters">{fields.map(item=><button key={item} className={field===item?'active':''} onClick={()=>setField(item)}>{item}</button>)}</div></div><div className="knowledge-feed">{visible.map(item=><article className="knowledge-item" key={item.id}><div className="knowledge-item-top"><span className="source-badge">{item.source}</span><span>{item.publishedAt}</span></div><h3>{item.title}</h3><span className="knowledge-field">{item.field}</span><p>{item.summary}</p><div className="why"><b>Why it matters</b><span>{item.whyItMatters}</span></div><div className="knowledge-actions"><a href={item.url} target="_blank" rel="noreferrer">Open original source <Icon name="ArrowUpRight" size={14}/></a></div></article>)}</div>{!visible.length&&<div className="empty-page"><h2>No matching knowledge</h2><p>Try another search or switch between today and history.</p></div>}</div>;
}
