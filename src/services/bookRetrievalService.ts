import type { Book } from '../domain/books';
export type BookEvidence={chunkId:string;text:string;pageStart:number;pageEnd:number;score:number};
const terms=(value:string)=>value.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(term=>term.length>2);
export function retrieveBookChunks(book:Book,question:string,limit=4):BookEvidence[]{const query=terms(question);if(!query.length)return[];return(book.bookChunks||[]).map(chunk=>{const text=chunk.text.toLowerCase();const score=query.reduce((sum,term)=>sum+(text.includes(term)?1:0),0)/query.length;return{chunkId:chunk.id,text:chunk.text,pageStart:chunk.pageStart,pageEnd:chunk.pageEnd,score}}).filter(item=>item.score>0).sort((a,b)=>b.score-a.score).slice(0,limit);}
export function formatBookEvidence(evidence:BookEvidence[]){return evidence.map(item=>`Chapter source · pp. ${item.pageStart}${item.pageEnd===item.pageStart?'':`–${item.pageEnd}`}\n${item.text}`).join('\n\n');}
