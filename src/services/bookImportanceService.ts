import type { BookAIConcept } from './bookAiService';

export type ImportanceBreakdown = { score:number; tier:1|2|3|4; explanation:string };

export function calculateBookImportance(input:Pick<BookAIConcept,'centralityScore'|'dependencyScore'|'bookThesisImportance'|'userRelevanceScore'|'practicalValue'|'redundancyPenalty'>):ImportanceBreakdown {
  const clamp=(value:number)=>Math.max(0,Math.min(1,Number.isFinite(value)?value:0));
  const centrality=clamp(Number(input.centralityScore));
  const dependency=clamp(Number(input.dependencyScore));
  const thesis=clamp(Number(input.bookThesisImportance));
  const relevance=clamp(Number(input.userRelevanceScore));
  const practical=clamp(Number(input.practicalValue));
  const redundancy=clamp(Number(input.redundancyPenalty));
  const score=Math.max(0,Math.min(1,centrality*.25+dependency*.2+thesis*.25+relevance*.2+practical*.1-redundancy*.15));
  const tier=score>=.72?1:score>=.5?2:score>=.28?3:4;
  const explanation=`Centrality ${Math.round(centrality*100)}% · dependency ${Math.round(dependency*100)}% · thesis ${Math.round(thesis*100)}% · relevance ${Math.round(relevance*100)}% · redundancy −${Math.round(redundancy*100)}%`;
  return {score,tier,explanation};
}

export function rankingWarning(concepts:Array<{tier:1|2|3|4}>){
  const tierOne=concepts.filter(item=>item.tier===1).length;
  return concepts.length>0&&tierOne/concepts.length>.3?'More than 30% of concepts are Tier 1; review the ranking for over-inclusion.':'';
}
