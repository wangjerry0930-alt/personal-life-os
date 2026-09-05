import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { BookPage, ParsedBook } from '../domain/bookParsing';

export type OcrLanguage='eng'|'chi_sim+eng';
export type OcrProgress=(progress:number,status:string)=>void;
const normalize=(value:string)=>value.replace(/\s+/g,' ').trim();
const chunks=(pages:BookPage[])=>pages.filter(page=>normalize(page.text)).map((page,index)=>({id:`ocr-chunk-${Date.now()}-${index}`,text:normalize(page.text),pageStart:page.pageNumber,pageEnd:page.pageNumber,chunkIndex:index,tokenEstimate:Math.ceil(page.text.length/4),createdAt:new Date().toISOString()}));

/** OCR runs locally in the browser and is only invoked for image-only PDFs. */
export async function ocrPdfFile(file:File,language:OcrLanguage,onProgress:OcrProgress,signal?:AbortSignal):Promise<ParsedBook>{
  const {createWorker}=await import('tesseract.js');
  const bytes=new Uint8Array(await file.arrayBuffer());
  const pdf=await pdfjs.getDocument({data:bytes} as any).promise;
  const worker=await createWorker(language.split('+'));
  const pages:BookPage[]=[];
  try{
    for(let pageNumber=1;pageNumber<=pdf.numPages;pageNumber++){
      if(signal?.aborted)throw new DOMException('OCR cancelled','AbortError');
      onProgress((pageNumber-1)/pdf.numPages,`Rendering page ${pageNumber} of ${pdf.numPages}…`);
      const page=await pdf.getPage(pageNumber); const viewport=page.getViewport({scale:1.5});
      const canvas=globalThis.document.createElement('canvas'); canvas.width=Math.ceil(viewport.width); canvas.height=Math.ceil(viewport.height);
      await page.render({canvas,canvasContext:canvas.getContext('2d')!,viewport} as any).promise;
      const result=await worker.recognize(canvas); pages.push({pageNumber,text:result.data.text||''});
      onProgress(pageNumber/pdf.numPages,`Recognized page ${pageNumber} of ${pdf.numPages}`);
    }
  }finally{await worker.terminate();}
  const recognized=chunks(pages);
  if(!recognized.length)throw new Error('OCR finished but no readable text was recognized. Try Chinese + English or a higher-quality PDF.');
  return {pages,chunks:recognized,warnings:pages.filter(page=>!normalize(page.text)).map(page=>`Page ${page.pageNumber} still contains no recognizable text.`),sourceType:'pdf'};
}
