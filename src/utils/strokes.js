const API_BASE_URL = 'https://kanjiapi.dev/v1/kanji';

function createCache() {
  return new Map();
}

function resolveFetch(fetchImplementation) {
  if (fetchImplementation) {
    return fetchImplementation;
  }
  if (typeof globalThis.fetch === 'function') {
    return globalThis.fetch.bind(globalThis);
  }
  throw new Error('A fetch implementation is required to resolve stroke counts.');
}

function buildKanjiUrl(char) {
  return `${API_BASE_URL}/${encodeURIComponent(char)}`;
}

/**
 * Estimate stroke count for a character if API lookup fails.
 * Uses Unicode ranges for CJK characters to provide a better estimate.
 * - CJK Unified Ideographs: average ~10 strokes
 * - Hiragana: average ~3 strokes
 * - Katakana: average ~3 strokes
 * - Hangul Syllables: average ~2 strokes
 * Returns 0 for whitespace, 1 for other characters.
 */
function fallbackStrokeCount(char) {
  if (!char || /\s/.test(char)) {
    return 0;
  }
  const code = char.codePointAt(0);
  // CJK Unified Ideographs
  if (
    (code >= 0x4E00 && code <= 0x9FFF) || // CJK Unified Ideographs
    (code >= 0x3400 && code <= 0x4DBF) || // CJK Unified Ideographs Extension A
    (code >= 0x20000 && code <= 0x2A6DF) || // Extension B
    (code >= 0x2A700 && code <= 0x2B73F) || // Extension C
    (code >= 0x2B740 && code <= 0x2B81F) || // Extension D
    (code >= 0x2B820 && code <= 0x2CEAF) || // Extension E
    (code >= 0xF900 && code <= 0xFAFF) // CJK Compatibility Ideographs
  ) {
    return 10;
  }
  // Hiragana
  if (code >= 0x3040 && code <= 0x309F) {
    return 3;
  }
  // Katakana
  if (code >= 0x30A0 && code <= 0x30FF) {
    return 3;
  }
  // Hangul Syllables
  if (code >= 0xAC00 && code <= 0xD7AF) {
    return 2;
  }
  return 1;
}

export function createStrokeResolver({ fetchImplementation } = {}) {
  const fetchFn = resolveFetch(fetchImplementation);
  const cache = createCache();

  async function getStrokeCount(char) {
    if (!char) {
      return 0;
    }

    if (cache.has(char)) {
      return cache.get(char);
    }

    let response;
    try {
      response = await fetchFn(buildKanjiUrl(char));
    } catch (error) {
      const fallback = fallbackStrokeCount(char);
      cache.set(char, fallback);
      return fallback;
    }

    if (!response.ok) {
      const fallback = fallbackStrokeCount(char);
      cache.set(char, fallback);
      return fallback;
    }

    const payload = await response.json();
    const strokeCount = payload?.stroke_count;

    if (typeof strokeCount !== 'number') {
      const fallback = fallbackStrokeCount(char);
      cache.set(char, fallback);
      return fallback;
    }

    cache.set(char, strokeCount);
    return strokeCount;
  }

  async function calculateNameStrokes(text) {
    const characters = Array.from(text || '');
    const breakdown = await Promise.all(
      characters.map(async (char) => ({
        char,
        strokes: await getStrokeCount(char)
      }))
    );
    const total = breakdown.reduce((sum, item) => sum + item.strokes, 0);
    return { breakdown, total };
  }

  return {
    getStrokeCount,
    calculateNameStrokes
  };
}

export const defaultStrokeResolver = createStrokeResolver();
