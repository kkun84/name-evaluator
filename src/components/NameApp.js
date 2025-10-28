export function createNameApp({ React, evaluationService }) {
  const { useState } = React;

  function renderFortuneChip(fortune, className = '') {
    if (!fortune) {
      return null;
    }

    const classes = ['fortune-chip'];
    if (className) {
      classes.push(className);
    }

    return React.createElement('span', {
      className: classes.join(' '),
      style: { borderColor: fortune.accent, color: fortune.accent }
    }, fortune.label);
  }

  function renderStrokeGroup(label, metrics) {
    if (!metrics || metrics.breakdown.length === 0) {
      return React.createElement(
        'section',
        { className: 'stroke-card empty' },
        React.createElement('h3', null, label),
        React.createElement('p', null, '文字が入力されていません。')
      );
    }

    return React.createElement(
      'section',
      { className: 'stroke-card' },
      React.createElement('h3', null, label),
      React.createElement(
        'ul',
        null,
        metrics.breakdown.map((item, index) =>
          React.createElement(
            'li',
            { key: `${item.char}-${index}` },
            React.createElement('span', { className: 'stroke-char' }, item.char),
            React.createElement(
              'span',
              { className: 'stroke-meta' },
              React.createElement('span', { className: 'stroke-count' }, `${item.strokes}画`),
              renderFortuneChip(item.fortune)
            )
          )
        )
      ),
      React.createElement(
        'footer',
        { className: 'stroke-total' },
        React.createElement('span', null, '合計'),
        React.createElement(
          'span',
          { className: 'stroke-meta' },
          React.createElement('strong', null, `${metrics.total}画`),
          renderFortuneChip(metrics.fortune)
        )
      )
    );
  }

  function NameApp() {
    const [surname, setSurname] = useState('');
    const [given, setGiven] = useState('');
    const [evaluation, setEvaluation] = useState(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [hasPendingChanges, setHasPendingChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    function updateInput(setter) {
      return (event) => {
        setter(event.target.value);
        if (hasSubmitted && evaluation) {
          setHasPendingChanges(true);
        }
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
        setHasPendingChanges(false);
        setIsLoading(false);
        setError(null);
        return;
      }

      setHasPendingChanges(false);
      setIsLoading(true);
      setError(null);

      try {
        const nextEvaluation = await evaluationService.evaluate({
          surname: trimmedSurname,
          given: trimmedGiven
        });
        setEvaluation(nextEvaluation);
        setHasSubmitted(true);
        setHasPendingChanges(false);
      } catch (lookupError) {
        setEvaluation(null);
        setError('画数の取得に失敗しました。通信環境を確認してください。');
        setHasSubmitted(true);
        setHasPendingChanges(false);
      } finally {
        setIsLoading(false);
      }
    }

    const fortuneTone = evaluation && evaluation.fortunes ? evaluation.fortunes.full : null;

    function renderSummaryCard() {
      const classNames = ['results-summary'];
      const style = fortuneTone && !error ? { borderColor: fortuneTone.accent } : {};

      if (!fortuneTone || error) {
        classNames.push('placeholder');
      }

      if (error) {
        return React.createElement(
          'section',
          { className: classNames.join(' '), style },
          React.createElement('p', { className: 'summary-message error' }, error)
        );
      }

      if (!hasSubmitted) {
        return React.createElement(
          'section',
          { className: classNames.join(' '), style },
          React.createElement(
            'p',
            { className: 'summary-message muted' },
            '姓名を入力して「結果を表示」を押すと、総合結果がここに表示されます。'
          )
        );
      }

      if (!evaluation) {
        return React.createElement(
          'section',
          { className: classNames.join(' '), style },
          React.createElement('p', { className: 'summary-message muted' }, '文字が入力されていません。')
        );
      }

      return React.createElement(
        'section',
        { className: classNames.join(' '), style },
        React.createElement('div', { className: 'summary-header' }, renderFortuneChip(fortuneTone, 'prominent')),
        React.createElement(
          'div',
          { className: 'summary-score' },
          React.createElement('span', { className: 'summary-score-value' }, `${evaluation.total}画`),
          React.createElement('span', { className: 'summary-score-caption' }, '姓名全体の画数')
        ),
        hasPendingChanges
          ? React.createElement(
              'p',
              { className: 'pending-hint' },
              '入力内容が変更されています。最新の結果を表示するには「結果を表示」を押してください。'
            )
          : null
      );
    }

    function renderDetailCard() {
      if (!evaluation) {
        const message = hasSubmitted
          ? '入力された文字がありません。姓名を入力して結果を確認してください。'
          : 'ここに詳細な結果が表示されます。';

        return React.createElement(
          'section',
          { className: 'results-detail placeholder' },
          React.createElement('p', null, message)
        );
      }

      return React.createElement(
        'section',
        { className: 'results-detail' },
        React.createElement(
          'header',
          { className: 'detail-overview' },
          React.createElement('h2', null, '画数の内訳'),
          React.createElement(
            'div',
            { className: 'detail-total' },
            React.createElement('span', { className: 'detail-total-label' }, '姓名全体'),
            React.createElement('span', { className: 'detail-total-value' }, `${evaluation.total}画`)
          )
        ),
        React.createElement(
          'div',
          { className: 'stroke-columns' },
          renderStrokeGroup('名字の画数', evaluation.surnameMetrics),
          renderStrokeGroup('名前の画数', evaluation.givenMetrics)
        )
      );
    }

    return React.createElement(
      'div',
      { className: 'name-app' },
      React.createElement(
        'header',
        { className: 'app-header' },
        React.createElement('h1', null, '姓名判断'),
        React.createElement('p', null, '名字と名前を入力して画数を調べましょう。')
      ),
      React.createElement(
        'main',
        { className: 'app-main' },
        React.createElement(
          'section',
          { className: 'form-section' },
          React.createElement(
            'form',
            { className: 'name-form', onSubmit: handleSubmit },
            React.createElement(
              'div',
              { className: 'input-row' },
              React.createElement(
                'div',
                { className: 'input-field' },
                React.createElement('label', { htmlFor: 'surname' }, '名字'),
                React.createElement('input', {
                  id: 'surname',
                  type: 'text',
                  value: surname,
                  onChange: updateInput(setSurname),
                  placeholder: '山田'
                })
              ),
              React.createElement(
                'div',
                { className: 'input-field' },
                React.createElement('label', { htmlFor: 'given' }, '名前'),
                React.createElement('input', {
                  id: 'given',
                  type: 'text',
                  value: given,
                  onChange: updateInput(setGiven),
                  placeholder: '太郎'
                })
              ),
              React.createElement(
                'div',
                { className: 'submit-field' },
                React.createElement(
                  'button',
                  { type: 'submit', className: 'submit-button', disabled: isLoading },
                  isLoading ? '取得中…' : '結果を表示'
                )
              )
            )
          )
        ),
        React.createElement(
          'section',
          { className: 'results-section' },
          React.createElement(
            'div',
            { className: 'results-layout' },
            renderSummaryCard(),
            renderDetailCard()
          )
        )
      )
    );
  }

  return NameApp;
}
