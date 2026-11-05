
import { collection, getDocs } from 'firebase/firestore';

const base = import.meta.env.BASE_URL;

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
  let searchTerm = '';

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
          <p>Content will appear here when it is added.</p>
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
              ${type === 'course' ? '▣' : type === 'topic' ? '▤' : '▧'}
            </span>
            <span class="premium-library-card-text">
              <strong>${escapeHTML(item.title || 'Untitled')}</strong>
              <small>${escapeHTML(item.description || '')}</small>
            </span>
            <span aria-hidden="true">→</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  function render() {
    backButton.hidden = currentView === 'courses';

    if (currentView === 'courses') {
      breadcrumb.textContent = 'All Courses';
      content.innerHTML = makeCards(filtered(courses), 'course');
    }

    if (currentView === 'topics') {
      breadcrumb.textContent =
        `All Courses / ${selectedCourse?.title || 'Course'}`;

      const matchingTopics = topics.filter(
        (topic) => topic.courseId === selectedCourse?.id
      );

      content.innerHTML = makeCards(filtered(matchingTopics), 'topic');
    }

    if (currentView === 'lessons') {
      breadcrumb.textContent =
        `All Courses / ${selectedCourse?.title || 'Course'} / ${selectedTopic?.title || 'Topic'}`;

      const matchingLessons = lessons.filter(
        (lesson) =>
          lesson.courseId === selectedCourse?.id &&
          lesson.topicId === selectedTopic?.id
      );

      content.innerHTML = makeCards(filtered(matchingLessons), 'lesson');
    }
  }

  content.addEventListener('click', (event) => {
    const card = event.target.closest('[data-type][data-id]');
    if (!card) return;

    const { type, id } = card.dataset;

    if (type === 'course') {
      selectedCourse = courses.find((item) => item.id === id);
      if (!selectedCourse) return;

      currentView = 'topics';
    } else if (type === 'topic') {
      selectedTopic = topics.find((item) => item.id === id);
      if (!selectedTopic) return;

      currentView = 'lessons';
    } else if (type === 'lesson') {
      // Lesson pages will be implemented in Step 6B.
      return;
    }

    searchTerm = '';
    searchInput.value = '';
    render();
  });

  backButton.addEventListener('click', () => {
    if (currentView === 'lessons') {
      currentView = 'topics';
      selectedTopic = null;
    } else {
      currentView = 'courses';
      selectedCourse = null;
    }

    searchTerm = '';
    searchInput.value = '';
    render();
  });

  searchInput.addEventListener('input', () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    render();
  });

  async function load() {
    try {
      const results = await Promise.all([
        getDocs(collection(db, 'courses')),
        getDocs(collection(db, 'topics')),
        getDocs(collection(db, 'lessons'))
      ]);

      const convert = (snapshot) =>
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
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
      console.error('Library loading failed:', error);
      content.innerHTML = `
        <div class="library-empty">
          <h3>Unable to load the library</h3>
          <p>Please check the database connection and access permissions.</p>
        </div>
      `;
    }
  }

  load();

  return {
    destroy() {
      container.replaceChildren();
    }
  };
}
