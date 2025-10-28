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
            React.createElement('span', { className: 'stroke' }, `${item.strokes}画`)
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'stroke-total' },
        React.createElement('span', null, '合計'),
        React.createElement('strong', null, `${metrics.total}画`)
      )
    );
  }

  function NameApp() {
    const [surname, setSurname] = useState('');
    const [given, setGiven] = useState('');
    const [evaluation, setEvaluation] = useState(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    function updateInput(setter) {
      return (event) => {
        setter(event.target.value);
        setHasSubmitted(false);
        setEvaluation(null);
      };
    }

    function handleSubmit(event) {
      event.preventDefault();
      const trimmedSurname = surname.trim();
      const trimmedGiven = given.trim();

      if (!trimmedSurname && !trimmedGiven) {
        setEvaluation(null);
        setHasSubmitted(true);
        return;
      }

      const nextEvaluation = evaluationService.evaluate({
        surname: trimmedSurname,
        given: trimmedGiven
      });

      setEvaluation(nextEvaluation);
      setHasSubmitted(true);
    }

    const fortuneTone = evaluation ? evaluation.fortune : null;

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
            React.createElement('label', { htmlFor: 'surname' }, '苗字'),
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
              { type: 'submit', className: 'submit-button' },
              '結果を表示'
            )
          ),
          hasSubmitted && fortuneTone
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
                  '苗字と名前を入力し、「結果を表示」を押すと結果が表示されます。'
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
                renderStrokeList('苗字の画数', evaluation && evaluation.surnameMetrics),
                renderStrokeList('名前の画数', evaluation && evaluation.givenMetrics)
              ),
              evaluation
                ? React.createElement(
                    'div',
                    { className: 'total-section' },
                    React.createElement('h3', null, '姓名全体の画数'),
                    React.createElement('strong', null, `${evaluation.total}画`)
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
