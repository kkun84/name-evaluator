import { FormEvent, useMemo, useState } from 'react';
import CharacterList from './components/CharacterList';
import FortuneBadge from './components/FortuneBadge';
import SectionCard from './components/SectionCard';
import SectionSummary from './components/SectionSummary';
import { analyzeName, type NameAnalysis } from './lib/analyzeName';

const App = () => {
  const [surname, setSurname] = useState('');
  const [given, setGiven] = useState('');
  const [analysis, setAnalysis] = useState<NameAnalysis | null>(null);

  const isSubmitDisabled = useMemo(() => surname.trim() === '' || given.trim() === '', [surname, given]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitDisabled) {
      return;
    }
    setAnalysis(analyzeName(surname.trim(), given.trim()));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-200 via-stone-100 to-amber-100 pb-16">
      <header className="bg-white/80 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm tracking-[0.3em] text-amber-700">吉凶指南</p>
            <h1 className="mt-2 text-3xl font-semibold text-fortune-primary sm:text-4xl">姓名判断 光彩堂</h1>
          </div>
          {analysis ? (
            <div className="flex items-center gap-3 rounded-full border border-amber-200 bg-white/70 px-5 py-3">
              <span className="text-sm text-amber-700">総合運</span>
              <FortuneBadge level={analysis.full.fortune} size="lg" />
            </div>
          ) : null}
        </div>
      </header>

      <main className="mx-auto mt-10 flex max-w-5xl flex-col gap-8 px-6">
        <SectionCard
          title="お名前を入力してください"
          accent="姓と名それぞれの画数を基に、総合的な運勢を占います。"
        >
          <form className="flex flex-col gap-4 sm:flex-row" onSubmit={handleSubmit}>
            <div className="flex-1">
              <label className="text-sm font-medium text-stone-600" htmlFor="surname">
                姓
              </label>
              <input
                id="surname"
                value={surname}
                onChange={(event) => setSurname(event.target.value)}
                placeholder="例）山田"
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white/80 px-4 py-3 text-lg shadow-inner focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-stone-600" htmlFor="given">
                名
              </label>
              <input
                id="given"
                value={given}
                onChange={(event) => setGiven(event.target.value)}
                placeholder="例）花子"
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white/80 px-4 py-3 text-lg shadow-inner focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 text-base font-semibold text-white shadow-lg transition hover:brightness-105 disabled:cursor-not-allowed disabled:from-stone-300 disabled:to-stone-400"
              >
                鑑定する
              </button>
            </div>
          </form>
        </SectionCard>

        {analysis ? (
          <div className="grid gap-6 lg:grid-cols-[2fr,3fr]">
            <SectionCard title="総合結果" accent={`${surname}${given}さまの鑑定結果です。`}>
              <div className="space-y-6">
                <div className="rounded-2xl border border-amber-100 bg-white/70 p-6 text-center">
                  <div className="text-sm font-medium text-amber-700">総合運</div>
                  <div className="mt-3 text-4xl font-bold text-stone-900">
                    {analysis.full.strokes}画
                  </div>
                  <div className="mt-4 flex justify-center">
                    <FortuneBadge level={analysis.full.fortune} size="lg" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <SectionSummary section={analysis.surname} />
                  <SectionSummary section={analysis.given} />
                </div>
              </div>
            </SectionCard>
            <SectionCard title="文字ごとの鑑定" accent="各文字の画数と吉凶を一覧で表示します。">
              <CharacterList characters={analysis.characters} />
            </SectionCard>
          </div>
        ) : (
          <SectionCard title="鑑定の流れ">
            <ol className="list-decimal space-y-3 pl-5 text-sm leading-6 text-stone-600">
              <li>姓と名を入力し、鑑定ボタンを押してください。</li>
              <li>各文字の画数を算出し、姓名それぞれの総画数を計算します。</li>
              <li>画数に基づく独自の数理から吉凶を導き出します。</li>
              <li>総合運と各項目の詳細をカード形式で表示します。</li>
            </ol>
          </SectionCard>
        )}
      </main>
    </div>
  );
};

export default App;
