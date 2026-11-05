
import './style.css';
import './free.css';


const interactiveTopics = [
  {
    id: 'linear',
    title: 'Linear Equations and Their Graphs',
    category: 'Algebra',
    description:
      'Explore slope, y-intercept, and straight-line graphs using adjustable sliders.',
    icon: '📈',
    url: `${import.meta.env.BASE_URL}linear.html`
  },
  {
    id: 'pythagorean',
    title: 'Pythagorean Theorem',
    category: 'Geometry',
    description:
      'Adjust the sides of a right triangle and explore the squares constructed on each side.',
    icon: '📐',
    url: `${import.meta.env.BASE_URL}pythagorean.html`
  }
];


// Add new interactive topics to the array above.

const app = document.querySelector('#app');

app.innerHTML = `
  <header class="site-header">
    <div class="container header-inner">
      <a href="${import.meta.env.BASE_URL}" class="brand">
        <span class="logo-placeholder">∑</span>
        <span class="brand-name">Interactive Mathematics</span>
      </a>

      <nav class="header-nav">
        <a href="${import.meta.env.BASE_URL}">Home</a>
        <a href="${import.meta.env.BASE_URL}free.html" aria-current="page">Free</a>
        <a href="${import.meta.env.BASE_URL}premium.html">Premium</a>
      </nav>
    </div>
  </header>

  <main class="library-page container">
    <a class="back-link" href="${import.meta.env.BASE_URL}">← Back to Home</a>

    <div class="library-heading">
      <h1>Free Interactive Mathematics</h1>
      <p>
        Discover mathematics through interactive graphs,
        diagrams, and adjustable values.
      </p>
    </div>

    <div class="library-search">
      <label for="topic-search">Find an interactive visual</label>
      <input
        id="topic-search"
        type="search"
        placeholder="Search mathematics topics..."
        autocomplete="off"
      />
    </div>

    <div class="library-summary">
      <h2>Explore Interactive Visuals</h2>
      <span id="topic-count"></span>
    </div>

    <div id="topic-grid" class="topic-grid"></div>
    <p id="empty-message" class="empty-message" hidden>
      No matching interactive visuals found.
    </p>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <span>Interactive Mathematics</span>
      <span>Explore mathematics visually.</span>
    </div>
  </footer>
`;

const searchInput = document.querySelector('#topic-search');
const topicGrid = document.querySelector('#topic-grid');
const topicCount = document.querySelector('#topic-count');
const emptyMessage = document.querySelector('#empty-message');

function createTopicCard(topic) {
  const card = document.createElement('a');
  card.className = 'topic-card';
  card.href = topic.url;

  const icon = document.createElement('div');
  icon.className = 'topic-icon';
  icon.textContent = topic.icon;

  const category = document.createElement('span');
  category.className = 'topic-category';
  category.textContent = topic.category;

  const title = document.createElement('h3');
  title.textContent = topic.title;

  const description = document.createElement('p');
  description.textContent = topic.description;

  const action = document.createElement('span');
  action.className = 'topic-action';
  action.textContent = 'Explore Interactive →';

  card.append(icon, category, title, description, action);

  return card;
}

function renderTopics(query = '') {
  const normalized = query.trim().toLowerCase();

  const filtered = interactiveTopics.filter(topic => {
    return [
      topic.title,
      topic.category,
      topic.description
    ].some(text => text.toLowerCase().includes(normalized));
  });

  topicGrid.replaceChildren(
    ...filtered.map(createTopicCard)
  );

  topicCount.textContent =
    `${filtered.length} interactive visual${filtered.length === 1 ? '' : 's'}`;

  emptyMessage.hidden = filtered.length !== 0;
}

searchInput.addEventListener('input', event => {
  renderTopics(event.target.value);
});

renderTopics();
