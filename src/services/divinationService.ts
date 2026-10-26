export type ReadingKind='iching'|'tarot';
export interface TarotCard{position:string;name:string;orientation:'upright'|'reversed';meaning:string}
export interface DailyReading{id:string;date:string;kind:ReadingKind;question:string;hexagram?:string;resultingHexagram?:string;changingLines?:number[];tarotCards?:TarotCard[];sourceText:string;reflection:string;createdAt:string}

export function ichingReadingRule(lines:number[],hexagram='本卦',resulting='变卦'){
 const sorted=[...new Set(lines)].filter(line=>line>=1&&line<=6).sort((a,b)=>a-b),count=sorted.length,labels=sorted.map(line=>`${line}爻`).join('、');
 if(count===0)return`六爻皆静：只看${hexagram}卦辞，不看变卦。`;
 if(count===1)return`一爻变：看${hexagram}${labels}的爻辞。`;
 if(count===2)return`二爻变：结合${hexagram}${labels}两条爻辞，以上位爻为主、下位爻为辅。`;
 if(count===3)return`三爻变：结合${hexagram}与${resulting||'变卦'}卦辞；${sorted.includes(1)?'初爻变，以变卦为主、本卦为辅。':'初爻不变，以本卦为主、变卦为辅。'}`;
 if(count===4||count===5){const still=[1,2,3,4,5,6].filter(line=>!sorted.includes(line));return`${count}爻变：主要参考${resulting||'变卦'}中未变化的${still.map(line=>`${line}爻`).join('、')}爻辞。`}
 if(hexagram.includes('乾'))return'六爻皆变且本卦为乾：看乾卦“用九”，不看坤卦卦辞。';
 if(hexagram.includes('坤'))return'六爻皆变且本卦为坤：看坤卦“用六”，不看乾卦卦辞。';
 return`六爻皆变：通常看${resulting||'变卦'}卦辞。`;
}
