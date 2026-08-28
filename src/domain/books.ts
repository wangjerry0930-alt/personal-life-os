export type BookConcept={id:string;name:string;summary:string;tier:1|2|3|4;chapter:string;pageRange:string;difficulty:'Core'|'Advanced';learned:boolean};
export type BookRecall={id:string;question:string;answer:string;conceptId:string;difficulty:'Easy'|'Medium'|'Hard';nextReview:string;confidence:number};
export type BookSession={mode:string;completedAt:string;durationMinutes?:number};
export type Book={id:string;title:string;author:string;fileName:string;uploadedAt:string;status:'Ready'|'Processing'|'Needs review'|'Failed';progress:number;areaId?:string;skillId?:string;chapters:string[];chunks:number;bookChunks?:import('./bookParsing').BookChunk[];warnings?:string[];summary:string;concepts:BookConcept[];recalls:BookRecall[];sessions:BookSession[]};
