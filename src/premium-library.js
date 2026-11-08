
import {
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';

import { renderLessonViewer } from './lesson-viewer.js';
import './lesson-viewer.css';

const PREMIUM_COURSES = {
  algebra: {
    id: 'algebra',
    title: 'Algebra',
    category: 'Premium Course',
    description:
      'Explore advanced algebra through premium mathematics lessons.',
    icon: '📈'
  },

  geometry: {
    id: 'geometry',
    title: 'Geometry',
    category: 'Premium Course',
    description:
      'Explore geometry through premium lessons and interactive diagrams.',
    icon: '📐'
  },

  'sat-math': {
    id: 'sat-math',
    title: 'SAT Math Practices',
    category: 'Premium Course',
    description:
      'Practice SAT mathematics through premium questions and lessons.',
    icon: '📝'
  },

  'interactive-visualizations': {
    id: 'interactive-visualizations',
    title: 'Interactive Visualizations',
    category: 'Premium Course',
    description:
      'Explore mathematics through premium interactive visualizations, diagrams, and lessons.',
    icon: '📊'
  }
};

export function createPremiumLibrary(container, db, courseId) {
  const selectedCourse = PREMIUM_COURSES[courseId];

  if (!selectedCourse) {
    throw new Error('Unknown Premium course.');
  }

  let topics = [];
  let lessons = [];

  // Start directly with the selected course's topics.
  let view = 'topics';

  let selectedTopic = null;
  let selectedLesson = null;

  let searchQuery = '';
  let destroyed = false;
  let cleanupVisual = () => {};

  const base = import.meta.env.BASE_URL;

  container.innerHTML = `
    <div class="library-heading">
      <h1>${selectedCourse.title} Premium</h1>
      <p>${selectedCourse.description}</p>
    </div>

    <div class="library-search">
      <label for="premium-topic-search">
        Find a Premium topic or lesson
      </label>

      <input
        id="premium-topic-search"
        type="search"
        placeholder="Search Premium topics..."
        autocomplete="off"
      />
    </div>

    <button
      id="premium-library-back"
      type="button"
      hidden
      style="
        border: none;
        background: transparent;
        color: #2563eb;
        font-family: inherit;
        font-size: 16px;
        font-weight: 700;
        padding: 0;
        margin-bottom: 20px;
        cursor: pointer;
      "
    >
      ← Back
    </button>

    <div class="library-summary">
      <h2 id="premium-library-title">
        ${selectedCourse.title} Topics
      </h2>

      <span id="premium-topic-count"></span>
    </div>

    <div
      id="premium-library-breadcrumb"
      style="
        margin-bottom: 18px;
        color: #64748b;
        font-size: 14px;
      "
    ></div>

    <div
      id="premium-topic-grid"
      class="topic-grid"
    ></div>

    <p
      id="premium-empty-message"
      class="empty-message"
      hidden
    >
      No matching Premium mathematics content found.
    </p>

    <div id="premium-lesson-content"></div>

    <p
      id="premium-library-error"
      role="alert"
      hidden
    ></p>
  `;

  const $ = (selector) => container.querySelector(selector);

  const searchInput = $('#premium-topic-search');
  const topicGrid = $('#premium-topic-grid');
  const topicCount = $('#premium-topic-count');
  const emptyMessage = $('#premium-empty-message');

  const backButton = $('#premium-library-back');
  const libraryTitle = $('#premium-library-title');
  const breadcrumb = $('#premium-library-breadcrumb');

  const lessonContent = $('#premium-lesson-content');
  const errorMessage = $('#premium-library-error');

  function matches(item) {
    return [
      item.title,
      item.category,
      item.description
    ].some((value) =>
      String(value || '')
        .toLowerCase()
        .includes(searchQuery)
    );
  }

  function createTopicCard(item, type) {
    const card = document.createElement('article');
    card.className = 'topic-card';

    const icon = document.createElement('div');
    icon.className = 'topic-icon';

    icon.textContent =
      type === 'topic' ? '📘' : '📖';

    const category = document.createElement('span');
    category.className = 'topic-category';

    category.textContent =
      type === 'topic'
        ? `${selectedCourse.title} Topic`
        : 'Premium Lesson';

    const title = document.createElement('h3');
    title.className = 'topic-title';
    title.textContent = item.title || 'Untitled';

    const description = document.createElement('p');
    description.className = 'topic-description';
    description.textContent = item.description || '';

    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'topic-card-button';

    action.textContent =
      type === 'topic'
        ? 'Explore →'
        : 'Open →';

    Object.assign(action.style, {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
      marginTop: '18px',
      padding: '11px 20px',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontFamily: 'inherit',
      fontSize: '15px',
      fontWeight: '600',
      lineHeight: '1.4',
      cursor: 'pointer',
      transition:
        'background-color 0.2s ease, transform 0.2s ease'
    });

    action.addEventListener('mouseenter', () => {
      action.style.backgroundColor = '#1d4ed8';
      action.style.transform = 'translateY(-2px)';
    });

    action.addEventListener('mouseleave', () => {
      action.style.backgroundColor = '#2563eb';
      action.style.transform = 'translateY(0)';
    });

    action.addEventListener('click', () => {
      if (destroyed) return;

      if (type === 'topic') {
        openTopic(item.id);
      } else {
        openLesson(item.id);
      }
    });

    card.append(
      icon,
      category,
      title,
      description,
      action
    );

    return card;
  }

  function renderCards(items, type) {
    const filtered = items.filter(matches);

    topicGrid.replaceChildren(
      ...filtered.map((item) =>
        createTopicCard(item, type)
      )
    );

    topicCount.textContent =
      `${filtered.length} ${type}${filtered.length === 1 ? '' : 's'}`;

    emptyMessage.hidden = filtered.length !== 0;
  }

  function render() {
    if (destroyed) return;

    cleanupVisual();
    cleanupVisual = () => {};

    topicGrid.replaceChildren();
    lessonContent.replaceChildren();

    topicGrid.hidden = false;
    emptyMessage.hidden = true;

    searchInput.parentElement.hidden =
      view === 'viewer';

    backButton.hidden =
      view === 'topics';

    if (view === 'topics') {
      libraryTitle.textContent =
        `${selectedCourse.title} Topics`;

      breadcrumb.textContent =
        selectedCourse.title;

      renderCards(topics, 'topic');

    } else if (view === 'lessons') {
      libraryTitle.textContent =
        selectedTopic?.title || 'Premium Lessons';

      breadcrumb.textContent =
        `${selectedCourse.title} / ${selectedTopic?.title || ''}`;

      renderCards(
        lessons.filter((item) =>
          item.topicId === selectedTopic?.id
        ),
        'lesson'
      );

    } else if (view === 'viewer') {
      libraryTitle.textContent =
        selectedLesson?.title || 'Premium Lesson';

      breadcrumb.textContent =
        `${selectedCourse.title} / ${selectedTopic?.title || ''} / ${selectedLesson?.title || ''}`;

      topicCount.textContent = '';

      topicGrid.hidden = true;

      if (selectedLesson) {
        cleanupVisual =
          renderLessonViewer(
            lessonContent,
            selectedLesson
          ) || (() => {});
      }
    }
  }

  function openTopic(topicId) {
    selectedTopic = topics.find(
      (item) =>
        item.id === topicId &&
        item.courseId === selectedCourse.id
    );

    if (!selectedTopic) return;

    selectedLesson = null;
    view = 'lessons';

    clearSearch();
    render();
  }

  function openLesson(lessonId) {
    if (!selectedTopic) return;

    selectedLesson = lessons.find(
      (item) =>
        item.id === lessonId &&
        item.courseId === selectedCourse.id &&
        item.topicId === selectedTopic.id
    );

    if (!selectedLesson) return;

    view = 'viewer';

    clearSearch();
    render();
  }

  function clearSearch() {
    searchQuery = '';
    searchInput.value = '';
  }

  function handleBack() {
    if (view === 'viewer') {
      view = 'lessons';
      selectedLesson = null;

    } else if (view === 'lessons') {
      view = 'topics';
      selectedTopic = null;

    } else {
      // Return to the main Explore page.
      window.location.href = `${base}explore.html`;
      return;
    }

    clearSearch();
    render();
  }

  function handleSearch() {
    searchQuery = searchInput.value
      .trim()
      .toLowerCase();

    render();
  }

  backButton.addEventListener('click', handleBack);
  searchInput.addEventListener('input', handleSearch);

  async function load() {
    errorMessage.hidden = true;

    try {
      // Fetch only the selected course's topics.
      const topicsQuery = query(
        collection(db, 'topics'),
        where('courseId', '==', selectedCourse.id)
      );

      // Fetch only the selected course's lessons.
      const lessonsQuery = query(
        collection(db, 'lessons'),
        where('courseId', '==', selectedCourse.id)
      );

      const [topicSnapshot, lessonSnapshot] =
        await Promise.all([
          getDocs(topicsQuery),
          getDocs(lessonsQuery)
        ]);

      if (destroyed) return;

      topics = topicSnapshot.docs.map((document) => ({
        ...document.data(),
        id: document.id
      }));

      lessons = lessonSnapshot.docs.map((document) => ({
        ...document.data(),
        id: document.id
      }));

      const byOrder = (a, b) =>
        (a.order ?? 0) - (b.order ?? 0);

      topics.sort(byOrder);
      lessons.sort(byOrder);

      render();

    } catch (error) {
      if (destroyed) return;

      console.error('Premium library error:', error);

      errorMessage.textContent =
        'Unable to load Premium content. Please check your course approval and Firestore permissions.';

      errorMessage.hidden = false;

      topicGrid.replaceChildren();
      topicCount.textContent = '';
      emptyMessage.hidden = true;
    }
  }

  render();
  load();

  return {
    destroy() {
      if (destroyed) return;

      destroyed = true;

      cleanupVisual();

      backButton.removeEventListener(
        'click',
        handleBack
      );

      searchInput.removeEventListener(
        'input',
        handleSearch
      );

      container.replaceChildren();
    }
  };
}
