import { evaluateFortune } from './fortuneEvaluator';
import { type FortuneLevel } from './fortuneLevels';
import { computeStrokeCount, computeTotalStrokes } from './strokeCalculator';

export type NamePart = 'surname' | 'given';

export interface CharacterAnalysis {
  character: string;
  strokes: number;
  fortune: FortuneLevel;
  part: NamePart;
}

export interface SectionAnalysis {
  label: string;
  strokes: number;
  fortune: FortuneLevel;
}

export interface NameAnalysis {
  surname: SectionAnalysis;
  given: SectionAnalysis;
  full: SectionAnalysis;
  characters: CharacterAnalysis[];
}

const toCharacterAnalysis = (character: string, part: NamePart): CharacterAnalysis => {
  const strokes = computeStrokeCount(character);
  return {
    character,
    part,
    strokes,
    fortune: evaluateFortune(strokes, 'character'),
  };
};

const buildSectionAnalysis = (label: string, strokes: number, scope: 'surname' | 'given' | 'full') => ({
  label,
  strokes,
  fortune: evaluateFortune(strokes, scope),
});

export const analyzeName = (surname: string, given: string): NameAnalysis => {
  const surnameCharacters = Array.from(surname, (character) => toCharacterAnalysis(character, 'surname'));
  const givenCharacters = Array.from(given, (character) => toCharacterAnalysis(character, 'given'));

  const surnameStrokes = computeTotalStrokes(surname);
  const givenStrokes = computeTotalStrokes(given);
  const fullStrokes = surnameStrokes + givenStrokes;

  return {
    surname: buildSectionAnalysis('姓の画数', surnameStrokes, 'surname'),
    given: buildSectionAnalysis('名の画数', givenStrokes, 'given'),
    full: buildSectionAnalysis('総画数', fullStrokes, 'full'),
    characters: [...surnameCharacters, ...givenCharacters],
  };
};
