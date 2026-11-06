
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

// Create the Free Library page.
renderFreeLayout();

// -------------------------------------
// Page elements
// -------------------------------------

const searchInput = document.querySelector('#topic-search');
const searchContainer = document.querySelector('.library-search');
const topicGrid = document.querySelector('#topic-grid');
const topicCount = document.querySelector('#topic-count');
const emptyMessage = document.querySelector('#empty-message');
const backButton = document.querySelector('#library-back');
const libraryTitle = document.querySelector('#library-title');
const practiceView = document.querySelector('#practice-view');
const librarySummary = document.querySelector('.library-summary');

// -------------------------------------
// Navigation state
// -------------------------------------

let currentCourse = null;
let currentSatCategory = null;
let currentPractice = null;
let currentDifficulty = 'easy';
let currentQuestion = null;

let premiumCheckInProgress = false;

// Wait until Firebase has determined the current user.
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

// -------------------------------------
// Course-specific Premium access
// -------------------------------------

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

    // Sign-in is required.
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

    // Check the user's Firestore profile.
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

    // Approval must match the clicked course.
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

    // Open only the approved Premium course.
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

// -------------------------------------
// Course and category navigation
// -------------------------------------

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
  ].some((value) =>
    String(value || '')
      .toLowerCase()
      .includes(normalized)
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

// -------------------------------------
// SAT practice page
// -------------------------------------

function renderPractice() {
  const practice = satPractices.find(
    (item) => item.id === currentPractice
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
// Free course library
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

  const searchQuery = searchInput.value;

  let items = [];
  let type = 'course';

  if (currentCourse === null) {
    items = freeCourses;
    type = 'course';

    libraryTitle.textContent = 'Explore Courses';

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
        (item) => item.categoryId === currentSatCategory
      );

      type = 'practice';

      const selectedCategory = satCategories.find(
        (item) => item.id === currentSatCategory
      );

      libraryTitle.textContent =
        selectedCategory?.title || 'SAT Math Practices';

      backButton.textContent =
        '← Back to SAT Math Practices';
    }

  } else {
    items = interactiveTopics.filter(
      (item) => item.courseId === currentCourse
    );

    type = 'topic';

    const course = freeCourses.find(
      (item) => item.id === currentCourse
    );

    libraryTitle.textContent =
      `${course?.title || 'Mathematics'} Topics`;

    backButton.hidden = false;
    backButton.textContent = '← Back to Courses';
  }

  const filtered = items.filter(
    (item) => matchesSearch(item, searchQuery)
  );

  topicGrid.replaceChildren(
    ...filtered.map((item) =>
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

// -------------------------------------
// Start the Free Library
// -------------------------------------

renderLibrary();
