const BASE_STROKE = 3;
const STROKE_VARIATION = 23;

export function calculateCharacterStroke(char) {
  const codePoint = char.codePointAt(0);
  const weighted = (codePoint * 1315423911) >>> 0;
  return (weighted % STROKE_VARIATION) + BASE_STROKE;
}

export function calculateNameStrokes(text) {
  const characters = Array.from(text || '');
  const breakdown = characters.map((char) => ({
    char,
    strokes: calculateCharacterStroke(char)
  }));
  const total = breakdown.reduce((sum, item) => sum + item.strokes, 0);
  return { breakdown, total };
}
