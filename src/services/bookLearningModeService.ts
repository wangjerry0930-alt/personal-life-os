import type { Book, BookConcept } from '../domain/books';
export type LearningMode='15 Minute'|'1 Hour'|'Deep Learning';
export function conceptsForMode(book:Book,mode:LearningMode):BookConcept[]{const ranked=[...book.concepts].sort((a,b)=>(b.importanceScore||0)-(a.importanceScore||0));if(mode==='15 Minute')return ranked.filter(item=>item.tier===1).slice(0,5);if(mode==='1 Hour')return ranked.filter(item=>item.tier<=2);return ranked.filter(item=>item.tier<=3);}
