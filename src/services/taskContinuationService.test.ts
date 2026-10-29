import { describe, expect, it } from 'vitest';
import { makeContinuation, normalizeMaterialUrl, taskStartPrompt } from './taskContinuationService';

describe('task start and continuation helpers',()=>{
  it('keeps old tasks compatible by falling back to the title',()=>{
    expect(taskStartPrompt({title:'Read paper'})).toEqual({label:'First step',text:'Read paper'});
  });
  it('prefers a saved continuation over the original first step',()=>{
    expect(taskStartPrompt({title:'Read paper',firstStep:'Open PDF',continuation:{nextStep:'Open Figure 2',updatedAt:'2026-10-29T10:00:00Z'}})).toEqual({label:'Continue',text:'Open Figure 2'});
  });
  it('allows an empty pause without creating a stale continuation',()=>{
    expect(makeContinuation({},'2026-10-29T10:00:00Z')).toBeUndefined();
  });
  it('trims and timestamps a useful return note',()=>{
    expect(makeContinuation({progress:'  Methods done  ',nextStep:' Figure 2 '},'2026-10-29T10:00:00Z')).toEqual({progress:'Methods done',nextStep:'Figure 2',updatedAt:'2026-10-29T10:00:00Z'});
  });
  it('accepts web/mail links and rejects executable protocols',()=>{
    expect(normalizeMaterialUrl('https://example.com/paper')).toBe('https://example.com/paper');
    expect(normalizeMaterialUrl('mailto:person@example.com')).toBe('mailto:person@example.com');
    expect(normalizeMaterialUrl('javascript:alert(1)')).toBe('');
    expect(normalizeMaterialUrl('data:text/html,boom')).toBe('');
  });
});
