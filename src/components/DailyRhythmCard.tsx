import Icon from "./Icon";
import type { AppData } from "../domain/types";
import { localDateKey } from "../domain/date";
import { getDailyRhythm, localTimeValue, updateDailyRhythm } from "../services/dailyRhythmService";

export default function DailyRhythmCard({ data, setData }: { data: AppData; setData: (updater: (data: AppData) => AppData) => void }) {
  const date = localDateKey();
  const rhythm = getDailyRhythm(data, date);
  const update = (patch: { wakeTime?: string; sleepTime?: string }) => setData((current) => updateDailyRhythm(current, date, patch));
  return <section className="daily-rhythm-card">
    <div className="daily-rhythm-copy"><span className="pill teal">DAILY RHYTHM</span><h3>Show up, then improve by 1%.</h3><p>Record the edges of your day. Both times can be corrected manually.</p></div>
    <label><span><Icon name="Sunrise" size={15}/> Woke up</span><input type="time" value={rhythm.wakeTime || ""} onChange={(event) => update({ wakeTime: event.target.value || undefined })}/><button className="secondary" onClick={() => update({ wakeTime: localTimeValue() })}>{rhythm.wakeTime ? "Set to now" : "I’m awake"}</button></label>
    <label><span><Icon name="Moon" size={15}/> Going to sleep</span><input type="time" value={rhythm.sleepTime || ""} onChange={(event) => update({ sleepTime: event.target.value || undefined })}/><button className="secondary" onClick={() => update({ sleepTime: localTimeValue() })}>{rhythm.sleepTime ? "Set to now" : "Going to sleep"}</button></label>
  </section>;
}
