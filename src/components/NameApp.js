export function createNameApp({ React, evaluationService }) {
  const { useState } = React;

  function renderStrokeList(label, metrics) {
    if (!metrics || metrics.breakdown.length === 0) {
      return React.createElement(
        'div',
        { className: 'stroke-group empty' },
        React.createElement('h3', null, label),
        React.createElement('p', null, '文字が入力されていません。')
      );
    }

    return React.createElement(
      'div',
      { className: 'stroke-group' },
      React.createElement('h3', null, label),
      React.createElement(
        'ul',
        null,
        metrics.breakdown.map((item, index) =>
          React.createElement(
            'li',
            { key: `${item.char}-${index}` },
            React.createElement('span', { className: 'char' }, item.char),
            React.createElement(
              'span',
              { className: 'char-details' },
              React.createElement('span', { className: 'stroke' }, `${item.strokes}画`),
              item.fortune
                ? React.createElement(
                    'span',
                    {
                      className: 'fortune-chip',
                      style: {
                        borderColor: item.fortune.accent,
                        color: item.fortune.accent
                      }
                    },
                    item.fortune.label
                  )
                : null
            )
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'stroke-total' },
        React.createElement('span', null, '合計'),
        React.createElement(
          'span',
          { className: 'char-details' },
          React.createElement('strong', null, `${metrics.total}画`),
          metrics.fortune
            ? React.createElement(
                'span',
                {
                  className: 'fortune-chip',
                  style: {
                    borderColor: metrics.fortune.accent,
                    color: metrics.fortune.accent
                  }
                },
                metrics.fortune.label
              )
            : null
        )
      )
    );
  }

  function NameApp() {
    const [surname, setSurname] = useState('');
    const [given, setGiven] = useState('');
    const [evaluation, setEvaluation] = useState(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    function updateInput(setter) {
      return (event) => {
        setter(event.target.value);
        setHasSubmitted(false);
        setEvaluation(null);
        setError(null);
      };
    }

    async function handleSubmit(event) {
      event.preventDefault();
      const trimmedSurname = surname.trim();
      const trimmedGiven = given.trim();

      if (!trimmedSurname && !trimmedGiven) {
        setEvaluation(null);
        setHasSubmitted(true);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const nextEvaluation = await evaluationService.evaluate({
          surname: trimmedSurname,
          given: trimmedGiven
        });
        setEvaluation(nextEvaluation);
      } catch (lookupError) {
        setEvaluation(null);
        setError('画数の取得に失敗しました。通信環境を確認してください。');
      } finally {
        setHasSubmitted(true);
        setIsLoading(false);
      }
    }

    const fortuneTone = evaluation && evaluation.fortunes ? evaluation.fortunes.full : null;

    return React.createElement(
      'div',
      { className: 'app-shell' },
      React.createElement(
        'header',
        null,
        React.createElement('h1', null, '姓名判断'),
        React.createElement('p', null, '日本の伝統的な姓名判断をモダンなUIでお届けします。')
      ),
      React.createElement(
        'main',
        null,
        React.createElement(
          'section',
          { className: 'form-section' },
          React.createElement(
            'form',
            { onSubmit: handleSubmit },
            React.createElement('label', { htmlFor: 'surname' }, '名字'),
            React.createElement('input', {
              id: 'surname',
              type: 'text',
              value: surname,
              onChange: updateInput(setSurname),
              placeholder: '山田'
            }),
            React.createElement('label', { htmlFor: 'given' }, '名前'),
            React.createElement('input', {
              id: 'given',
              type: 'text',
              value: given,
              onChange: updateInput(setGiven),
              placeholder: '太郎'
            }),
            React.createElement(
              'button',
              { type: 'submit', className: 'submit-button', disabled: isLoading },
              isLoading ? '取得中…' : '結果を表示'
            )
          ),
          hasSubmitted && fortuneTone && !error
            ? React.createElement(
                'div',
                { className: 'fortune-panel', style: { borderColor: fortuneTone.accent } },
                React.createElement('span', { className: 'fortune-label' }, fortuneTone.label),
                React.createElement(
                  'p',
                  { className: 'fortune-tone' },
                  `${fortuneTone.tone}の気配が感じられます。`
                )
              )
            : React.createElement(
                'div',
                { className: 'fortune-panel placeholder' },
                React.createElement(
                  'p',
                  null,
                  error
                    ? error
                    : '名字と名前を入力し、「結果を表示」を押すと結果が表示されます。'
                )
              )
        ),
        hasSubmitted
          ? React.createElement(
              'section',
              { className: 'result-section' },
              React.createElement(
                'div',
                { className: 'stroke-container' },
                renderStrokeList('名字の画数', evaluation && evaluation.surnameMetrics),
                renderStrokeList('名前の画数', evaluation && evaluation.givenMetrics)
              ),
              evaluation
                ? React.createElement(
                    'div',
                    { className: 'total-section' },
                    React.createElement('h3', null, '姓名全体の画数'),
                    React.createElement('div', { className: 'total-score' }, `${evaluation.total}画`),
                    fortuneTone
                      ? React.createElement(
                          'span',
                          {
                            className: 'fortune-chip prominent',
                            style: {
                              borderColor: fortuneTone.accent,
                              color: fortuneTone.accent
                            }
                          },
                          fortuneTone.label
                        )
                      : null
                  )
                : null
            )
          : null
      ),
      React.createElement(
        'footer',
        null,
        React.createElement(
          'p',
          null,
          '結果は画数に基づくアルゴリズムで算出しています。同じ名前には常に同じ結果が表示されます。'
        )
      )
    );
  }

  return NameApp;
}
