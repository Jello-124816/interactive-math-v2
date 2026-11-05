
import './style.css';
import './free.css';

const base = import.meta.env.BASE_URL;

/* =========================================
   FREE COURSES
   ========================================= */

const freeCourses = [
  {
    id: 'algebra',
    title: 'Algebra',
    category: 'Free Course',
    description:
      'Explore equations, functions, and graphs through interactive mathematics.',
    icon: '📈'
  },
  {
    id: 'geometry',
    title: 'Geometry',
    category: 'Free Course',
    description:
      'Explore shapes, measurements, and geometric relationships through interactive diagrams.',
    icon: '📐'
  }
];

/* =========================================
   FREE INTERACTIVE TOPICS
   ========================================= */

const interactiveTopics = [
  {
    id: 'linear',
    courseId: 'algebra',
    title: 'Linear Equations and Their Graphs',
    category: 'Algebra',
    description:
      'Explore slope, y-intercept, and straight-line graphs using adjustable sliders.',
    icon: '📈',
    url: `${base}linear.html`
  },
  {
    id: 'pythagorean',
    courseId: 'geometry',
    title: 'Pythagorean Theorem',
    category: 'Geometry',
    description:
      'Adjust the sides of a right triangle and explore the squares constructed on each side.',
    icon: '📐',
    url: `${base}pythagorean.html`
  }
];

/* =========================================
   PAGE STRUCTURE
   ========================================= */

const app = document.querySelector('#app');

app.innerHTML = `
  <header class="site-header">
    <div class="container header-inner">
      <a href="${base}" class="brand">
        <span class="logo-placeholder">∑</span>
        <span class="brand-name">Interactive Mathematics</span>
      </a>

      <nav class="header-nav">
        <a href="${base}">Home</a>
        <a href="${base}free.html" aria-current="page">Free</a>
        <a href="${base}premium.html">Premium</a>
      </nav>
    </div>
  </header>

  <main class="library-page container">
    <a class="back-link" href="${base}">
      ← Back to Home
    </a>

    <div class="library-heading">
      <h1>Free Interactive Mathematics</h1>
      <p>
        Discover mathematics through interactive graphs,
        diagrams, and adjustable values.
      </p>
    </div>

    <div class="library-search">
      <label for="topic-search">
        Find a mathematics course or topic
      </label>
      <input
        id="topic-search"
        type="search"
        placeholder="Search mathematics topics..."
        autocomplete="off"
      />
    </div>

    <button
      id="library-back"
      type="button"
      hidden
      style="
        border: 0;
        background: transparent;
        color: #2563eb;
        font: inherit;
        font-size: 14px;
        font-weight: 650;
        padding: 0;
        margin-bottom: 20px;
        cursor: pointer;
      "
    >
      ← Back to Courses
    </button>

    <div class="library-summary">
      <h2 id="library-title">
        Explore Free Courses
      </h2>
      <span id="topic-count"></span>
    </div>

    <div id="topic-grid" class="topic-grid"></div>

    <p id="empty-message" class="empty-message" hidden>
      No matching mathematics content found.
    </p>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <span>Interactive Mathematics</span>
      <span>Explore mathematics visually.</span>
    </div>
  </footer>
`;

/* =========================================
   ELEMENTS AND STATE
   ========================================= */

const searchInput = document.querySelector('#topic-search');
const topicGrid = document.querySelector('#topic-grid');
const topicCount = document.querySelector('#topic-count');
const emptyMessage = document.querySelector('#empty-message');
const backButton = document.querySelector('#library-back');
const libraryTitle = document.querySelector('#library-title');

let currentCourse = null;

/* =========================================
   CREATE CARDS
   ========================================= */

function createCard(item, type) {
  const card = document.createElement(
    type === 'course' ? 'button' : 'a'
  );

  card.className = 'topic-card';

  if (type === 'course') {
    card.type = 'button';
    card.style.textAlign = 'left';
    card.style.font = 'inherit';
    card.style.color = 'inherit';
    card.style.cursor = 'pointer';

    card.addEventListener('click', () => {
      currentCourse = item.id;
      searchInput.value = '';
      renderLibrary();
    });
  } else {
    card.href = item.url;
  }

  const icon = document.createElement('div');
  icon.className = 'topic-icon';
  icon.textContent = item.icon;

  const category = document.createElement('span');
  category.className = 'topic-category';
  category.textContent = item.category;

  const title = document.createElement('h3');
  title.textContent = item.title;

  const description = document.createElement('p');
  description.textContent = item.description;

  const action = document.createElement('span');
  action.className = 'topic-action';

  action.textContent =
    type === 'course'
      ? `Explore ${item.title} →`
      : 'Explore Interactive →';

  card.append(
    icon,
    category,
    title,
    description,
    action
  );

  return card;
}

/* =========================================
   SEARCH
   ========================================= */

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

/* =========================================
   RENDER LIBRARY
   ========================================= */

function renderLibrary() {
  const query = searchInput.value;

  let items;
  let type;

  if (currentCourse === null) {
    type = 'course';
    items = freeCourses;

    libraryTitle.textContent = 'Explore Free Courses';
    backButton.hidden = true;
  } else {
    type = 'topic';

    const course = freeCourses.find(
      item => item.id === currentCourse
    );

    items = interactiveTopics.filter(
      item => item.courseId === currentCourse
    );

    libraryTitle.textContent =
      `${course?.title || 'Mathematics'} Topics`;

    backButton.hidden = false;
  }

  const filtered = items.filter(item =>
    matchesSearch(item, query)
  );

  topicGrid.replaceChildren(
    ...filtered.map(item => createCard(item, type))
  );

  topicCount.textContent =
    `${filtered.length} ${
      type === 'course'
        ? filtered.length === 1 ? 'course' : 'courses'
        : filtered.length === 1 ? 'interactive visual' : 'interactive visuals'
    }`;

  emptyMessage.hidden = filtered.length !== 0;
}

/* =========================================
   EVENTS
   ========================================= */

searchInput.addEventListener('input', renderLibrary);

backButton.addEventListener('click', () => {
  currentCourse = null;
  searchInput.value = '';
  renderLibrary();
});

/* =========================================
   INITIAL RENDER
   ========================================= */

renderLibrary();
