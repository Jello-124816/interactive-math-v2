
import './style.css';
import './free.css';
import { CoordinatePlane } from './coordinate-plane.js';

// ======================================================
// 1. PAGE STRUCTURE
// ======================================================

const app = document.querySelector('#app');

app.innerHTML = `
  <header class="site-header">
    <div class="container header-inner">

      <a href="${import.meta.env.BASE_URL}" class="brand">
        <span class="logo-placeholder">∑</span>
        <span class="brand-name">
          Interactive Mathematics
        </span>
      </a>

      <nav class="header-nav" aria-label="Main navigation">
        <a href="${import.meta.env.BASE_URL}">Home</a>
        <a href="${import.meta.env.BASE_URL}free.html">Free</a>
        <a href="${import.meta.env.BASE_URL}premium.html">Premium</a>
      </nav>

    </div>
  </header>

  <main class="math-page container">

    <a class="back-link" href="${import.meta.env.BASE_URL}free.html">
      ← Back to Free Mathematics
    </a>

    <div class="math-heading">
      <h1>Linear Equations and Their Graphs</h1>

      <p>
        Change the slope and y-intercept to explore
        how a straight line behaves.
      </p>
    </div>

    <section class="interactive-card">

      <!-- GRAPH TOOLBAR -->

      <div class="graph-toolbar">

        <div class="toolbar-group">

          <button
            id="zoom-out"
            type="button"
            aria-label="Zoom out"
          >
            −
          </button>

          <button
            id="zoom-in"
            type="button"
            aria-label="Zoom in"
          >
            +
          </button>

          <button
            id="reset-view"
            type="button"
          >
            Reset View
          </button>

        </div>

        <div class="toolbar-group opacity-controls">

          <label for="grid-opacity">
            Grid opacity
          </label>

          <input
            id="grid-opacity"
            type="range"
            min="0"
            max="100"
            step="5"
            value="35"
          />

          <output id="grid-value">
            35%
          </output>

        </div>

      </div>

      <!-- REUSABLE COORDINATE PLANE -->

      <div
        id="coordinate-plane"
        class="coordinate-plane"
      ></div>

      <p class="graph-hint">
        Drag to move · Scroll or pinch to zoom
        · Grid scale adjusts automatically
      </p>

      <!-- LIVE EQUATION -->

      <div class="equation-panel">

        <div class="equation-label">
          LINEAR EQUATION
        </div>

        <div
          class="equation"
          id="equation"
          aria-live="off"
        >
          y = x + 2
        </div>

      </div>

      <!-- VARIABLE CONTROLS -->

      <div class="sliders-panel">

        <!-- =================================== -->
        <!-- SLOPE m -->
        <!-- =================================== -->

        <div class="variable-control">

          <div class="variable-heading">

            <label for="m-slider">
              m (slope) =
              <output id="m-value">1</output>
            </label>

            <button
              id="m-scale-button"
              class="scale-button"
              type="button"
              aria-expanded="false"
              aria-controls="m-scale-panel"
            >
              ⚙ Slider Scale
            </button>

          </div>

          <input
            id="m-slider"
            class="math-slider"
            type="range"
            min="-5"
            max="5"
            step="0.1"
            value="1"
          />

          <div class="slider-endpoints">

            <span id="m-min-label">−5</span>
            <span id="m-max-label">5</span>

          </div>

          <!-- SLOPE SCALE SETTINGS -->

          <div
            id="m-scale-panel"
            class="scale-panel"
            hidden
          >

            <div class="scale-fields">

              <label for="m-min">
                Start Value

                <input
                  id="m-min"
                  type="number"
                  value="-5"
                  step="any"
                />
              </label>

              <label for="m-max">
                End Value

                <input
                  id="m-max"
                  type="number"
                  value="5"
                  step="any"
                />
              </label>

            </div>

            <button
              id="m-apply"
              class="apply-button"
              type="button"
            >
              Apply Scale
            </button>

            <p
              id="m-error"
              class="scale-error"
              role="alert"
            ></p>

          </div>

        </div>

        <!-- =================================== -->
        <!-- Y-INTERCEPT b -->
        <!-- =================================== -->

        <div class="variable-control">

          <div class="variable-heading">

            <label for="b-slider">
              b (y-intercept) =
              <output id="b-value">2</output>
            </label>

            <button
              id="b-scale-button"
              class="scale-button"
              type="button"
              aria-expanded="false"
              aria-controls="b-scale-panel"
            >
              ⚙ Slider Scale
            </button>

          </div>

          <input
            id="b-slider"
            class="math-slider"
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value="2"
          />

          <div class="slider-endpoints">

            <span id="b-min-label">−10</span>
            <span id="b-max-label">10</span>

          </div>

          <!-- Y-INTERCEPT SCALE SETTINGS -->

          <div
            id="b-scale-panel"
            class="scale-panel"
            hidden
          >

            <div class="scale-fields">

              <label for="b-min">
                Start Value

                <input
                  id="b-min"
                  type="number"
                  value="-10"
                  step="any"
                />
              </label>

              <label for="b-max">
                End Value

                <input
                  id="b-max"
                  type="number"
                  value="10"
                  step="any"
                />
              </label>

            </div>

            <button
              id="b-apply"
              class="apply-button"
              type="button"
            >
              Apply Scale
            </button>

            <p
              id="b-error"
              class="scale-error"
              role="alert"
            ></p>

          </div>

        </div>

      </div>

    </section>

    <!-- MATHEMATICAL EXPLANATION -->

    <section class="math-explanation">

      <h2>Understanding the Graph</h2>

      <p>
        A linear equation in slope-intercept form is
        <strong>y = mx + b</strong>.
        Its graph is a straight line.
      </p>

      <p>
        <strong>m (slope)</strong> determines the direction
        and steepness of the line.
        A positive slope rises from left to right,
        a negative slope falls, and a slope of zero
        produces a horizontal line.
      </p>

      <p>
        <strong>b (y-intercept)</strong> determines where
        the line crosses the y-axis.
        Changing b moves the line vertically without
        changing its slope.
      </p>

    </section>

  </main>

  <footer class="site-footer">

    <div class="container footer-inner">
      <span>Interactive Mathematics</span>
      <span>Explore mathematics visually.</span>
    </div>

  </footer>
`;

// ======================================================
// 2. HELPERS AND STATE
// ======================================================

const $ = selector => document.querySelector(selector);

const state = {
  m: 1,
  b: 2
};

// Create the reusable coordinate plane.
const plane = new CoordinatePlane(
  $('#coordinate-plane')
);

// Format numbers without unnecessary trailing zeros.
function formatNumber(value) {
  if (Math.abs(value) < 1e-10) {
    return '0';
  }

  return String(Number(value.toFixed(8)));
}

// Use a proper minus sign for display.
function displayNumber(value) {
  return formatNumber(value).replace('-', '−');
}

// ======================================================
// 3. FORMAT THE LIVE EQUATION
// ======================================================

function formatEquation(m, b) {

  // Horizontal line.
  if (m === 0) {
    return `y = ${displayNumber(b)}`;
  }

  let slopeTerm;

  if (m === 1) {
    slopeTerm = 'x';
  } else if (m === -1) {
    slopeTerm = '−x';
  } else {
    slopeTerm = `${displayNumber(m)}x`;
  }

  // No constant term.
  if (b === 0) {
    return `y = ${slopeTerm}`;
  }

  const sign = b < 0 ? ' − ' : ' + ';

  return (
    `y = ${slopeTerm}` +
    sign +
    displayNumber(Math.abs(b))
  );
}

// ======================================================
// 4. UPDATE GRAPH AND VALUES
// ======================================================

function updateGraph() {

  // Display current values.
  $('#m-value').textContent = displayNumber(state.m);
  $('#b-value').textContent = displayNumber(state.b);

  // Update displayed equation.
  $('#equation').textContent = formatEquation(
    state.m,
    state.b
  );

  // Draw the corresponding straight line.
  plane.setFunctions([
    {
      type: 'linear',
      m: state.m,
      b: state.b,
      color: '#2563eb'
    }
  ]);
}

// ======================================================
// 5. REUSABLE SLIDER CONTROL
// ======================================================

function connectSlider(variable) {

  const slider = $(`#${variable}-slider`);

  const scaleButton = $(`#${variable}-scale-button`);
  const scalePanel = $(`#${variable}-scale-panel`);

  const minInput = $(`#${variable}-min`);
  const maxInput = $(`#${variable}-max`);

  const minLabel = $(`#${variable}-min-label`);
  const maxLabel = $(`#${variable}-max-label`);

  const applyButton = $(`#${variable}-apply`);
  const error = $(`#${variable}-error`);

  // ------------------------------------------
  // A. SLIDER MOVEMENT
  // ------------------------------------------

  slider.addEventListener('input', () => {

    state[variable] = Number(slider.value);

    updateGraph();
  });

  // ------------------------------------------
  // B. OPEN / CLOSE SLIDER SCALE
  // ------------------------------------------

  scaleButton.addEventListener('click', () => {

    const opening = scalePanel.hidden;

    scalePanel.hidden = !opening;

    scaleButton.setAttribute(
      'aria-expanded',
      String(opening)
    );

    if (opening) {
      error.textContent = '';

      // Show the slider's currently applied limits.
      minInput.value = slider.min;
      maxInput.value = slider.max;
    }
  });

  // ------------------------------------------
  // C. APPLY START AND END VALUES
  // ------------------------------------------

  function applyScale() {

    const minText = minInput.value.trim();
    const maxText = maxInput.value.trim();

    const min = Number(minText);
    const max = Number(maxText);

    // Check for invalid values.
    if (
      minText === '' ||
      maxText === '' ||
      !Number.isFinite(min) ||
      !Number.isFinite(max)
    ) {
      error.textContent =
        'Please enter valid Start and End values.';
      return;
    }

    if (min >= max) {
      error.textContent =
        'Start Value must be smaller than End Value.';
      return;
    }

    if (max - min > 1000000) {
      error.textContent =
        'The maximum slider range width is 1,000,000.';
      return;
    }

    error.textContent = '';

    // Set the new slider range.
    slider.min = String(min);
    slider.max = String(max);

    // Permit continuous adjustment.
    slider.step = 'any';

    // Keep the current value if possible.
    const newValue = Math.max(
      min,
      Math.min(max, state[variable])
    );

    slider.value = String(newValue);

    state[variable] = Number(slider.value);

    // Update visible endpoint labels.
    minLabel.textContent = displayNumber(min);
    maxLabel.textContent = displayNumber(max);

    // Close settings after applying.
    scalePanel.hidden = true;

    scaleButton.setAttribute(
      'aria-expanded',
      'false'
    );

    // Update equation and graph.
    updateGraph();
  }

  applyButton.addEventListener('click', applyScale);

  // Press Enter inside either box to apply.
  [minInput, maxInput].forEach(input => {

    input.addEventListener('keydown', event => {

      if (event.key === 'Enter') {
        event.preventDefault();
        applyScale();
      }
    });
  });
}

// Initialize both variable sliders.
connectSlider('m');
connectSlider('b');

// ======================================================
// 6. GRAPH ZOOM AND RESET
// ======================================================

$('#zoom-in').addEventListener('click', () => {
  plane.zoom(1.3);
});

$('#zoom-out').addEventListener('click', () => {
  plane.zoom(1 / 1.3);
});

$('#reset-view').addEventListener('click', () => {
  plane.resetView();
});

// ======================================================
// 7. GRID OPACITY
// ======================================================

$('#grid-opacity').addEventListener('input', event => {

  const value = Number(event.target.value);

  plane.setGridOpacity(value / 100);

  $('#grid-value').textContent = `${value}%`;
});

// ======================================================
// 8. INITIAL RENDER
// ======================================================

updateGraph();
