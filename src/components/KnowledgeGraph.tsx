import { useMemo, useState } from 'react';
import Icon from './Icon';
import type { AppData, EntityRelation, ResourceItem } from '../domain/types';
import { resourceRepository } from '../repositories/legacyRepositories';
import { loadSnapshot } from '../repositories/appRepository';

type GraphNode={id:string;label:string;type:'Area'|'Skill'|'Project'|'Resource';color:string};
type GraphLink={from:string;to:string;label?:string};

export default function KnowledgeGraph({ data }: { data: AppData }) {
  const [filter,setFilter]=useState<'All'|GraphNode['type']>('All');
  const resources: ResourceItem[] = useMemo(() => resourceRepository.load(), []);
  const relations: EntityRelation[] = useMemo(() => loadSnapshot().relations||[], [data]);
  const nodes=useMemo<GraphNode[]>(()=>[
    ...data.areas.map(item=>({id:item.id,label:item.name,type:'Area' as const,color:item.color})),
    ...data.skills.map(item=>({id:item.id,label:item.name,type:'Skill' as const,color:'#8b7cf6'})),
    ...(data.projects||[]).map(item=>({id:item.id,label:item.name,type:'Project' as const,color:'#d18b62'})),
    ...resources.map(item=>({id:item.id,label:item.title,type:'Resource' as const,color:'#62a98b'})),
  ],[data,resources]);
  const links=useMemo<GraphLink[]>(()=>{
    const valid=new Set(nodes.map(node=>node.id));
    const relationLinks=relations.filter(relation=>valid.has(relation.sourceId)&&valid.has(relation.targetId)).map(relation=>({from:relation.sourceId,to:relation.targetId,label:relation.relationType}));
    const resourceLinks=resources.flatMap(resource=>[resource.areaId&&{from:resource.id,to:resource.areaId,label:'linked'},resource.skillId&&{from:resource.id,to:resource.skillId,label:'linked'},resource.projectId&&{from:resource.id,to:resource.projectId,label:'linked'}].filter(Boolean) as GraphLink[]);
    return [...relationLinks,...resourceLinks];
  },[nodes,relations,resources]);
  const visibleNodes=useMemo(()=>filter==='All'?nodes:nodes.filter(node=>node.type===filter),[filter,nodes]);
  const visibleIds=new Set(visibleNodes.map(node=>node.id));
  const visibleLinks=links.filter(link=>visibleIds.has(link.from)&&visibleIds.has(link.to));
  const positions=visibleNodes.map((node,index)=>({...node,x:80+(index%5)*175,y:70+Math.floor(index/5)*118}));
  const byId=new Map(positions.map(node=>[node.id,node]));
  const counts=nodes.reduce<Record<string,number>>((result,node)=>{result[node.type]=(result[node.type]||0)+1;return result},{});
  return <div className="content graph-page"><div className="knowledge-header"><div><span className="pill purple">KNOWLEDGE GRAPH</span><h2>See how your growth system connects.</h2><p className="muted">Learning Areas, Skills, Projects, Resources and profile relations now share one map.</p></div><span className="muted">{nodes.length} nodes · {links.length} links</span></div><div className="graph-filters">{(['All','Area','Skill','Project','Resource'] as const).map(item=><button key={item} className={filter===item?'active':''} onClick={()=>setFilter(item)}>{item}{item!=='All'&&<small>{counts[item]||0}</small>}</button>)}</div>{visibleNodes.length?<div className="graph-card"><svg viewBox={`0 0 ${Math.max(860,Math.ceil(visibleNodes.length/5)*175)} ${Math.max(420,Math.ceil(visibleNodes.length/5)*118+50)}`} role="img" aria-label="Knowledge graph">{visibleLinks.map((link,index)=>{const from=byId.get(link.from),to=byId.get(link.to);return from&&to?<g key={index}><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="var(--line)" strokeWidth="2"/><text x={(from.x+to.x)/2} y={(from.y+to.y)/2-4} textAnchor="middle" fill="var(--muted)" fontSize="7">{link.label}</text></g>:null})}{positions.map(node=><g key={node.id}><circle cx={node.x} cy={node.y} r="30" fill={node.color} opacity=".16" stroke={node.color} strokeWidth="2"/><text x={node.x} y={node.y-2} textAnchor="middle" fill="var(--ink)" fontSize="10" fontWeight="600">{node.label.slice(0,20)}</text><text x={node.x} y={node.y+14} textAnchor="middle" fill="var(--muted)" fontSize="8">{node.type}</text></g>)}</svg><div className="graph-legend"><span><i style={{background:'#8b7cf6'}}/> Area / Skill</span><span><i style={{background:'#d18b62'}}/> Project</span><span><i style={{background:'#62a98b'}}/> Resource</span><span><Icon name="GitBranch" size={12}/> Profile relations</span></div></div>:<div className="empty-page"><div className="empty-icon"><Icon name="Share2" size={30}/></div><h2>No nodes in this filter</h2><p>Choose another filter or add a learning area, skill, project or resource.</p></div>}</div>;
}
