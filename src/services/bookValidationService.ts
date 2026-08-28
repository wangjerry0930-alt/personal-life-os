import type { Book } from '../domain/books';
import { getConceptMastery } from './conceptMasteryService';
import { isRecallDue } from './recallService';
import { validateConceptSources } from './bookSourceService';

export type BookValidationReport={pages:number;emptyPages:number;suspiciousPages:number;chunks:number;chunkMin:number;chunkMax:number;chunkAverage:number;missingPageRefs:number;duplicateChunks:number;concepts:number;tierDistribution:Record<string,number>;ungroundedConcepts:number;invalidSourceRefs:number;unlinkedRecalls:number;dueReviews:number;masteryDistribution:Record<string,number>;warnings:string[]};

export function validateBook(book:Book):BookValidationReport{
  const pages=book.bookChunks||[];
  const pageNumbers=new Set(pages.flatMap(chunk=>Array.from({length:Math.max(1,chunk.pageEnd-chunk.pageStart+1)},(_,index)=>chunk.pageStart+index)));
  const lengths=pages.map(chunk=>chunk.text.trim().length);
  const duplicateKeys=new Set<string>();let duplicateChunks=0;
  pages.forEach(chunk=>{const key=chunk.text.toLowerCase().replace(/\s+/g,' ').trim();if(duplicateKeys.has(key))duplicateChunks++;else duplicateKeys.add(key)});
  const sourceChecks=book.concepts.flatMap(concept=>validateConceptSources(book,concept));
  const tierDistribution={'Tier 1':0,'Tier 2':0,'Tier 3':0,'Tier 4':0};
  book.concepts.forEach(concept=>{tierDistribution[`Tier ${concept.tier}`]++});
  const masteryDistribution:Record<string,number>={};
  book.concepts.forEach(concept=>{const state=getConceptMastery(book.id,concept,book.recalls);masteryDistribution[state]=(masteryDistribution[state]||0)+1});
  const warnings=[...(book.warnings||[])];
  if(book.concepts.length&&tierDistribution['Tier 1']/book.concepts.length>.3)warnings.push('Tier 1 concentration is above 30%; ranking deserves review.');
  if(duplicateChunks)warnings.push(`${duplicateChunks} duplicated chunk${duplicateChunks===1?'':'s'} detected.`);
  return {pages:pageNumbers.size,emptyPages:0,suspiciousPages:pages.filter(chunk=>chunk.text.trim().length<120).length,chunks:pages.length,chunkMin:lengths.length?Math.min(...lengths):0,chunkMax:lengths.length?Math.max(...lengths):0,chunkAverage:lengths.length?Math.round(lengths.reduce((a,b)=>a+b,0)/lengths.length):0,missingPageRefs:pages.filter(chunk=>!chunk.pageStart||!chunk.pageEnd||chunk.pageEnd<chunk.pageStart).length,duplicateChunks,concepts:book.concepts.length,tierDistribution,ungroundedConcepts:book.concepts.filter(concept=>!(concept.sourceRefs||[]).length).length,invalidSourceRefs:sourceChecks.filter(item=>!item.valid).length,unlinkedRecalls:book.recalls.filter(recall=>!book.concepts.some(concept=>concept.id===recall.conceptId)).length,dueReviews:book.recalls.filter(recall=>isRecallDue(recall.nextReview)).length,masteryDistribution,warnings};
}
