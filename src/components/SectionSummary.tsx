import type { SectionAnalysis } from '../lib/analyzeName';
import FortuneBadge from './FortuneBadge';

interface SectionSummaryProps {
  section: SectionAnalysis;
}

const SectionSummary = ({ section }: SectionSummaryProps) => (
  <div className="flex flex-col items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3">
    <div className="text-sm font-medium text-amber-700">{section.label}</div>
    <div className="text-3xl font-bold text-stone-800">{section.strokes}画</div>
    <FortuneBadge level={section.fortune} size="lg" />
  </div>
);

export default SectionSummary;
