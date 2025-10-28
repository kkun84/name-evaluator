export const FORTUNE_DEFINITIONS = Object.freeze([
  Object.freeze({ key: 'excellent', label: '大吉', tone: 'success', accent: '#d9333f' }),
  Object.freeze({ key: 'grand', label: '大大吉', tone: 'radiance', accent: '#ef8f2b' }),
  Object.freeze({ key: 'supreme', label: '大大大吉', tone: 'brilliance', accent: '#f6c445' })
]);

export function getFortunes() {
  return FORTUNE_DEFINITIONS.map((fortune) => ({ ...fortune }));
}
