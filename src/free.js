
import './style.css';
import './free.css';

import {
  freeCourses,
  interactiveTopics,
  satCategories,
  satPractices
} from './data/library-data.js';

import { renderFreeLayout } from './components/free-layout.js';
import { createCard } from './components/course-card.js';
import { renderSatPractice } from './components/sat-practice.js';
import { renderSatQuestionPage } from './components/sat-question-page.js';

// Build the page before selecting its elements.
renderFreeLayout();

const searchInput = document.querySelector('#topic-search');
const searchContainer = document.querySelector('.library-search');
const topicGrid = document.querySelector('#topic-grid');
const topicCount = document.querySelector('#topic-count');
const emptyMessage = document.querySelector('#empty-message');
const backButton = document.querySelector('#library-back');
const libraryTitle = document.querySelector('#library-title');
const practiceView = document.querySelector('#practice-view');
const librarySummary = document.querySelector('.library-summary');

let currentCourse = null;
let currentSatCategory = null;
let currentPractice = null;
let currentDifficulty = 'easy';
let currentQuestion = null;

// -------------------------------------
// Course and category navigation
// -------------------------------------

function handleCardNavigation(type, item) {
  if (type === 'course') {
    currentCourse = item.id;
    currentSatCategory = null;
    currentPractice = null;
    currentQuestion = null;
  } else if (type === 'sat-category') {
    currentSatCategory = item.id;
    currentPractice = null;
    currentQuestion = null;
  } else if (type === 'practice') {
    currentPractice = item.id;
    currentDifficulty = 'easy';
    currentQuestion = null;
  }

  searchInput.value = '';
  renderLibrary();
}

// -------------------------------------
// Search
// -------------------------------------

function matchesSearch(item, query) {
  const normalized = query.trim().toLowerCase();

  return [
    item.title,
    item.category,
    item.description
  ].some(value =>
    String(value || '').toLowerCase().includes(normalized)
  );
}

// -------------------------------------
// Individual SAT question
// -------------------------------------

function showQuestion(questionId) {
  const success = renderSatQuestionPage({
    container: practiceView,
    questionId,
    practiceId: currentPractice,
    difficulty: currentDifficulty
  });

  if (!success) {
    return;
  }

  currentQuestion = questionId;

  topicGrid.hidden = true;
  librarySummary.hidden = true;
  searchContainer.hidden = true;
  emptyMessage.hidden = true;
  practiceView.hidden = false;

  backButton.hidden = false;
  backButton.textContent = '← Back to Questions';
}

// -------------------------------------
// SAT practice page
// -------------------------------------

function renderPractice() {
  const practice = satPractices.find(
    item => item.id === currentPractice
  );

  if (!practice) {
    currentPractice = null;
    currentQuestion = null;
    renderLibrary();
    return;
  }

  topicGrid.hidden = true;
  librarySummary.hidden = true;
  searchContainer.hidden = true;
  emptyMessage.hidden = true;
  practiceView.hidden = false;

  backButton.hidden = false;

  if (currentQuestion !== null) {
    showQuestion(currentQuestion);
    return;
  }

  backButton.textContent = '← Back to SAT Algebra';

  renderSatPractice({
    container: practiceView,
    practice,
    initialDifficulty: currentDifficulty,

    onDifficultyChange(difficulty) {
      currentDifficulty = difficulty;
    },

    onQuestionSelect(questionId) {
      showQuestion(questionId);
    }
  });
}

// -------------------------------------
// Free library
// -------------------------------------

function renderLibrary() {
  if (currentPractice !== null) {
    renderPractice();
    return;
  }

  practiceView.hidden = true;
  topicGrid.hidden = false;
  librarySummary.hidden = false;
  searchContainer.hidden = false;

  const query = searchInput.value;

  let items = [];
  let type = 'course';

  if (currentCourse === null) {
    items = freeCourses;
    type = 'course';

    libraryTitle.textContent = 'Explore Free Courses';

    backButton.hidden = true;
    backButton.textContent = '← Back to Courses';

  } else if (currentCourse === 'sat-math') {
    backButton.hidden = false;

    if (currentSatCategory === null) {
      items = satCategories;
      type = 'sat-category';

      libraryTitle.textContent = 'SAT Math Practices';
      backButton.textContent = '← Back to Courses';

    } else {
      items = satPractices.filter(
        item => item.categoryId === currentSatCategory
      );

      type = 'practice';

      const selectedCategory = satCategories.find(
        item => item.id === currentSatCategory
      );

      libraryTitle.textContent =
        selectedCategory?.title || 'SAT Math Practices';

      backButton.textContent =
        '← Back to SAT Math Practices';
    }

  } else {
    items = interactiveTopics.filter(
      item => item.courseId === currentCourse
    );

    type = 'topic';

    const course = freeCourses.find(
      item => item.id === currentCourse
    );

    libraryTitle.textContent =
      `${course?.title || 'Mathematics'} Topics`;

    backButton.hidden = false;
    backButton.textContent = '← Back to Courses';
  }

  const filtered = items.filter(
    item => matchesSearch(item, query)
  );

  topicGrid.replaceChildren(
    ...filtered.map(item =>
      createCard(item, type, handleCardNavigation)
    )
  );

  let countLabel;

  if (type === 'course') {
    countLabel = filtered.length === 1
      ? 'course'
      : 'courses';
  } else if (type === 'sat-category') {
    countLabel = filtered.length === 1
      ? 'category'
      : 'categories';
  } else if (type === 'practice') {
    countLabel = filtered.length === 1
      ? 'practice'
      : 'practices';
  } else {
    countLabel = filtered.length === 1
      ? 'interactive visual'
      : 'interactive visuals';
  }

  topicCount.textContent =
    `${filtered.length} ${countLabel}`;

  emptyMessage.hidden = filtered.length !== 0;

  if (filtered.length === 0 && !query.trim()) {
    if (type === 'practice') {
      emptyMessage.textContent =
        'Practice questions will be added here soon.';
    } else {
      emptyMessage.textContent =
        'No mathematics content has been added yet.';
    }
  } else {
    emptyMessage.textContent =
      'No matching mathematics content found.';
  }
}

// -------------------------------------
// Event listeners
// -------------------------------------

searchInput.addEventListener('input', renderLibrary);

backButton.addEventListener('click', () => {
  if (currentQuestion !== null) {
    currentQuestion = null;
  } else if (currentPractice !== null) {
    currentPractice = null;
  } else if (
    currentCourse === 'sat-math' &&
    currentSatCategory !== null
  ) {
    currentSatCategory = null;
  } else {
    currentCourse = null;
    currentSatCategory = null;
  }

  searchInput.value = '';
  renderLibrary();
});

// Start the Free Library.
renderLibrary();
