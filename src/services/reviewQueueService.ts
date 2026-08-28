import type { Book } from '../domain/books';
import { isRecallDue } from './recallService';
export type ReviewQueueItem={book:Book;recall:Book['recalls'][number];concept:Book['concepts'][number];priority:number};
export function getReviewQueue(books:Book[],limit=5,today=new Date().toISOString().slice(0,10)):ReviewQueueItem[]{return books.flatMap(book=>book.recalls.filter(recall=>isRecallDue(recall.nextReview,today)).map(recall=>{const concept=book.concepts.find(item=>item.id===recall.conceptId);return concept?{book,recall,concept,priority:(concept.tier===1?4:concept.tier===2?3:1)+(recall.confidence<40?2:0)}:null})).filter(Boolean).sort((a,b)=>b!.priority-a!.priority).slice(0,limit) as ReviewQueueItem[];}
