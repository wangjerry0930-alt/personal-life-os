import type { ParsedBook } from '../domain/bookParsing';
import { chunkBookPages, normalizeBookText } from './bookParsingUtils';
export { textLayerLooksCorrupted } from './bookTextQuality';

export interface BookParser{parse(file:File):Promise<ParsedBook>}
export class TextBookParser implements BookParser{async parse(file:File):Promise<ParsedBook>{const text=normalizeBookText(await file.text());const pages=[{pageNumber:1,text}];return{pages,chunks:chunkBookPages(pages),warnings:text?[]:['The text file is empty.'],sourceType:'text'}}}
export class MarkdownBookParser extends TextBookParser{async parse(file:File):Promise<ParsedBook>{const result=await super.parse(file);return{...result,sourceType:'markdown'}}}
export function parserFor(file:File):BookParser{
  if(file.type==='application/pdf'||/\.pdf$/i.test(file.name))return{parse:async source=>{const{PdfBookParser}=await import('./pdfBookParser');return new PdfBookParser().parse(source)}};
  if(file.type==='application/epub+zip'||/\.epub$/i.test(file.name))return{parse:async source=>{const{EpubBookParser}=await import('./epubBookParser');return new EpubBookParser().parse(source)}};
  return /\.md$/i.test(file.name)||file.type==='text/markdown'?new MarkdownBookParser():new TextBookParser();
}
