
import { satQuestions } from '../sat-questions.js';
import { renderSatQuestion } from '../sat-question-viewer.js';

/**
 * Render an individual SAT Math question page.
 *
 * @param {Object} options
 * @param {HTMLElement} options.container
 * @param {string} options.questionId
 * @param {string} options.practiceId
 * @param {string} options.difficulty
 * @returns {boolean} Whether a matching question was found.
 */
export function renderSatQuestionPage({
  container,
  questionId,
  practiceId,
  difficulty
}) {
  const question = satQuestions.find(
    item =>
      item.id === questionId &&
      item.practiceId === practiceId &&
      item.difficulty === difficulty
  );

  if (!question) {
    return false;
  }

  container.replaceChildren();

  const heading = document.createElement('h2');
  heading.textContent = question.number;
  heading.style.fontSize = 'clamp(24px, 3vw, 34px)';
  heading.style.marginBottom = '8px';

  const type = document.createElement('p');
  type.textContent = question.type;
  type.style.color = '#64748b';
  type.style.marginBottom = '25px';

  const viewer = document.createElement('div');
  viewer.className = 'sat-question-viewer';

  container.append(heading, type, viewer);

  renderSatQuestion(viewer, questionId);

  return true;
}
