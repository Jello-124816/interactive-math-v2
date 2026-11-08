
import './style.css';

const app = document.querySelector('#app');
const base = import.meta.env.BASE_URL;

app.innerHTML = `
  <header class="site-header">
    <div class="container header-inner">
      <a href="${base}" class="brand" aria-label="Mathematics home">
        <span class="logo-placeholder" aria-hidden="true">
          ∑
        </span>
        <span class="brand-name">Mathematics</span>
      </a>

      <nav class="header-nav" aria-label="Main navigation">
        <a href="#home">Home</a>
        <a href="${base}explore.html">Explore</a>
        <a href="#about">About</a>
        <a href="${base}account.html">Account</a>
      </nav>
    </div>
  </header>

  <main id="home">
    <section class="hero container">
      <div class="hero-content">
        <span class="eyebrow">LEARN MATHEMATICS</span>

        <h1>Welcome to <span>Mathematics</span></h1>

        <p class="hero-description">
          Learn mathematics through structured courses,
          clear explanations, worked examples, and practice questions.
          Prepare for standardized tests such as SAT Math and GED Math.
        </p>

        <div class="hero-actions">
          <a class="btn btn-primary" href="${base}explore.html">
            Explore Courses <span aria-hidden="true">→</span>
          </a>

          <a class="btn btn-outline" href="#about">
            Learn More
          </a>
        </div>
      </div>

      <div class="hero-visual" aria-hidden="true">
        <svg viewBox="0 0 480 340" class="math-illustration">
          <defs>
            <pattern
              id="grid"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 30 0 L 0 0 0 30"
                fill="none"
                stroke="#dce7f5"
                stroke-width="1"
              />
            </pattern>
          </defs>

          <rect
            x="15"
            y="15"
            width="450"
            height="310"
            rx="20"
            fill="#ffffff"
          />

          <rect
            x="35"
            y="35"
            width="410"
            height="270"
            fill="url(#grid)"
          />

          <line
            x1="35"
            y1="220"
            x2="445"
            y2="220"
            stroke="#8fa3bd"
            stroke-width="2"
          />

          <line
            x1="240"
            y1="35"
            x2="240"
            y2="305"
            stroke="#8fa3bd"
            stroke-width="2"
          />

          <path
            d="M 65 60 Q 240 380 415 60"
            stroke="#2563eb"
            stroke-width="5"
            fill="none"
            stroke-linecap="round"
          />

          <circle
            cx="240"
            cy="220"
            r="6"
            fill="#2563eb"
          />

          <text
            x="265"
            y="65"
            fill="#1d4ed8"
            font-size="22"
            font-weight="600"
          >
            y = ax² + bx + c
          </text>

          <text
            x="420"
            y="242"
            fill="#64748b"
            font-size="16"
          >
            x
          </text>

          <text
            x="252"
            y="48"
            fill="#64748b"
            font-size="16"
          >
            y
          </text>
        </svg>

        <span class="visual-caption">
          Learn. Practice. Understand.
        </span>
      </div>
    </section>

    <section id="explore" class="explore-section">
      <div class="container">
        <div class="section-heading">
          <span class="eyebrow">CHOOSE YOUR COURSE</span>
          <h2>Start Your Mathematics Journey</h2>
          <p>
            Explore mathematics courses, topics, and
            standardized test preparation.
          </p>
        </div>

        <div class="access-grid">
          <article class="access-card free-card">
            <div class="card-icon" aria-hidden="true">∑</div>

            <span class="card-tag">MATHEMATICS COURSES</span>

            <h3>Explore Courses</h3>

            <p>
              Browse Algebra, Geometry, SAT Math Practices,
              and more mathematics courses as they become available.
            </p>

            <a
              class="btn btn-primary card-button"
              href="${base}explore.html"
            >
              Explore
              <span aria-hidden="true">→</span>
            </a>
          </article>
        </div>
      </div>
    </section>

    <section id="about" class="features-section container">
      <div class="section-heading">
        <span class="eyebrow">WHY LEARN WITH US?</span>
        <h2>Mathematics Made Clear</h2>
      </div>

      <div class="features-grid">
        <div class="feature">
          <span class="feature-icon" aria-hidden="true">📚</span>
          <h3>Structured Courses</h3>
          <p>
            Learn mathematics through organized courses,
            topics, and lessons.
          </p>
        </div>

        <div class="feature">
          <span class="feature-icon" aria-hidden="true">📝</span>
          <h3>Exam Preparation</h3>
          <p>
            Practice mathematics for standardized tests
            such as SAT Math and GED Math.
          </p>
        </div>

        <div class="feature">
          <span class="feature-icon" aria-hidden="true">ƒ</span>
          <h3>Clear Explanations</h3>
          <p>
            Understand mathematical concepts through
            examples and step-by-step solutions.
          </p>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <span>© ${new Date().getFullYear()} Mathematics</span>
      <span>Learn. Practice. Understand.</span>
    </div>
  </footer>
`;
