export type BookPage={pageNumber:number;text:string};
export type BookChunk={id:string;bookId:string;text:string;pageStart:number;pageEnd:number;chunkIndex:number;tokenEstimate:number;createdAt:string};
export type ParsedBook={pages:BookPage[];chunks:Omit<BookChunk,'bookId'>[];warnings:string[];sourceType:'pdf'|'text'|'markdown'|'epub'};
