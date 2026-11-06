
export function renderFreeLayout() {
  const base = import.meta.env.BASE_URL;
  const app = document.querySelector('#app');

  if (!app) {
    throw new Error('Explore page requires an element with id="app".');
  }

  app.innerHTML = `
    <header class="site-header">
      <div class="container header-inner">
        <a href="${base}" class="brand" aria-label="Mathematics home">
          <span class="logo-placeholder" aria-hidden="true">∑</span>
          <span class="brand-name">Mathematics</span>
        </a>

        <nav class="header-nav" aria-label="Main navigation">
          <a href="${base}">Home</a>
          <a href="${base}free.html" aria-current="page">Explore</a>
          <a href="${base}#about">About</a>
          <a href="${base}account.html">Account</a>
        </nav>
      </div>
    </header>

    <main class="library-page container">

      <!-- Back to Home -->
      <a
        class="back-link"
        href="${base}"
        style="
          display: inline-flex;
          align-items: center;
          color: #2563eb;
          font-size: 16px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s ease;
        "
      >
        ← Back to Home
      </a>

      <div class="library-heading">
        <h1>Explore Mathematics Courses</h1>
        <p>
          Learn mathematics through structured courses,
          clear explanations, worked examples, and practice questions.
          Prepare for standardized tests such as SAT Math and GED Math.
        </p>
      </div>

      <div class="library-search">
        <label for="topic-search">
          Find a mathematics course or topic
        </label>

        <input
          id="topic-search"
          type="search"
          placeholder="Search courses and topics..."
          autocomplete="off"
        />
      </div>

      <!-- Back to Courses -->
      <button
        id="library-back"
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
          transition: color 0.2s ease;
        "
      >
        ← Back to Courses
      </button>

      <div class="library-summary">
        <h2 id="library-title">Explore Courses</h2>
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
        <span>© ${new Date().getFullYear()} Mathematics</span>
        <span>Learn. Practice. Understand.</span>
      </div>
    </footer>
  `;
}
