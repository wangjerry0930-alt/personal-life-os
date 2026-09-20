export function textLayerLooksCorrupted(value:string){
  const words=value.split(/\s+/).filter(Boolean);if(words.length<25)return false;
  const tiny=words.filter(word=>word.length<=2).length/words.length;
  const singleLetters=words.filter(word=>/^[A-Za-z]$/.test(word)).length/words.length;
  const malformedSymbols=(value.match(/[|_{}[\]=]/g)||[]).length;
  const replacement=(value.match(/�/g)||[]).length;
  const noisyUppercase=words.filter(word=>word.length>=4&&/^[A-Z]{4,}$/.test(word)).length/words.length;
  return tiny>.32||singleLetters>.12||malformedSymbols>1||noisyUppercase>.38||replacement>0;
}
