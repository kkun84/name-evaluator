import { resolveStrokeCount } from './strokeLookup.js';

export async function calculateCharacterStroke(char, options) {
  return resolveStrokeCount(char, options);
}

export async function calculateNameStrokes(text, options) {
  const characters = Array.from(text || '');
  const breakdown = await Promise.all(
    characters.map(async (char) => ({
      char,
      strokes: await calculateCharacterStroke(char, options)
    }))
  );
  const total = breakdown.reduce((sum, item) => sum + item.strokes, 0);
  return { breakdown, total };
}
