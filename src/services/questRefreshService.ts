import {localDateKey} from '../domain/date';
import {saveQuestState} from '../repositories/appRepository';

const KEY='personal-life-os-quest-refresh-v1';
type RefreshLedger={date:string;counts:Record<string,number>};

export function loadQuestRefreshLedger(date=localDateKey()):RefreshLedger{
 try{const saved=JSON.parse(localStorage.getItem(KEY)||'null') as RefreshLedger|null;if(saved?.date===date&&saved.counts)return saved}catch{}
 return{date,counts:{}};
}
export function getQuestRefreshStatus(targetId:string,date=localDateKey()){
 const ledger=loadQuestRefreshLedger(date);const count=ledger.counts[targetId]||0;
 return{date,count,freeAvailable:count===0,nextSourceId:`${date}:${targetId}:${count+1}`};
}
export function recordQuestRefresh(targetId:string,date=localDateKey()){
 const ledger=loadQuestRefreshLedger(date);const count=(ledger.counts[targetId]||0)+1;
 const next={...ledger,counts:{...ledger.counts,[targetId]:count}};localStorage.setItem(KEY,JSON.stringify(next));
 const board=JSON.parse(localStorage.getItem('personal-life-os-quest-board-v1')||'{"ranks":[],"quests":[]}');saveQuestState(board,next);
 return count;
}
