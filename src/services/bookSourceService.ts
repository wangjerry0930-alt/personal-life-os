import type { Book, BookConcept } from '../domain/books';
import type { BookChunk } from '../domain/bookParsing';

export function formatSourceReference(source:{chapterTitle?:string;pageStart:number;pageEnd:number}){
  const pages=source.pageStart===source.pageEnd?`p. ${source.pageStart}`:`pp. ${source.pageStart}–${source.pageEnd}`;
  return source.chapterTitle?`${source.chapterTitle} · ${pages}`:pages;
}

export function validateConceptSources(book:Book,concept:BookConcept){
  const chunks=new Map((book.bookChunks||[]).map(chunk=>[chunk.id,chunk]));
  return (concept.sourceRefs||[]).map(source=>{
    const chunk=chunks.get(source.chunkId);
    const valid=Boolean(chunk&&source.bookId===book.id&&source.pageStart===chunk.pageStart&&source.pageEnd===chunk.pageEnd);
    return {source,valid,chunk};
  });
}

export function validateCitation(book:Book,evidence:BookChunk[],citation:{chunkId:string;pageStart:number;pageEnd:number}){
  const chunk=evidence.find(item=>item.id===citation.chunkId);
  return Boolean(chunk&&chunk.bookId===book.id&&chunk.pageStart===citation.pageStart&&chunk.pageEnd===citation.pageEnd);
}
