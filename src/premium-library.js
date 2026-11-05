
import { collection, getDocs } from 'firebase/firestore';

import './lesson-viewer.css';
import { renderLessonViewer } from './lesson-viewer.js';

const CALCULUS_ID = 'calculus';

const calculusCourse = {
  id: CALCULUS_ID,
  title: 'Calculus',
  category: 'Premium Course',
  description:
    'Explore limits, derivatives, integrals, and advanced calculus through detailed lessons and interactive visuals.',
  icon: '∫'
};

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

export function createPremiumLibrary(container, db) {
  let topics = [];
  let lessons = [];

  let currentView = 'courses';
  let selectedTopic = null;
  let selectedLesson = null;
  let searchTerm = '';
  let destroyed = false;

  let cleanupLessonVisual = () => {};

  container.innerHTML = `
    <section class="premium-library">
      <div class="premium-library-heading">
        <h2>Premium Mathematics</h2>
        <p>
          Discover advanced mathematics through structured
          lessons, interactive graphs, and diagrams.
        </p>
      </div>

      <div class="premium-library-controls">
        <button
          id="library-back"
          type="button"
          hidden
        >
          ← Back
        </button>

        <input
          id="library-search"
          type="search"
          placeholder="Search mathematics topics..."
          aria-label="Search premium mathematics"
          autocomplete="off"
        />
      </div>

      <div class="library-summary">
        <h2 id="premium-section-title">
          Explore Premium Courses
        </h2>

        <span id="premium-item-count"></span>
      </div>

      <div id="library-breadcrumb"></div>

      <div id="library-content" aria-live="polite"></div>
    </section>
  `;

  const content = container.querySelector('#library-content');
  const breadcrumb = container.querySelector('#library-breadcrumb');
  const backButton = container.querySelector('#library-back');
  const searchInput = container.querySelector('#library-search');
  const sectionTitle = container.querySelector('#premium-section-title');
  const itemCount = container.querySelector('#premium-item-count');

  function cleanupCurrentVisual() {
    cleanupLessonVisual();
    cleanupLessonVisual = () => {};
  }

  function matchesSearch(item) {
    const text = [
      item.title || '',
      item.category || '',
      item.description || ''
    ].join(' ').toLowerCase();

    return text.includes(searchTerm);
  }

  function createCard(item, type) {
    const icon =
      type === 'course'
        ? '∫'
        : type === 'topic'
          ? '📘'
          : '📖';

    const category =
      type === 'course'
        ? 'PREMIUM COURSE'
        : type === 'topic'
          ? 'CALCULUS TOPIC'
          : 'PREMIUM LESSON';

    const action =
      type === 'course'
        ? 'Explore Calculus →'
        : type === 'topic'
          ? 'Explore Topic →'
          : 'Open Lesson →';

    return `
      <button
        class="premium-library-card"
        type="button"
        data-type="${type}"
        data-id="${escapeHTML(item.id)}"
      >
        <span class="premium-library-icon">
          ${icon}
        </span>

        <span class="premium-library-card-text">
          <span class="topic-category">
            ${category}
          </span>

          <strong>
            ${escapeHTML(item.title || 'Untitled')}
          </strong>

          <small>
            ${escapeHTML(item.description || '')}
          </small>
        </span>

        <span class="topic-action">
          ${action}
        </span>
      </button>
    `;
  }

  function makeCards(items, type) {
    if (!items.length) {
      return `
        <div class="library-empty">
          <h3>Nothing here yet</h3>
          <p>
            Content will appear here when it is added.
          </p>
        </div>
      `;
    }

    return `
      <div class="premium-library-grid">
        ${items.map((item) =>
          createCard(item, type)
        ).join('')}
      </div>
    `;
  }

  function updateCount(count, label) {
    itemCount.textContent =
      count === 1
        ? `1 ${label}`
        : `${count} ${label}s`;
  }

  function render() {
    if (destroyed) return;

    cleanupCurrentVisual();

    backButton.hidden = currentView === 'courses';
    searchInput.hidden = currentView === 'viewer';

    if (currentView === 'courses') {
      const courses = [calculusCourse].filter(matchesSearch);

      sectionTitle.textContent = 'Explore Premium Courses';
      breadcrumb.textContent = '';
      updateCount(courses.length, 'course');

      content.innerHTML = makeCards(courses, 'course');

    } else if (currentView === 'topics') {
      const matchingTopics = topics
        .filter((topic) => topic.courseId === CALCULUS_ID)
        .filter(matchesSearch);

      sectionTitle.textContent = 'Calculus Topics';
      breadcrumb.textContent = 'Calculus';
      updateCount(matchingTopics.length, 'topic');

      content.innerHTML = makeCards(
        matchingTopics,
        'topic'
      );

    } else if (currentView === 'lessons') {
      const matchingLessons = lessons
        .filter((lesson) =>
          lesson.courseId === CALCULUS_ID &&
          lesson.topicId === selectedTopic?.id
        )
        .filter(matchesSearch);

      sectionTitle.textContent =
        selectedTopic?.title || 'Calculus Lessons';

      breadcrumb.textContent =
        `Calculus / ${selectedTopic?.title || 'Topic'}`;

      updateCount(matchingLessons.length, 'lesson');

      content.innerHTML = makeCards(
        matchingLessons,
        'lesson'
      );

    } else if (currentView === 'viewer') {
      sectionTitle.textContent =
        selectedLesson?.title || 'Lesson';

      breadcrumb.textContent =
        `Calculus / ${selectedTopic?.title || 'Topic'} / ${selectedLesson?.title || 'Lesson'}`;

      itemCount.textContent = '';

      cleanupLessonVisual = renderLessonViewer(
        content,
        selectedLesson
      );
    }
  }

  function handleCardClick(event) {
    if (destroyed) return;

    const card = event.target.closest(
      '[data-type][data-id]'
    );

    if (!card || !content.contains(card)) return;

    const { type, id } = card.dataset;

    if (type === 'course') {
      if (id !== CALCULUS_ID) return;

      selectedTopic = null;
      selectedLesson = null;
      currentView = 'topics';

    } else if (type === 'topic') {
      selectedTopic = topics.find(
        (topic) =>
          topic.id === id &&
          topic.courseId === CALCULUS_ID
      );

      if (!selectedTopic) return;

      selectedLesson = null;
      currentView = 'lessons';

    } else if (type === 'lesson') {
      selectedLesson = lessons.find(
        (lesson) =>
          lesson.id === id &&
          lesson.courseId === CALCULUS_ID &&
          lesson.topicId === selectedTopic?.id
      );

      if (!selectedLesson) return;

      currentView = 'viewer';

    } else {
      return;
    }

    searchTerm = '';
    searchInput.value = '';

    render();
  }

  function handleBackClick() {
    if (destroyed) return;

    if (currentView === 'viewer') {
      currentView = 'lessons';
      selectedLesson = null;

    } else if (currentView === 'lessons') {
      currentView = 'topics';
      selectedTopic = null;

    } else {
      currentView = 'courses';
      selectedTopic = null;
      selectedLesson = null;
    }

    searchTerm = '';
    searchInput.value = '';

    render();
  }

  function handleSearch() {
    if (destroyed) return;

    searchTerm = searchInput.value
      .trim()
      .toLowerCase();

    render();
  }

  content.addEventListener('click', handleCardClick);
  backButton.addEventListener('click', handleBackClick);
  searchInput.addEventListener('input', handleSearch);

  async function load() {
    try {
      const results = await Promise.all([
        getDocs(collection(db, 'topics')),
        getDocs(collection(db, 'lessons'))
      ]);

      if (destroyed) return;

      const convert = (snapshot) =>
        snapshot.docs.map((document) => ({
          ...document.data(),
          id: document.id
        }));

      topics = convert(results[0]);
      lessons = convert(results[1]);

      const byOrder = (a, b) =>
        (a.order ?? 0) - (b.order ?? 0);

      topics.sort(byOrder);
      lessons.sort(byOrder);

      render();

    } catch (error) {
      if (destroyed) return;

      console.error(
        'Premium library loading failed:',
        error
      );

      /*
        The Calculus course remains visible,
        but its topics and lessons cannot be
        loaded until Firestore access works.
      */
      topics = [];
      lessons = [];

      render();

      const notice = document.createElement('p');
      notice.className = 'empty-message';
      notice.setAttribute('role', 'alert');
      notice.textContent =
        'Unable to load premium lesson data. Please check your Firestore permissions.';

      content.append(notice);
    }
  }

  // Show the Calculus course immediately.
  render();

  // Load available Calculus topics and lessons.
  load();

  return {
    destroy() {
      if (destroyed) return;

      destroyed = true;

      cleanupCurrentVisual();

      content.removeEventListener(
        'click',
        handleCardClick
      );

      backButton.removeEventListener(
        'click',
        handleBackClick
      );

      searchInput.removeEventListener(
        'input',
        handleSearch
      );

      container.replaceChildren();

      topics = [];
      lessons = [];
      selectedTopic = null;
      selectedLesson = null;
      searchTerm = '';
    }
  };
}
