import type { CharacterAnalysis } from '../lib/analyzeName';
import FortuneBadge from './FortuneBadge';

interface CharacterListProps {
  characters: CharacterAnalysis[];
}

const partLabels: Record<CharacterAnalysis['part'], string> = {
  surname: '姓',
  given: '名',
};

const CharacterList = ({ characters }: CharacterListProps) => (
  <ul className="space-y-4">
    {characters.map(({ character, strokes, fortune, part }, index) => (
      <li
        key={`${character}-${index}`}
        className="flex items-center justify-between rounded-xl border border-stone-200 px-4 py-3"
      >
        <div>
          <div className="text-sm text-stone-500">{partLabels[part]}の文字</div>
          <div className="mt-1 text-2xl font-semibold text-stone-800">{character}</div>
          <div className="mt-1 text-sm text-stone-500">画数: {strokes}</div>
        </div>
        <FortuneBadge level={fortune} />
      </li>
    ))}
  </ul>
);

export default CharacterList;
