
import './style.css';

const app = document.querySelector('#app');

app.innerHTML = `
  <header class="site-header">
    <div class="container header-inner">
      <a href="${import.meta.env.BASE_URL}" class="brand" aria-label="Interactive Mathematics home">
        <span class="logo-placeholder" aria-label="Logo placeholder">
          ∑
        </span>
        <span class="brand-name">Interactive Mathematics</span>
      </a>

      <nav class="header-nav" aria-label="Main navigation">
        <a href="#home">Home</a>
        <a href="#explore">Explore</a>
        <a href="#about">About</a>
      </nav>
    </div>
  </header>

  <main id="home">
    <section class="hero container">
      <div class="hero-content">
        <span class="eyebrow">LEARN THROUGH EXPLORATION</span>
        <h1>Welcome to <span>Interactive Mathematics</span></h1>
        <p class="hero-description">
          Discover mathematics through interactive graphs,
          adjustable values, and clear visual explanations.
          Explore concepts at your own pace.
        </p>

        <div class="hero-actions">
          <a class="btn btn-primary" href="#explore">
            Start Exploring <span aria-hidden="true">→</span>
          </a>
          <a class="btn btn-outline" href="#about">
            Learn More
          </a>
        </div>
      </div>

      <div class="hero-visual" aria-hidden="true">
        <svg viewBox="0 0 480 340" class="math-illustration">
          <defs>
            <pattern id="grid" width="30" height="30"
                     patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30"
                    fill="none" stroke="#dce7f5" stroke-width="1"/>
            </pattern>
          </defs>

          <rect x="15" y="15" width="450" height="310"
                rx="20" fill="#ffffff"/>
          <rect x="35" y="35" width="410" height="270"
                fill="url(#grid)"/>

          <line x1="35" y1="220" x2="445" y2="220"
                stroke="#8fa3bd" stroke-width="2"/>
          <line x1="240" y1="35" x2="240" y2="305"
                stroke="#8fa3bd" stroke-width="2"/>

          <path d="M 65 60 Q 240 380 415 60"
                stroke="#2563eb" stroke-width="5"
                fill="none" stroke-linecap="round"/>

          <circle cx="240" cy="220" r="6" fill="#2563eb"/>
          <text x="265" y="65" fill="#1d4ed8"
                font-size="22" font-weight="600">
            y = ax² + bx + c
          </text>
          <text x="420" y="242" fill="#64748b" font-size="16">x</text>
          <text x="252" y="48" fill="#64748b" font-size="16">y</text>
        </svg>
        <span class="visual-caption">Visualize. Adjust. Understand.</span>
      </div>
    </section>

    <section id="explore" class="explore-section">
      <div class="container">
        <div class="section-heading">
          <span class="eyebrow">CHOOSE YOUR PATH</span>
          <h2>Start Your Mathematics Journey</h2>
          <p>Select how you would like to explore interactive mathematics.</p>
        </div>

        <div class="access-grid">
          <article class="access-card free-card">
            <div class="card-icon" aria-hidden="true">∑</div>
            <span class="card-tag">OPEN ACCESS</span>
            <h3>Free Mathematics</h3>
            <p>
              Explore freely available interactive mathematical
              visuals and explanations.
            </p>
            <a class="btn btn-primary card-button" href="${import.meta.env.BASE_URL}free.html">
              Explore Free
              <span aria-hidden="true">→</span>
            </a>
          </article>

          <article class="access-card premium-card">
            <div class="card-icon" aria-hidden="true">✦</div>
            <span class="card-tag">PREMIUM ACCESS</span>
            <h3>Premium Mathematics</h3>
            <p>
              Discover the dedicated area for advanced interactive
              mathematical learning resources.
            </p>
            <a class="btn btn-dark card-button" href="${import.meta.env.BASE_URL}premium.html">
              Explore Premium
              <span aria-hidden="true">→</span>
            </a>
          </article>
        </div>
      </div>
    </section>

    <section id="about" class="features-section container">
      <div class="section-heading">
        <span class="eyebrow">WHY INTERACTIVE MATHEMATICS?</span>
        <h2>Mathematics You Can Explore</h2>
      </div>

      <div class="features-grid">
        <div class="feature">
          <span class="feature-icon" aria-hidden="true">⌁</span>
          <h3>Interactive Visuals</h3>
          <p>See mathematical concepts through dynamic graphs and diagrams.</p>
        </div>

        <div class="feature">
          <span class="feature-icon" aria-hidden="true">↔</span>
          <h3>Adjustable Values</h3>
          <p>Change parameters and observe the mathematical effects.</p>
        </div>

        <div class="feature">
          <span class="feature-icon" aria-hidden="true">ƒ</span>
          <h3>Clear Explanations</h3>
          <p>Understand the key ideas with concise explanations.</p>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <span>© ${new Date().getFullYear()} Interactive Mathematics</span>
      <span>Explore mathematics visually.</span>
    </div>
  </footer>
`;
