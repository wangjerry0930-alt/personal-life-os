export type ReadingKind='iching'|'tarot';
export interface TarotCard{position:string;name:string;orientation:'upright'|'reversed';meaning:string}
export interface DailyReading{id:string;date:string;kind:ReadingKind;question:string;hexagram?:string;resultingHexagram?:string;changingLines?:number[];tarotCards?:TarotCard[];sourceText:string;reflection:string;createdAt:string}
export const hexagrams=['乾为天','坤为地','水雷屯','山水蒙','水天需','天水讼','地水师','水地比','风天小畜','天泽履','地天泰','天地否','天火同人','火天大有','地山谦','雷地豫','泽雷随','山风蛊','地泽临','风地观','火雷噬嗑','山火贲','山地剥','地雷复','天雷无妄','山天大畜','山雷颐','泽风大过','坎为水','离为火','泽山咸','雷风恒','天山遁','雷天大壮','火地晋','地火明夷','风火家人','火泽睽','水山蹇','雷水解','山泽损','风雷益','泽天夬','天风姤','泽地萃','地风升','泽水困','水风井','泽火革','火风鼎','震为雷','艮为山','风山渐','雷泽归妹','雷火丰','火山旅','巽为风','兑为泽','风水涣','水泽节','风泽中孚','雷山小过','水火既济','火水未济'] as const;
export const tarotCards=['愚人','魔术师','女祭司','皇后','皇帝','教皇','恋人','战车','力量','隐士','命运之轮','正义','倒吊人','死神','节制','恶魔','高塔','星星','月亮','太阳','审判','世界',...['权杖','圣杯','宝剑','星币'].flatMap(suit=>['王牌','二','三','四','五','六','七','八','九','十','侍从','骑士','皇后','国王'].map(rank=>`${suit}${rank}`))];
export const matchHexagrams=(query:string)=>{const normalized=query.trim().replace(/[卦\s]/g,'');if(!normalized)return[...hexagrams];return hexagrams.filter(name=>name.replace('卦','').includes(normalized)||normalized.split('').every(char=>name.includes(char)))};

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
