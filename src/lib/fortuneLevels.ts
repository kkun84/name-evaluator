export const fortuneLevels = [
  '大吉',
  '中吉',
  '吉',
  '小吉',
  '凶',
  '大凶',
] as const;

export type FortuneLevel = (typeof fortuneLevels)[number];
