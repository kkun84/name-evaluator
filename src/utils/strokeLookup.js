import { getKanjiFallbackStroke, getStaticStrokeCount } from './staticStrokes.js';

const KANJI_API_BASE = 'https://kanjiapi.dev/v1/kanji';
const fetchCache = new Map();

class StrokeLookupError extends Error {
  constructor(char, cause) {
    super(`Failed to determine stroke count for "${char}".`);
    this.name = 'StrokeLookupError';
    this.char = char;
    this.cause = cause;
  }
}

async function fetchKanjiStrokeCount(char, fetchImpl) {
  if (!fetchImpl) {
    throw new Error('Fetch implementation is not available.');
  }
  const url = `${KANJI_API_BASE}/${encodeURIComponent(char)}`;
  const response = await fetchImpl(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Unexpected response: ${response.status}`);
  }
  const payload = await response.json();
  if (!payload || typeof payload.stroke_count !== 'number') {
    throw new Error('API payload did not include stroke_count.');
  }
  return payload.stroke_count;
}

export async function resolveStrokeCount(char, options = {}) {
  const { fetchImpl = globalThis.fetch } = options;
  if (!char) {
    return 0;
  }
  if (fetchCache.has(char)) {
    return fetchCache.get(char);
  }
  const staticCount = getStaticStrokeCount(char);
  if (staticCount !== undefined) {
    fetchCache.set(char, staticCount);
    return staticCount;
  }
  try {
    const strokeCount = await fetchKanjiStrokeCount(char, fetchImpl);
    fetchCache.set(char, strokeCount);
    return strokeCount;
  } catch (error) {
    const fallback = getKanjiFallbackStroke(char);
    if (fallback !== undefined) {
      fetchCache.set(char, fallback);
      return fallback;
    }
    throw new StrokeLookupError(char, error);
  }
}

export function clearStrokeCache() {
  fetchCache.clear();
}

export { StrokeLookupError };
