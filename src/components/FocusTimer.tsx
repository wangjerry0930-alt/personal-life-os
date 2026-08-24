import { useEffect, useState } from 'react';
import Icon from './Icon';

export default function FocusTimer() {
  const [seconds, setSeconds] = useState(25 * 60); const [running, setRunning] = useState(false);
  useEffect(() => { if (!running) return; const timer = window.setInterval(() => setSeconds(value => value > 0 ? value - 1 : 0), 1000); return () => window.clearInterval(timer); }, [running]);
  useEffect(() => { if (seconds === 0) setRunning(false); }, [seconds]);
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0'); const secs = String(seconds % 60).padStart(2, '0');
  return <section className="focus-timer"><div><span className="pill teal">FOCUS TIMER</span><h3>{minutes}:{secs}</h3><p>{seconds===0?'Session complete. Nice work.':'A calm 25-minute block for one small step.'}</p></div><div className="focus-timer-actions"><button className="primary" onClick={()=>setRunning(!running)}><Icon name={running?'Pause':'Play'} size={15}/>{running?'Pause':'Start'}</button><button className="secondary" onClick={()=>{setRunning(false);setSeconds(25*60)}}><Icon name="RefreshCw" size={15}/> Reset</button></div></section>;
}
