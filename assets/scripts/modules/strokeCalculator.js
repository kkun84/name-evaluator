import { strokeMap } from '../../data/strokeData.js';

export class StrokeCalculator {
  constructor(options = {}) {
    this.map = options.map ?? strokeMap;
    this.fallbackBase = options.fallbackBase ?? 6;
  }

  calculate(name) {
    const characters = Array.from(name.trim()).filter((char) => char.trim().length > 0);
    const breakdown = characters.map((char) => ({
      char,
      strokes: this.lookup(char),
    }));
    const total = breakdown.reduce((sum, entry) => sum + entry.strokes, 0);
    return { breakdown, total };
  }

  lookup(char) {
    const normalized = char.normalize('NFKC');
    if (this.map[normalized] != null) {
      return this.map[normalized];
    }
    return this.estimate(normalized);
  }

  estimate(char) {
    const codePoint = char.codePointAt(0) ?? 0;
    const variation = (codePoint % 9) + 3;
    return variation + this.fallbackBase;
  }
}
