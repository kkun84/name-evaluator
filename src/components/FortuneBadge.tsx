import type { FortuneLevel } from '../lib/fortuneLevels';

const fortuneColors: Record<FortuneLevel, string> = {
  大吉: 'bg-amber-500 text-white',
  中吉: 'bg-emerald-500 text-white',
  吉: 'bg-teal-500 text-white',
  小吉: 'bg-sky-500 text-white',
  凶: 'bg-slate-600 text-white',
  大凶: 'bg-stone-800 text-white',
};

interface FortuneBadgeProps {
  level: FortuneLevel;
  size?: 'md' | 'lg';
}

const sizeStyles: Record<NonNullable<FortuneBadgeProps['size']>, string> = {
  md: 'text-sm px-3 py-1 rounded-full',
  lg: 'text-xl px-5 py-2 rounded-full',
};

const FortuneBadge = ({ level, size = 'md' }: FortuneBadgeProps) => (
  <span className={`${fortuneColors[level]} ${sizeStyles[size]} font-semibold tracking-wide`}>{level}</span>
);

export default FortuneBadge;
