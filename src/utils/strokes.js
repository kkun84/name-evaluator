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

function fallbackStrokeCount(char) {
  if (!char || /\s/.test(char)) {
    return 0;
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
