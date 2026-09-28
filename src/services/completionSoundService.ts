type SoundKind='task'|'focus'|'break';

let context:AudioContext|null=null;
const audioContext=()=>{if(typeof window==='undefined')return null;const AudioContextClass=window.AudioContext||(window as typeof window&{webkitAudioContext?:typeof AudioContext}).webkitAudioContext;if(!AudioContextClass)return null;context??=new AudioContextClass();return context};
const notes:Record<SoundKind,Array<[number,number,number]>>={task:[[523.25,0,.12],[659.25,.11,.14],[783.99,.24,.22]],focus:[[659.25,0,.16],[523.25,.18,.22]],break:[[523.25,0,.13],[659.25,.14,.13],[880,.28,.24]]};

export function primeCompletionSounds(){if(typeof window==='undefined')return()=>{};const unlock=()=>{const audio=audioContext();if(audio?.state==='suspended')void audio.resume()};window.addEventListener('pointerdown',unlock,{once:true});window.addEventListener('keydown',unlock,{once:true});return()=>{window.removeEventListener('pointerdown',unlock);window.removeEventListener('keydown',unlock)}}

export function playCompletionSound(kind:SoundKind='task'){try{const audio=audioContext();if(!audio)return;if(audio.state==='suspended')void audio.resume();const start=audio.currentTime+.01;notes[kind].forEach(([frequency,offset,duration])=>{const oscillator=audio.createOscillator();const gain=audio.createGain();oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency,start+offset);gain.gain.setValueAtTime(.0001,start+offset);gain.gain.exponentialRampToValueAtTime(.16,start+offset+.02);gain.gain.exponentialRampToValueAtTime(.0001,start+offset+duration);oscillator.connect(gain).connect(audio.destination);oscillator.start(start+offset);oscillator.stop(start+offset+duration+.02)})}catch{/* Sound is optional when audio is unavailable. */}}
