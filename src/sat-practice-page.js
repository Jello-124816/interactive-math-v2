
import './style.css';
import './math-content.css';

import { satPractices } from './data/library-data.js';
import { renderFreeLayout } from './components/explore-layout.js';
import { renderSatPractice } from './components/sat-practice.js';
import { renderSatQuestionPage } from './components/sat-question-page.js';

const base = import.meta.env.BASE_URL;
const params = new URLSearchParams(window.location.search);

const practiceId = params.get('practice');

const practice = satPractices.find(
  item => item.id === practiceId
);

let currentDifficulty = 'easy';
let currentQuestion = null;

renderFreeLayout();

const searchContainer = document.querySelector('.library-search');
const topicGrid = document.querySelector('#topic-grid');
const emptyMessage = document.querySelector('#empty-message');
const backButton = document.querySelector('#library-back');
const practiceView = document.querySelector('#practice-view');
const librarySummary = document.querySelector('.library-summary');

const heading = document.querySelector('.library-heading');
const homeBackLink = document.querySelector('.back-link');

searchContainer.hidden = true;
topicGrid.hidden = true;
emptyMessage.hidden = true;
practiceView.hidden = false;

if (librarySummary) {
  librarySummary.remove();
}

if (heading) {
  heading.hidden = true;
}

if (homeBackLink) {
  homeBackLink.remove();
}

const backLinksRow = document.createElement('div');
backLinksRow.className = 'sat-practice-back-links';

backLinksRow.style.display = 'flex';
backLinksRow.style.alignItems = 'center';
backLinksRow.style.flexWrap = 'wrap';
backLinksRow.style.position = 'sticky';
backLinksRow.style.top = '12px';
backLinksRow.style.zIndex = '20';
backLinksRow.style.background = '#f5f7fb';
backLinksRow.style.padding = '8px 0';
backLinksRow.style.marginBottom = '20px';

backButton.before(backLinksRow);
backLinksRow.append(backButton);

backButton.hidden = false;
backButton.style.marginBottom = '0';

function getLibraryUrl() {
  return `${base}explore.html?course=sat-math&category=${
    encodeURIComponent(practice?.categoryId || '')
  }`;
}

function renderQuestion() {
  if (!practice || !currentQuestion) {
    return false;
  }

  const success = renderSatQuestionPage({
    container: practiceView,
    questionId: currentQuestion,
    practiceId: practice.id,
    difficulty: currentDifficulty,
    onQuestionNavigate(next) {
      currentDifficulty = next.difficulty;
      currentQuestion = next.id;
      renderQuestion();
    }
  });

  if (!success) {
    return false;
  }

  backButton.textContent = '← Back to Questions';

  document.title = 'SAT Math Question | Mathematics';

  return true;
}

function renderPracticeLibrary() {
  if (!practice) {
    backButton.textContent = '← Back to SAT Math Practices';

    practiceView.replaceChildren();

    const message = document.createElement('p');
    message.textContent =
      'This SAT Math practice library could not be found.';

    practiceView.append(message);

    document.title = 'SAT Math Practice | Mathematics';

    return;
  }

  currentQuestion = null;

  backButton.textContent = '← Back to SAT Algebra';

  document.title = `${practice.title} | SAT Math Practice`;

  renderSatPractice({
    container: practiceView,
    practice,
    initialDifficulty: currentDifficulty,

    onDifficultyChange(difficulty) {
      currentDifficulty = difficulty;
    },

    onQuestionSelect(questionId) {
      currentQuestion = questionId;

      const success = renderQuestion();

      if (!success) {
        currentQuestion = null;
        renderPracticeLibrary();
      }
    }
  });
}

backButton.addEventListener('click', () => {
  if (currentQuestion !== null) {
    renderPracticeLibrary();
    return;
  }

  window.location.href = getLibraryUrl();
});

renderPracticeLibrary();
