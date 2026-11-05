
export function renderFreeLayout() {
  const base = import.meta.env.BASE_URL;
  const app = document.querySelector('#app');

  if (!app) {
    throw new Error('Free page requires an element with id="app".');
  }

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
          diagrams, adjustable values, and SAT Math practice.
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
        <h2 id="library-title">Explore Free Courses</h2>
        <span id="topic-count"></span>
      </div>

      <div id="topic-grid" class="topic-grid"></div>

      <section id="practice-view" hidden></section>

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
}
