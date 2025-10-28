export class UIController {
  constructor({
    form,
    input,
    resultSection,
    resultContainer,
    strokeCalculator,
    fortuneGenerator,
    animationController,
  }) {
    this.form = form;
    this.input = input;
    this.resultSection = resultSection;
    this.resultContainer = resultContainer;
    this.strokeCalculator = strokeCalculator;
    this.fortuneGenerator = fortuneGenerator;
    this.animationController = animationController;
  }

  mount() {
    if (!this.form) {
      return;
    }
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleSubmit();
    });
  }

  async handleSubmit() {
    const name = this.input.value;
    const trimmed = name.trim();
    if (!trimmed) {
      this.input.focus();
      return;
    }
    const strokeSummary = this.strokeCalculator.calculate(trimmed);
    const fortune = this.fortuneGenerator.generate(trimmed, strokeSummary);
    this.resultSection.hidden = true;
    await this.animationController.playSequence([...fortune.title, '祝']);
    this.renderResult(trimmed, strokeSummary, fortune);
  }

  renderResult(name, strokeSummary, fortune) {
    const container = this.resultContainer;
    container.innerHTML = '';

    const summary = document.createElement('div');
    summary.className = 'result__summary';

    const title = document.createElement('p');
    title.className = 'result__title';
    title.textContent = fortune.title;

    const tagline = document.createElement('p');
    tagline.className = 'result__tagline';
    tagline.textContent = fortune.tagline;

    const description = document.createElement('p');
    description.className = 'result__description';
    description.textContent = fortune.description;

    const blessing = document.createElement('p');
    blessing.className = 'result__blessing';
    blessing.textContent = fortune.blessing;

    summary.append(title, tagline, description, blessing);

    const strokesCard = document.createElement('div');
    strokesCard.className = 'result__strokes';

    const strokesHeading = document.createElement('p');
    strokesHeading.className = 'result__strokes-heading';
    strokesHeading.textContent = `${name} の画数内訳`;

    const list = document.createElement('ul');
    list.className = 'strokes-list';

    strokeSummary.breakdown.forEach((entry) => {
      const item = document.createElement('li');
      item.className = 'strokes-item';

      const charLabel = document.createElement('span');
      charLabel.className = 'strokes-item__char';
      charLabel.textContent = entry.char;

      const countLabel = document.createElement('span');
      countLabel.className = 'strokes-item__count';
      countLabel.textContent = `${entry.strokes}画`;

      item.append(charLabel, countLabel);
      list.append(item);
    });

    const total = document.createElement('p');
    total.className = 'strokes-total';
    total.textContent = `総画数: ${strokeSummary.total}画`;

    strokesCard.append(strokesHeading, list, total);

    container.append(summary, strokesCard);
    this.resultSection.hidden = false;
    this.resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
