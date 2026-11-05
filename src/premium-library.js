
import { collection, getDocs } from 'firebase/firestore';
import { renderLessonViewer } from './lesson-viewer.js';
import './lesson-viewer.css';

const CALCULUS = {
  id: 'calculus',
  title: 'Calculus',
  category: 'Premium Course',
  description:
    'Explore limits, derivatives, integrals, and advanced calculus through interactive lessons.',
  icon: '∫'
};

export function createPremiumLibrary(container, db) {
  let topics = [];
  let lessons = [];
  let view = 'courses';
  let selectedTopic = null;
  let selectedLesson = null;
  let query = '';
  let destroyed = false;
  let cleanupVisual = () => {};

  // Same structure as src/free.js
  container.innerHTML = `
    <div class="library-heading">
      <h1>Premium Mathematics</h1>
      <p>
        Discover advanced mathematics through interactive
        graphs, diagrams, and adjustable values.
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

    <button id="library-back" type="button" hidden>
      ← Back
    </button>

    <div class="library-summary">
      <h2 id="library-title">Explore Premium Courses</h2>
      <span id="topic-count"></span>
    </div>

    <div id="library-breadcrumb"></div>
    <div id="topic-grid" class="topic-grid"></div>

    <p id="empty-message" class="empty-message" hidden>
      No matching mathematics content found.
    </p>

    <div id="lesson-content"></div>
    <p id="library-error" role="alert" hidden></p>
  `;

  const searchInput = container.querySelector('#topic-search');
  const topicGrid = container.querySelector('#topic-grid');
  const topicCount = container.querySelector('#topic-count');
  const emptyMessage = container.querySelector('#empty-message');
  const backButton = container.querySelector('#library-back');
  const libraryTitle = container.querySelector('#library-title');
  const breadcrumb = container.querySelector('#library-breadcrumb');
  const lessonContent = container.querySelector('#lesson-content');
  const errorMessage = container.querySelector('#library-error');

  function matches(item) {
    return [
      item.title,
      item.category,
      item.description
    ].some(value =>
      String(value || '').toLowerCase().includes(query)
    );
  }

  // Same card structure as src/free.js
  function createTopicCard(item, type) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'topic-card';
    card.dataset.type = type;
    card.dataset.id = item.id;

    // Buttons need these styles to behave like Free links.
    card.style.textAlign = 'left';
    card.style.font = 'inherit';
    card.style.color = 'inherit';
    card.style.cursor = 'pointer';

    const icon = document.createElement('div');
    icon.className = 'topic-icon';
    icon.textContent =
      type === 'course' ? '∫' :
      type === 'topic' ? '📘' : '📖';

    const category = document.createElement('span');
    category.className = 'topic-category';
    category.textContent =
      type === 'course' ? 'Premium Course' :
      type === 'topic' ? 'Calculus Topic' : 'Premium Lesson';

    const title = document.createElement('h3');
    title.textContent = item.title || 'Untitled';

    const description = document.createElement('p');
    description.textContent = item.description || '';

    const action = document.createElement('span');
    action.className = 'topic-action';
    action.textContent =
      type === 'course' ? 'Explore Calculus →' :
      type === 'topic' ? 'Explore Topic →' : 'Open Lesson →';

    card.append(icon, category, title, description, action);
    return card;
  }

  function renderCards(items, type) {
    const filtered = items.filter(matches);

    topicGrid.replaceChildren(
      ...filtered.map(item => createTopicCard(item, type))
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

    backButton.hidden = view === 'courses';
    searchInput.parentElement.hidden = view === 'viewer';
    emptyMessage.hidden = true;

    if (view === 'courses') {
      libraryTitle.textContent = 'Explore Premium Courses';
      breadcrumb.textContent = '';
      renderCards([CALCULUS], 'course');

    } else if (view === 'topics') {
      libraryTitle.textContent = 'Calculus Topics';
      breadcrumb.textContent = 'Calculus';

      renderCards(
        topics.filter(item => item.courseId === CALCULUS.id),
        'topic'
      );

    } else if (view === 'lessons') {
      libraryTitle.textContent =
        selectedTopic?.title || 'Calculus Lessons';

      breadcrumb.textContent =
        `Calculus / ${selectedTopic?.title || ''}`;

      renderCards(
        lessons.filter(item =>
          item.courseId === CALCULUS.id &&
          item.topicId === selectedTopic?.id
        ),
        'lesson'
      );

    } else if (view === 'viewer') {
      libraryTitle.textContent =
        selectedLesson?.title || 'Lesson';

      breadcrumb.textContent =
        `Calculus / ${selectedTopic?.title || ''} / ${selectedLesson?.title || ''}`;

      topicCount.textContent = '';
      topicGrid.hidden = true;

      cleanupVisual = renderLessonViewer(
        lessonContent,
        selectedLesson
      );
    }

    if (view !== 'viewer') {
      topicGrid.hidden = false;
    }
  }

  function handleCardClick(event) {
    const card = event.target.closest('[data-type][data-id]');
    if (!card || !topicGrid.contains(card) || destroyed) return;

    const { type, id } = card.dataset;

    if (type === 'course') {
      if (id !== CALCULUS.id) return;

      view = 'topics';
      selectedTopic = null;
      selectedLesson = null;

    } else if (type === 'topic') {
      selectedTopic = topics.find(item =>
        item.id === id && item.courseId === CALCULUS.id
      );

      if (!selectedTopic) return;
      selectedLesson = null;
      view = 'lessons';

    } else if (type === 'lesson') {
      selectedLesson = lessons.find(item =>
        item.id === id &&
        item.courseId === CALCULUS.id &&
        item.topicId === selectedTopic?.id
      );

      if (!selectedLesson) return;
      view = 'viewer';
    }

    query = '';
    searchInput.value = '';
    render();
  }

  function handleBack() {
    if (view === 'viewer') {
      view = 'lessons';
      selectedLesson = null;
    } else if (view === 'lessons') {
      view = 'topics';
      selectedTopic = null;
    } else {
      view = 'courses';
    }

    query = '';
    searchInput.value = '';
    render();
  }

  function handleSearch() {
    query = searchInput.value.trim().toLowerCase();
    render();
  }

  topicGrid.addEventListener('click', handleCardClick);
  backButton.addEventListener('click', handleBack);
  searchInput.addEventListener('input', handleSearch);

  async function load() {
    try {
      const [topicSnapshot, lessonSnapshot] = await Promise.all([
        getDocs(collection(db, 'topics')),
        getDocs(collection(db, 'lessons'))
      ]);

      if (destroyed) return;

      topics = topicSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      lessons = lessonSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
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
        'Unable to load premium content. Check Firestore access.';
      errorMessage.hidden = false;
    }
  }

  render();
  load();

  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;

      cleanupVisual();

      topicGrid.removeEventListener('click', handleCardClick);
      backButton.removeEventListener('click', handleBack);
      searchInput.removeEventListener('input', handleSearch);

      container.replaceChildren();
    }
  };
}
