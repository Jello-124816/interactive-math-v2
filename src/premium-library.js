
import { collection, getDocs } from 'firebase/firestore';

import './lesson-viewer.css';
import { renderLessonViewer } from './lesson-viewer.js';

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
  let courses = [];
  let topics = [];
  let lessons = [];

  let currentView = 'courses';
  let selectedCourse = null;
  let selectedTopic = null;
  let selectedLesson = null;
  let searchTerm = '';

  let destroyed = false;

  // Stores the cleanup function for the current
  // interactive lesson visual.
  let cleanupLessonVisual = () => {};

  container.innerHTML = `
    <section class="premium-library">
      <div class="premium-library-heading">
        <h2>Premium Mathematics Library</h2>
        <p>Explore courses, topics, and lessons.</p>
      </div>

      <div class="premium-library-controls">
        <button id="library-back" type="button" hidden>
          ← Back
        </button>

        <input
          id="library-search"
          type="search"
          placeholder="Search..."
          aria-label="Search premium library"
        />
      </div>

      <div id="library-breadcrumb"></div>

      <div id="library-content" aria-live="polite">
        Loading library...
      </div>
    </section>
  `;

  const content = container.querySelector('#library-content');
  const breadcrumb = container.querySelector('#library-breadcrumb');
  const backButton = container.querySelector('#library-back');
  const searchInput = container.querySelector('#library-search');

  function filtered(items) {
    return items.filter((item) =>
      String(item.title || '')
        .toLowerCase()
        .includes(searchTerm)
    );
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
        ${items.map((item) => `
          <button
            class="premium-library-card"
            type="button"
            data-type="${type}"
            data-id="${escapeHTML(item.id)}"
          >
            <span class="premium-library-icon">
              ${
                type === 'course'
                  ? '▣'
                  : type === 'topic'
                    ? '▤'
                    : '▧'
              }
            </span>

            <span class="premium-library-card-text">
              <strong>
                ${escapeHTML(item.title || 'Untitled')}
              </strong>

              <small>
                ${escapeHTML(item.description || '')}
              </small>
            </span>

            <span aria-hidden="true">→</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  function cleanupCurrentVisual() {
    cleanupLessonVisual();
    cleanupLessonVisual = () => {};
  }

  function render() {
    if (destroyed) return;

    // Clean up the previous interactive visual before
    // replacing the current lesson content.
    cleanupCurrentVisual();

    backButton.hidden = currentView === 'courses';
    searchInput.hidden = currentView === 'viewer';

    if (currentView === 'courses') {
      breadcrumb.textContent = 'All Courses';

      content.innerHTML = makeCards(
        filtered(courses),
        'course'
      );

    } else if (currentView === 'topics') {
      breadcrumb.textContent =
        `All Courses / ${selectedCourse?.title || 'Course'}`;

      const matchingTopics = topics.filter(
        (topic) =>
          topic.courseId === selectedCourse?.id
      );

      content.innerHTML = makeCards(
        filtered(matchingTopics),
        'topic'
      );

    } else if (currentView === 'lessons') {
      breadcrumb.textContent =
        `All Courses / ${selectedCourse?.title || 'Course'} / ${selectedTopic?.title || 'Topic'}`;

      const matchingLessons = lessons.filter(
        (lesson) =>
          lesson.courseId === selectedCourse?.id &&
          lesson.topicId === selectedTopic?.id
      );

      content.innerHTML = makeCards(
        filtered(matchingLessons),
        'lesson'
      );

    } else if (currentView === 'viewer') {
      breadcrumb.textContent =
        `All Courses / ${selectedCourse?.title || 'Course'} / ${selectedTopic?.title || 'Topic'} / ${selectedLesson?.title || 'Lesson'}`;

      // Mount the reusable lesson viewer.
      // It returns a function that cleans up its
      // interactive visual.
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
      selectedCourse = courses.find(
        (item) => item.id === id
      );

      if (!selectedCourse) return;

      selectedTopic = null;
      selectedLesson = null;
      currentView = 'topics';

    } else if (type === 'topic') {
      selectedTopic = topics.find(
        (item) =>
          item.id === id &&
          item.courseId === selectedCourse?.id
      );

      if (!selectedTopic) return;

      selectedLesson = null;
      currentView = 'lessons';

    } else if (type === 'lesson') {
      selectedLesson = lessons.find(
        (item) =>
          item.id === id &&
          item.courseId === selectedCourse?.id &&
          item.topicId === selectedTopic?.id
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
      selectedCourse = null;
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

  content.addEventListener(
    'click',
    handleCardClick
  );

  backButton.addEventListener(
    'click',
    handleBackClick
  );

  searchInput.addEventListener(
    'input',
    handleSearch
  );

  async function load() {
    try {
      const results = await Promise.all([
        getDocs(collection(db, 'courses')),
        getDocs(collection(db, 'topics')),
        getDocs(collection(db, 'lessons'))
      ]);

      // Ignore results from an abandoned library
      // after sign-out or account switching.
      if (destroyed) return;

      const convert = (snapshot) =>
        snapshot.docs.map((document) => ({
          ...document.data(),
          id: document.id
        }));

      courses = convert(results[0]);
      topics = convert(results[1]);
      lessons = convert(results[2]);

      const byOrder = (a, b) =>
        (a.order ?? 0) - (b.order ?? 0);

      courses.sort(byOrder);
      topics.sort(byOrder);
      lessons.sort(byOrder);

      render();

    } catch (error) {
      if (destroyed) return;

      console.error(
        'Library loading failed:',
        error
      );

      cleanupCurrentVisual();

      content.innerHTML = `
        <div class="library-empty">
          <h3>Unable to load the library</h3>
          <p>
            Please check the database connection
            and access permissions.
          </p>
        </div>
      `;
    }
  }

  load();

  return {
    destroy() {
      if (destroyed) return;

      destroyed = true;

      // Stop the active interactive component.
      cleanupCurrentVisual();

      // Remove event listeners.
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

      // Remove library content.
      container.replaceChildren();

      courses = [];
      topics = [];
      lessons = [];

      selectedCourse = null;
      selectedTopic = null;
      selectedLesson = null;
      searchTerm = '';
    }
  };
}
