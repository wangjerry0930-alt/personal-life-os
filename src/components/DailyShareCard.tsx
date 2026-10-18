import { useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import { useAppStore } from "../store/useAppStore";
import { getTimeEntries } from "../services/timeTrackingService";
import { buildDailyShareSummary, renderDailyShareImage } from "../services/dailyShareService";

const formatMinutes = (minutes: number) => minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;

export default function DailyShareCard({ date }: { date: string }) {
  const { data } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [message, setMessage] = useState("");
  const summary = useMemo(() => buildDailyShareSummary(data, getTimeEntries(date), date), [data, date]);
  const makeBlob = () => new Promise<Blob>((resolve, reject) => { const canvas = canvasRef.current; if (!canvas) return reject(new Error("Preview is unavailable.")); renderDailyShareImage(canvas, summary); canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Could not create the image.")), "image/png"); });
  const download = async () => { try { const blob = await makeBlob(); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `life-os-${date}.png`; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); setMessage("1080 × 1350 image downloaded."); } catch (error) { setMessage(error instanceof Error ? error.message : "Could not create the image."); } };
  const share = async () => { try { const blob = await makeBlob(); const file = new File([blob], `life-os-${date}.png`, { type: "image/png" }); if (!navigator.share || !navigator.canShare?.({ files: [file] })) { await download(); setMessage("Direct sharing is unavailable here, so the image was downloaded for Instagram."); return; } await navigator.share({ files: [file], title: "My 1% better day", text: "Small actions compound." }); setMessage("Share sheet opened."); } catch (error) { if ((error as DOMException)?.name !== "AbortError") setMessage(error instanceof Error ? error.message : "Could not share the image."); } };
  return <section className="daily-share-panel"><div className="daily-share-copy"><span className="pill purple">ATOMIC PROGRESS</span><h3>Your daily accountability card</h3><p>Only totals, activity titles and the wake/sleep times you recorded are included. Notes stay private.</p><div className="daily-share-stats"><b>{formatMinutes(summary.totalMinutes)}</b><span>{summary.categories.length} categories</span><span>{summary.highlights.length} activities</span></div><div className="daily-share-actions"><button className="secondary" onClick={download}><Icon name="Download" size={15}/> Download image</button><button className="primary" onClick={share}><Icon name="Share2" size={15}/> Share</button></div>{message && <small>{message}</small>}</div><div className="daily-share-preview"><b>1% better today.</b><span>{date}</span><strong>{formatMinutes(summary.totalMinutes)}</strong><small>Wake {summary.wakeTime || "—"} · Sleep {summary.sleepTime || "—"}</small><div>{summary.categories.slice(0, 4).map((item) => <i key={item.name} style={{ width: `${Math.max(8, item.minutes / Math.max(1, summary.totalMinutes) * 100)}%` }} title={`${item.name}: ${item.minutes} min`}/>)}</div></div><canvas ref={canvasRef} hidden/></section>;
}
