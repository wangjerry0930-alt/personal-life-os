import { describe, expect, it } from 'vitest';
import { elapsedTaskSeconds, emptyTaskTimer, pauseTaskClock, startTaskClock } from './taskTimerPersistence';
describe('persistent task timer',()=>{
 it('uses wall clock time instead of interval ticks',()=>{const running=startTaskClock(emptyTaskTimer(),1_000);expect(elapsedTaskSeconds(running,13_400)).toBe(12)});
 it('keeps accumulated time across pause and resume',()=>{const first=pauseTaskClock(startTaskClock(emptyTaskTimer(),1_000),6_500);const resumed=startTaskClock(first,20_000);expect(elapsedTaskSeconds(resumed,24_900)).toBe(9)});
});
