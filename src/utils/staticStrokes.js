const DAKUTEN_MARK = '\u3099';
const HANDAKUTEN_MARK = '\u309A';

const iterationMarks = new Map([
  ['ゝ', 2],
  ['ゞ', 4],
  ['ヽ', 2],
  ['ヾ', 4],
  ['々', 3],
  ['〃', 2],
  ['仝', 4]
]);

const soundMarks = new Map([
  ['ー', 1],
  ['ｰ', 1]
]);

const hiraganaBase = new Map([
  ['あ', 3],
  ['い', 2],
  ['う', 2],
  ['え', 3],
  ['お', 3],
  ['か', 3],
  ['き', 4],
  ['く', 1],
  ['け', 3],
  ['こ', 2],
  ['さ', 3],
  ['し', 1],
  ['す', 2],
  ['せ', 3],
  ['そ', 2],
  ['た', 4],
  ['ち', 2],
  ['つ', 1],
  ['て', 1],
  ['と', 2],
  ['な', 4],
  ['に', 3],
  ['ぬ', 2],
  ['ね', 4],
  ['の', 1],
  ['は', 3],
  ['ひ', 2],
  ['ふ', 4],
  ['へ', 1],
  ['ほ', 4],
  ['ま', 3],
  ['み', 3],
  ['む', 3],
  ['め', 2],
  ['も', 3],
  ['や', 3],
  ['ゆ', 2],
  ['よ', 2],
  ['ら', 2],
  ['り', 2],
  ['る', 2],
  ['れ', 2],
  ['ろ', 1],
  ['わ', 2],
  ['ゐ', 3],
  ['ゑ', 3],
  ['を', 3],
  ['ん', 1]
]);

const hiraganaSmall = new Map([
  ['ぁ', 'あ'],
  ['ぃ', 'い'],
  ['ぅ', 'う'],
  ['ぇ', 'え'],
  ['ぉ', 'お'],
  ['ゃ', 'や'],
  ['ゅ', 'ゆ'],
  ['ょ', 'よ'],
  ['ゎ', 'わ'],
  ['ゕ', 'か'],
  ['ゖ', 'け']
]);

const katakanaBase = new Map([
  ['ア', 2],
  ['イ', 2],
  ['ウ', 2],
  ['エ', 3],
  ['オ', 3],
  ['カ', 2],
  ['キ', 3],
  ['ク', 2],
  ['ケ', 3],
  ['コ', 2],
  ['サ', 3],
  ['シ', 3],
  ['ス', 2],
  ['セ', 3],
  ['ソ', 2],
  ['タ', 3],
  ['チ', 3],
  ['ツ', 3],
  ['テ', 3],
  ['ト', 2],
  ['ナ', 2],
  ['ニ', 2],
  ['ヌ', 2],
  ['ネ', 4],
  ['ノ', 1],
  ['ハ', 2],
  ['ヒ', 2],
  ['フ', 1],
  ['ヘ', 1],
  ['ホ', 4],
  ['マ', 2],
  ['ミ', 3],
  ['ム', 2],
  ['メ', 2],
  ['モ', 4],
  ['ヤ', 3],
  ['ユ', 2],
  ['ヨ', 3],
  ['ラ', 2],
  ['リ', 2],
  ['ル', 2],
  ['レ', 1],
  ['ロ', 2],
  ['ワ', 2],
  ['ヰ', 4],
  ['ヱ', 4],
  ['ヲ', 3],
  ['ン', 2],
  ['ヴ', 4]
]);

const katakanaSmall = new Map([
  ['ァ', 'ア'],
  ['ィ', 'イ'],
  ['ゥ', 'ウ'],
  ['ェ', 'エ'],
  ['ォ', 'オ'],
  ['ャ', 'ヤ'],
  ['ュ', 'ユ'],
  ['ョ', 'ヨ'],
  ['ヮ', 'ワ'],
  ['ヵ', 'カ'],
  ['ヶ', 'ケ']
]);

const digitStrokes = new Map([
  ['0', 1],
  ['1', 1],
  ['2', 2],
  ['3', 3],
  ['4', 3],
  ['5', 2],
  ['6', 1],
  ['7', 2],
  ['8', 2],
  ['9', 2]
]);

const latinBase = new Map([
  ['A', 3],
  ['B', 2],
  ['C', 1],
  ['D', 2],
  ['E', 4],
  ['F', 3],
  ['G', 2],
  ['H', 3],
  ['I', 1],
  ['J', 2],
  ['K', 3],
  ['L', 2],
  ['M', 4],
  ['N', 3],
  ['O', 1],
  ['P', 2],
  ['Q', 2],
  ['R', 3],
  ['S', 1],
  ['T', 2],
  ['U', 3],
  ['V', 2],
  ['W', 4],
  ['X', 2],
  ['Y', 3],
  ['Z', 3]
]);

const latinVariants = new Map([
  ['Ä', 'A'],
  ['Å', 'A'],
  ['Á', 'A'],
  ['À', 'A'],
  ['Â', 'A'],
  ['Ã', 'A'],
  ['Æ', 4],
  ['Ç', 'C'],
  ['É', 'E'],
  ['È', 'E'],
  ['Ê', 'E'],
  ['Ë', 'E'],
  ['Í', 'I'],
  ['Ì', 'I'],
  ['Î', 'I'],
  ['Ï', 'I'],
  ['Ñ', 'N'],
  ['Ó', 'O'],
  ['Ò', 'O'],
  ['Ô', 'O'],
  ['Õ', 'O'],
  ['Ö', 'O'],
  ['Ø', 2],
  ['Ú', 'U'],
  ['Ù', 'U'],
  ['Û', 'U'],
  ['Ü', 'U'],
  ['Ý', 'Y']
]);

const fullWidthOffset = 0xfee0;

function normalizeFullWidth(char) {
  const code = char.codePointAt(0);
  if (code >= 0xff10 && code <= 0xff19) {
    return String.fromCodePoint(code - fullWidthOffset);
  }
  if (code >= 0xff21 && code <= 0xff3a) {
    return String.fromCodePoint(code - fullWidthOffset);
  }
  if (code >= 0xff41 && code <= 0xff5a) {
    return String.fromCodePoint(code - fullWidthOffset);
  }
  return char;
}

function resolveLatin(char) {
  const normalized = normalizeFullWidth(char);
  const upper = normalized.toUpperCase();
  if (latinBase.has(upper)) {
    return latinBase.get(upper);
  }
  if (latinVariants.has(normalized)) {
    const mapped = latinVariants.get(normalized);
    if (typeof mapped === 'number') {
      return mapped;
    }
    return latinBase.get(mapped);
  }
  return undefined;
}

function resolveKana(char) {
  if (soundMarks.has(char)) {
    return soundMarks.get(char);
  }
  if (iterationMarks.has(char)) {
    return iterationMarks.get(char);
  }

  const normalized = char.normalize('NFD');
  const baseChar = normalized[0];
  const marks = normalized.slice(1);

  const hiraganaRef = hiraganaSmall.get(baseChar) || baseChar;
  if (hiraganaBase.has(hiraganaRef)) {
    let strokes = hiraganaBase.get(hiraganaRef);
    for (const mark of marks) {
      if (mark === DAKUTEN_MARK) {
        strokes += 2;
      } else if (mark === HANDAKUTEN_MARK) {
        strokes += 3;
      }
    }
    return strokes;
  }

  const katakanaRef = katakanaSmall.get(baseChar) || baseChar;
  if (katakanaBase.has(katakanaRef)) {
    let strokes = katakanaBase.get(katakanaRef);
    for (const mark of marks) {
      if (mark === DAKUTEN_MARK) {
        strokes += 2;
      } else if (mark === HANDAKUTEN_MARK) {
        strokes += 3;
      }
    }
    return strokes;
  }

  return undefined;
}

const asciiPunctuation = new Map([
  ['-', 1],
  ['_', 1],
  ['.', 1],
  [',', 1],
  ['!', 1],
  ['?', 1],
  ['&', 2],
  ['@', 2],
  ['#', 4],
  ['%', 3],
  ['+', 2],
  ['=', 2],
  ['*', 4],
  ['/', 1],
  ['\\', 1],
  ['~', 1],
  ['^', 1],
  ['|', 1],
  ['(', 1],
  [')', 1],
  ['[', 2],
  [']', 2],
  ['{', 3],
  ['}', 3],
  ['<', 1],
  ['>', 1],
  [':', 2],
  [';', 2],
  ['"', 2],
  ['\'\'', 1]
]);

const kanjiFallback = new Map([
  ['一', 1],
  ['二', 2],
  ['三', 3],
  ['四', 5],
  ['五', 4],
  ['六', 4],
  ['七', 2],
  ['八', 2],
  ['九', 2],
  ['十', 2],
  ['〇', 1]
]);

export function getStaticStrokeCount(char) {
  if (!char) {
    return 0;
  }
  if (/\s/u.test(char)) {
    return 0;
  }
  const normalizedFullWidth = normalizeFullWidth(char);
  if (digitStrokes.has(normalizedFullWidth)) {
    return digitStrokes.get(normalizedFullWidth);
  }
  const latinValue = resolveLatin(char);
  if (latinValue !== undefined) {
    return latinValue;
  }
  const kanaValue = resolveKana(char);
  if (kanaValue !== undefined) {
    return kanaValue;
  }
  if (asciiPunctuation.has(normalizedFullWidth)) {
    return asciiPunctuation.get(normalizedFullWidth);
  }
  return undefined;
}

export function hasStaticStroke(char) {
  return getStaticStrokeCount(char) !== undefined;
}

export function getKanjiFallbackStroke(char) {
  return kanjiFallback.get(char);
}
