import { StrokeCalculator } from './modules/strokeCalculator.js';
import { FortuneGenerator } from './modules/fortuneGenerator.js';
import { AnimationController } from './modules/animationController.js';
import { UIController } from './modules/uiController.js';

const overlay = document.getElementById('animation-overlay');
const slot = document.getElementById('animation-slot');
const form = document.getElementById('fortune-form');
const input = document.getElementById('name-input');
const resultSection = document.getElementById('result-section');
const resultContainer = document.getElementById('result-content');

const animationController = new AnimationController({ overlay, slot });
const strokeCalculator = new StrokeCalculator();
const fortuneGenerator = new FortuneGenerator();

const uiController = new UIController({
  form,
  input,
  resultSection,
  resultContainer,
  strokeCalculator,
  fortuneGenerator,
  animationController,
});

uiController.mount();
