import { createNameApp } from './components/NameApp.js';
import { createEvaluationService } from './services/evaluationService.js';

const evaluationService = createEvaluationService();
const NameApp = createNameApp({ React: window.React, evaluationService });

const container = document.getElementById('app');
const root = window.ReactDOM.createRoot(container);
root.render(window.React.createElement(NameApp));
