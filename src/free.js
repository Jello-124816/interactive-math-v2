
import './style.css';
import './free.css';

import {
  onAuthStateChanged
} from 'firebase/auth';

import {
  doc,
  getDoc
} from 'firebase/firestore';

import {
  auth,
  db
} from './firebase.js';

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

const base = import.meta.env.BASE_URL;

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

const pageHeading = document.querySelector('.library-heading h1');
const pageDescription = document.querySelector('.library-heading p');
const homeBackLink = document.querySelector('.back-link');

const originalHeading = pageHeading?.textContent || '';
const originalDescription = pageDescription?.textContent || '';

const backLinksRow = document.createElement('div');
backLinksRow.className = 'library-back-links';
backLinksRow.style.display = 'flex';
backLinksRow.style.alignItems = 'center';
backLinksRow.style.flexWrap = 'wrap';
backLinksRow.style.columnGap = '22px';
backLinksRow.style.rowGap = '8px';
backLinksRow.style.position = 'sticky';
backLinksRow.style.top = '12px';
backLinksRow.style.zIndex = '20';
backLinksRow.style.background = '#f5f7fb';
backLinksRow.style.padding = '8px 0';
backLinksRow.style.marginBottom = '20px';

searchContainer.after(backLinksRow);

backLinksRow.append(homeBackLink, backButton);

homeBackLink.style.marginRight = '0';
homeBackLink.style.marginBottom = '0';
homeBackLink.style.position = 'static';
homeBackLink.style.top = '';
homeBackLink.style.zIndex = '';
homeBackLink.style.background = '';
homeBackLink.style.padding = '0';

backButton.style.marginBottom = '0';
backButton.style.verticalAlign = '';

let currentCourse = null;
let currentSatCategory = null;
let currentPractice = null;
let currentDifficulty = 'easy';
let currentQuestion = null;

let premiumCheckInProgress = false;

const urlParams = new URLSearchParams(window.location.search);

const requestedCourse = urlParams.get('course');
const requestedCategory = urlParams.get('category');

if (requestedCourse === 'sat-math') {
  currentCourse = 'sat-math';

  if (
    requestedCategory &&
    satCategories.some(
      item => item.id === requestedCategory
    )
  ) {
    currentSatCategory = requestedCategory;
  }
}

const authReady = new Promise((resolve) => {
  const unsubscribe = onAuthStateChanged(
    auth,
    () => {
      unsubscribe();
      resolve();
    },
    () => {
      unsubscribe();
      resolve();
    }
  );
});

async function openPremiumCourse(course) {
  if (premiumCheckInProgress) return;

  const validCourseIds = [
    'algebra',
    'geometry',
    'sat-math'
  ];

  if (!course || !validCourseIds.includes(course.id)) {
    window.alert('Unknown Premium course.');
    return;
  }

  premiumCheckInProgress = true;

  try {
    await authReady;

    const user = auth.currentUser;

    if (!user) {
      const goToAccount = window.confirm(
        'Please sign in with Google to access Premium mathematics courses.\n\n' +
        'Would you like to open the Account page?'
      );

      if (goToAccount) {
        window.location.href = `${base}account.html`;
      }

      return;
    }

    const userReference = doc(
      db,
      'users',
      user.uid
    );

    const userSnapshot = await getDoc(userReference);

    if (!userSnapshot.exists()) {
      window.alert(
        'Your account has not been set up for Premium access yet.\n\n' +
        'Please contact the administrator.'
      );

      return;
    }

    const userData = userSnapshot.data();

    const isAdmin = userData.role === 'admin';

    const approvedCourses =
      userData.approvedCourses &&
      typeof userData.approvedCourses === 'object'
        ? userData.approvedCourses
        : {};

    const approved =
      isAdmin ||
      approvedCourses[course.id] === true;

    if (!approved) {
      window.alert(
        `You do not have Premium access to ${course.title} yet.\n\n` +
        'Premium courses require individual administrator approval.'
      );

      return;
    }

    window.location.href =
      `${base}premium.html?course=${encodeURIComponent(course.id)}`;

  } catch (error) {
    console.error('Premium access error:', error);

    window.alert(
      'Unable to verify your Premium access right now.\n\n' +
      'Please try again later.'
    );

  } finally {
    premiumCheckInProgress = false;
  }
}

function handleCardNavigation(type, item) {
  if (type === 'premium') {
    openPremiumCourse(item);
    return;
  }

  if (type === 'course') {
    currentCourse = item.id;
    currentSatCategory = null;
    currentPractice = null;
    currentDifficulty = 'easy';
    currentQuestion = null;

  } else if (type === 'sat-category') {
    currentSatCategory = item.id;
    currentPractice = null;
    currentDifficulty = 'easy';
    currentQuestion = null;

  } else if (type === 'practice') {
    window.location.href =
      `${base}sat-practice.html?practice=${encodeURIComponent(item.id)}`;

    return;
  }

  searchInput.value = '';
  renderLibrary();
}

function matchesSearch(item, query) {
  const normalized = query.trim().toLowerCase();

  return [
    item.title,
    item.category,
    item.description
  ].some((value) =>
    String(value || '')
      .toLowerCase()
      .includes(normalized)
  );
}

function showQuestion(questionId) {
  const success = renderSatQuestionPage({
    container: practiceView,
    questionId,
    practiceId: currentPractice,
    difficulty: currentDifficulty
  });

  if (!success) return;

  currentQuestion = questionId;

  topicGrid.hidden = true;
  librarySummary.hidden = true;
  searchContainer.hidden = true;
  emptyMessage.hidden = true;
  practiceView.hidden = false;

  backButton.hidden = false;
  backButton.textContent = '← Back to Questions';
}

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

function updatePageIntroduction() {
  if (!pageHeading || !pageDescription) return;

  if (
    currentCourse === 'sat-math' &&
    currentSatCategory !== null
  ) {
    const selectedCategory = satCategories.find(
      item => item.id === currentSatCategory
    );

    pageHeading.textContent =
      selectedCategory?.title || 'SAT Math Practices';

    pageDescription.hidden = true;

  } else if (currentCourse === 'sat-math') {
    pageHeading.textContent = 'SAT Math Practice & Preparation';

    pageDescription.textContent =
      'Practice SAT Math with topic-based questions organized by difficulty. ' +
      'Strengthen your problem-solving skills through clear, step-by-step ' +
      'solutions and prepare confidently for the Digital SAT.';

    pageDescription.hidden = false;

  } else {
    pageHeading.textContent = originalHeading;
    pageDescription.textContent = originalDescription;
    pageDescription.hidden = false;
  }
}

function renderLibrary() {
  updatePageIntroduction();

  if (currentPractice !== null) {
    renderPractice();
    return;
  }

  practiceView.hidden = true;
  topicGrid.hidden = false;
  librarySummary.hidden = false;
  searchContainer.hidden = false;

  const searchQuery = searchInput.value;

  let items = [];
  let type = 'course';

  if (currentCourse === null) {
    items = freeCourses;
    type = 'course';

    libraryTitle.textContent = 'Explore Courses';
    libraryTitle.hidden = false;

    backButton.hidden = true;
    backButton.textContent = '← Back to Courses';

  } else if (currentCourse === 'sat-math') {
    backButton.hidden = false;

    if (currentSatCategory === null) {
      items = satCategories;
      type = 'sat-category';

      libraryTitle.textContent = 'SAT Math Practices';
      libraryTitle.hidden = false;

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

      libraryTitle.hidden = true;

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

    libraryTitle.hidden = false;

    backButton.hidden = false;
    backButton.textContent = '← Back to Courses';
  }

  const filtered = items.filter(
    item => matchesSearch(item, searchQuery)
  );

  topicGrid.replaceChildren(
    ...filtered.map(item =>
      createCard(item, type, handleCardNavigation)
    )
  );

  let countLabel;

  if (type === 'course') {
    countLabel =
      filtered.length === 1 ? 'course' : 'courses';

  } else if (type === 'sat-category') {
    countLabel =
      filtered.length === 1 ? 'category' : 'categories';

  } else if (type === 'practice') {
    countLabel =
      filtered.length === 1 ? 'practice' : 'practices';

  } else {
    countLabel =
      filtered.length === 1 ? 'topic' : 'topics';
  }

  topicCount.textContent =
    `${filtered.length} ${countLabel}`;

  emptyMessage.hidden = filtered.length !== 0;

  if (filtered.length === 0 && !searchQuery.trim()) {
    if (type === 'practice') {
      emptyMessage.textContent =
        'Practice questions will be added here soon.';
    } else {
      emptyMessage.textContent =
        'More mathematics content will be added soon.';
    }
  } else {
    emptyMessage.textContent =
      'No matching mathematics content found.';
  }
}

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

renderLibrary();
