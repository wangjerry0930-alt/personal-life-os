import type { BookConcept, BookRecall } from '../domain/books';
import { loadSnapshot } from '../repositories/appRepository';
import { recallAccuracy } from './recallService';
export type MasteryState='New'|'Learning'|'Understand'|'Mastered'|'Needs Review';
export function getConceptMastery(bookId:string,concept:BookConcept,recalls:BookRecall[],snapshot=loadSnapshot()):MasteryState{const questions=recalls.filter(item=>item.conceptId===concept.id);const attempts=(snapshot.recallAttempts||[]).filter(item=>item.bookId===bookId&&questions.some(question=>question.id===item.questionId));const accuracy=recallAccuracy(attempts);const failures=attempts.filter(item=>item.result==='incorrect').length;if(failures>0&&attempts[attempts.length-1]?.result==='incorrect')return'Needs Review';if(attempts.length>=3&&accuracy>=80)return'Mastered';if(attempts.length>0&&accuracy>=50)return'Understand';if(attempts.length>0||concept.learned)return'Learning';return'New';}
