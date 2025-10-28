import { beforeEach, describe, expect, it, vi } from 'vitest';
import { calculateCharacterStroke, calculateNameStrokes } from '../src/utils/strokes.js';
import { clearStrokeCache } from '../src/utils/strokeLookup.js';

const SAMPLE_STROKES = {
  一: 1,
  二: 2,
  三: 3,
  四: 5,
  五: 4
};

function createFetchStub() {
  return vi.fn(async (url) => {
    const decodedChar = decodeURIComponent(url.split('/').pop());
    if (!(decodedChar in SAMPLE_STROKES)) {
      return {
        ok: false,
        status: 404,
        json: async () => ({})
      };
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({ stroke_count: SAMPLE_STROKES[decodedChar] })
    };
  });
}

describe('stroke calculation', () => {
  let fetchStub;

  beforeEach(() => {
    clearStrokeCache();
    fetchStub = createFetchStub();
  });

  it('retrieves canonical kanji stroke counts via the API', async () => {
    const strokes = await calculateCharacterStroke('一', { fetchImpl: fetchStub });
    expect(strokes).toBe(1);
    expect(fetchStub).toHaveBeenCalled();
  });

  it('returns consistent totals for known sequences', async () => {
    const result = await calculateNameStrokes('一二三四五', { fetchImpl: fetchStub });
    expect(result.total).toBe(1 + 2 + 3 + 5 + 4);
  });

  it('uses static data for non-kanji scripts', async () => {
    const kanaTotal = await calculateNameStrokes('あアa1', { fetchImpl: fetchStub });
    expect(kanaTotal.total).toBeGreaterThan(0);
    expect(fetchStub).not.toHaveBeenCalled();
  });
});
