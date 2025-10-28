import { describe, expect, it, vi } from 'vitest';
import { createStrokeResolver } from '../src/utils/strokes.js';

describe('createStrokeResolver fallback strokes', () => {
  it('uses predefined counts when the API request fails', async () => {
    const failingFetch = vi.fn(async () => {
      throw new Error('Network unavailable');
    });
    const resolver = createStrokeResolver({ fetchImplementation: failingFetch });

    const result = await resolver.calculateNameStrokes('一二三四五');

    expect(result.breakdown).toEqual([
      { char: '一', strokes: 1 },
      { char: '二', strokes: 2 },
      { char: '三', strokes: 3 },
      { char: '四', strokes: 5 },
      { char: '五', strokes: 4 }
    ]);
    expect(result.total).toBe(15);
    expect(failingFetch).toHaveBeenCalled();
  });
});
