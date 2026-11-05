
import { satQuestions } from '../sat-questions.js';

const difficulties = ['easy', 'medium', 'hard'];

export function renderSatPractice({
  container,
  practice,
  initialDifficulty = 'easy',
  onDifficultyChange,
  onQuestionSelect
}) {
  container.replaceChildren();

  const heading = document.createElement('h2');
  heading.textContent = practice.title;
  heading.style.fontSize = 'clamp(24px, 3vw, 34px)';
  heading.style.marginBottom = '12px';

  const introduction = document.createElement('p');
  introduction.textContent =
    'Choose a difficulty level to explore SAT Math practice questions.';
  introduction.style.color = '#64748b';
  introduction.style.marginBottom = '28px';

  const tabs = document.createElement('div');
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Practice difficulty');
  tabs.style.display = 'flex';
  tabs.style.gap = '10px';
  tabs.style.flexWrap = 'wrap';
  tabs.style.borderBottom = '1px solid #e2e8f0';
  tabs.style.marginBottom = '28px';

  const panel = document.createElement('section');
  panel.id = 'difficulty-panel';
  panel.setAttribute('role', 'tabpanel');
  panel.tabIndex = 0;

  const buttons = [];

  function updateDifficulty(difficulty) {
    onDifficultyChange(difficulty);

    buttons.forEach(button => {
      const active =
        button.dataset.difficulty === difficulty;

      button.setAttribute(
        'aria-selected',
        String(active)
      );

      button.tabIndex = active ? 0 : -1;
      button.style.color =
        active ? '#2563eb' : '#64748b';

      button.style.borderBottom = active
        ? '3px solid #2563eb'
        : '3px solid transparent';

      button.style.fontWeight =
        active ? '750' : '600';

      if (active) {
        panel.setAttribute(
          'aria-labelledby',
          button.id
        );
      }
    });

    const label =
      difficulty.charAt(0).toUpperCase() +
      difficulty.slice(1);

    panel.replaceChildren();

    const title = document.createElement('h3');
    title.textContent = `${label} Practice`;
    title.style.fontSize = '23px';
    title.style.marginBottom = '20px';

    panel.append(title);

    const questions = satQuestions.filter(
      question =>
        question.practiceId === practice.id &&
        question.difficulty === difficulty
    );

    if (questions.length === 0) {
      const empty = document.createElement('p');
      empty.textContent =
        'Questions will be added here soon.';
      empty.style.color = '#64748b';
      panel.append(empty);
      return;
    }

    questions.forEach(question => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'sat-question-row';

      const number = document.createElement('strong');
      number.textContent = question.number;

      const type = document.createElement('span');
      type.textContent = question.type;

      const arrow = document.createElement('span');
      arrow.textContent = '→';
      arrow.setAttribute('aria-hidden', 'true');

      card.append(number, type, arrow);

      card.addEventListener('click', () => {
        onQuestionSelect(question.id);
      });

      panel.append(card);
    });
  }

  difficulties.forEach(difficulty => {
    const button = document.createElement('button');

    const label =
      difficulty.charAt(0).toUpperCase() +
      difficulty.slice(1);

    button.type = 'button';
    button.textContent = label;
    button.dataset.difficulty = difficulty;
    button.id = `difficulty-tab-${difficulty}`;

    button.setAttribute('role', 'tab');
    button.setAttribute(
      'aria-controls',
      'difficulty-panel'
    );

    button.style.background = 'transparent';
    button.style.border = 'none';
    button.style.padding = '12px 22px';
    button.style.cursor = 'pointer';
    button.style.font = 'inherit';
    button.style.fontSize = '16px';

    button.addEventListener('click', () => {
      updateDifficulty(difficulty);
    });

    button.addEventListener('keydown', event => {
      if (
        event.key !== 'ArrowRight' &&
        event.key !== 'ArrowLeft' &&
        event.key !== 'Home' &&
        event.key !== 'End'
      ) {
        return;
      }

      event.preventDefault();

      const index = difficulties.indexOf(difficulty);
      let nextIndex = index;

      if (event.key === 'ArrowRight') {
        nextIndex = (index + 1) % difficulties.length;
      } else if (event.key === 'ArrowLeft') {
        nextIndex =
          (index - 1 + difficulties.length) %
          difficulties.length;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = difficulties.length - 1;
      }

      updateDifficulty(difficulties[nextIndex]);
      buttons[nextIndex].focus();
    });

    buttons.push(button);
    tabs.append(button);
  });

  container.append(
    heading,
    introduction,
    tabs,
    panel
  );

  const startingDifficulty =
    difficulties.includes(initialDifficulty)
      ? initialDifficulty
      : 'easy';

  updateDifficulty(startingDifficulty);
}
