
import './style.css';
import './free.css';
import './pythagorean.css';

const app = document.querySelector('#app');

app.innerHTML = `
  <header class="site-header">
    <div class="container header-inner">
      <a href="${import.meta.env.BASE_URL}" class="brand">
        <span class="logo-placeholder">∑</span>
        <span class="brand-name">Interactive Mathematics</span>
      </a>
      <nav class="header-nav" aria-label="Main navigation">
        <a href="${import.meta.env.BASE_URL}">Home</a>
        <a href="${import.meta.env.BASE_URL}free.html">Free</a>
        <a href="${import.meta.env.BASE_URL}premium.html">Premium</a>
      </nav>
    </div>
  </header>

  <main class="math-page container">
    <a href="${import.meta.env.BASE_URL}free.html" class="back-link">
      ← Back to Free Mathematics
    </a>

    <div class="math-heading">
      <h1>Pythagorean Theorem</h1>
      <p>
        Drag the triangle's vertices, zoom, and explore
        the squares constructed on its three sides.
      </p>
    </div>

    <section class="interactive-card">
      <div class="pyth-toolbar">
        <button
          id="toggle-squares"
          class="pyth-button"
          type="button"
          aria-pressed="false"
        >Add Squares</button>

        <div class="pyth-view-controls">
          <button
            id="zoom-out"
            class="pyth-button secondary"
            type="button"
            aria-label="Zoom out"
          >−</button>

          <button
            id="zoom-in"
            class="pyth-button secondary"
            type="button"
            aria-label="Zoom in"
          >+</button>

          <button
            id="reset-view"
            class="pyth-button secondary"
            type="button"
          >Reset View</button>

          <button
            id="reset-triangle"
            class="pyth-button secondary"
            type="button"
          >Reset Triangle</button>
        </div>
      </div>

      <div class="pyth-diagram">
        <svg
          id="triangle-svg"
          viewBox="0 0 800 600"
          role="img"
          aria-label="Interactive right triangle ABC with draggable vertices, zoom and pan"
        ></svg>
      </div>

      <p class="pyth-hint">
        Drag A or C to resize · Drag B to move the triangle
        · Drag empty space to pan · Scroll or pinch to zoom
      </p>

      <div class="pyth-equation">
        <div class="equation-label">
          PYTHAGOREAN THEOREM
        </div>

        <div class="pyth-formula">
          AB² + BC² = AC²
        </div>

        <div
          id="pyth-calculation"
          class="pyth-calculation"
        ></div>

        <div
          id="pyth-result"
          class="pyth-result"
        ></div>
      </div>

      <div class="pyth-lengths">
        <div class="pyth-length-item">
          <span class="pyth-length-name ab-color">AB</span>
          <strong id="ab-value">3</strong>
        </div>

        <div class="pyth-length-item">
          <span class="pyth-length-name bc-color">BC</span>
          <strong id="bc-value">4</strong>
        </div>

        <div class="pyth-length-item">
          <span class="pyth-length-name ac-color">AC</span>
          <strong id="ac-value">5</strong>
        </div>
      </div>
    </section>

    <section class="math-explanation">
      <h2>Understanding the Pythagorean Theorem</h2>

      <p>
        In a right triangle, the square of the hypotenuse
        equals the sum of the squares of the other two sides.
      </p>

      <p>
        AB and BC are perpendicular at B, forming a
        90° angle. AC is the hypotenuse.
      </p>

      <p>
        Drag A vertically or C horizontally to change
        the triangle's dimensions. The side lengths
        and equation update automatically.
      </p>

      <p>
        Select Add Squares to compare the areas of
        the three squares constructed on the sides.
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

const $ = selector => document.querySelector(selector);
const svg = $('#triangle-svg');
const NS = 'http://www.w3.org/2000/svg';

const WIDTH = 800;
const HEIGHT = 600;
const UNIT = 22;
const MIN_SIDE = 0.5;
const MAX_SIDE = 20;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 8;

const colors = {
  ab: '#f59e0b',
  bc: '#16a34a',
  ac: '#2563eb'
};

const state = {
  ab: 3,
  bc: 4,
  bx: 330,
  by: 330,
  showSquares: false,
  camera: {
    x: 0,
    y: 0,
    width: WIDTH,
    height: HEIGHT
  },
  pointers: new Map(),
  gesture: null
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function format(value) {
  if (Math.abs(value) < 1e-10) return '0';
  return String(Number(value.toFixed(2)));
}

function getAC() {
  return Math.hypot(state.ab, state.bc);
}

function createSVG(tag, attributes = {}, parent = svg) {
  const element = document.createElementNS(NS, tag);

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, String(value));
  }

  parent.appendChild(element);
  return element;
}

function polygon(points, fill, stroke, width = 2) {
  return createSVG('polygon', {
    points: points.map(p => `${p.x},${p.y}`).join(' '),
    fill,
    stroke,
    'stroke-width': width,
    'stroke-linejoin': 'round'
  });
}

function drawLine(a, b, color, width = 3) {
  return createSVG('line', {
    x1: a.x,
    y1: a.y,
    x2: b.x,
    y2: b.y,
    stroke: color,
    'stroke-width': width,
    'stroke-linecap': 'round'
  });
}

function label(text, x, y, options = {}) {
  const element = createSVG('text', {
    x,
    y,
    fill: options.color || '#334155',
    'font-size': options.size || 17,
    'font-weight': options.weight || 650,
    'text-anchor': 'middle',
    'dominant-baseline': 'middle',
    'paint-order': 'stroke',
    stroke: '#ffffff',
    'stroke-width': 4,
    'stroke-linejoin': 'round',
    'pointer-events': 'none'
  });

  element.textContent = text;
  return element;
}

function getGeometry() {
  const h = state.ab * UNIT;
  const w = state.bc * UNIT;

  const B = {
    x: state.bx,
    y: state.by
  };

  const A = {
    x: B.x,
    y: B.y - h
  };

  const C = {
    x: B.x + w,
    y: B.y
  };

  const abSquare = [
    A,
    B,
    { x: B.x - h, y: B.y },
    { x: B.x - h, y: A.y }
  ];

  const bcSquare = [
    B,
    C,
    { x: C.x, y: C.y + w },
    { x: B.x, y: B.y + w }
  ];

  const acSquare = [
    A,
    C,
    { x: C.x + h, y: C.y - w },
    { x: A.x + h, y: A.y - w }
  ];

  return {
    A,
    B,
    C,
    h,
    w,
    abSquare,
    bcSquare,
    acSquare
  };
}

function drawHandle(name, point, color) {
  const group = createSVG('g', {
    'data-vertex': name,
    class: 'pyth-vertex'
  });

  createSVG('circle', {
    cx: point.x,
    cy: point.y,
    r: 24,
    fill: 'transparent',
    'pointer-events': 'all'
  }, group);

  createSVG('circle', {
    cx: point.x,
    cy: point.y,
    r: 9,
    fill: '#ffffff',
    stroke: color,
    'stroke-width': 3,
    'pointer-events': 'none'
  }, group);

  createSVG('circle', {
    cx: point.x,
    cy: point.y,
    r: 3,
    fill: color,
    'pointer-events': 'none'
  }, group);
}

function renderTriangle() {
  svg.replaceChildren();

  const {
    A,
    B,
    C,
    h,
    w,
    abSquare,
    bcSquare,
    acSquare
  } = getGeometry();

  const ab = state.ab;
  const bc = state.bc;
  const ac = getAC();

  if (state.showSquares) {
    polygon(
      abSquare,
      'rgba(245,158,11,0.16)',
      colors.ab,
      2
    );

    polygon(
      bcSquare,
      'rgba(22,163,74,0.14)',
      colors.bc,
      2
    );

    polygon(
      acSquare,
      'rgba(37,99,235,0.13)',
      colors.ac,
      2
    );

    label(
      `AB² = ${format(ab * ab)}`,
      B.x - h / 2,
      B.y - h / 2,
      { color: '#b45309', size: 14 }
    );

    label(
      `BC² = ${format(bc * bc)}`,
      B.x + w / 2,
      B.y + w / 2,
      { color: '#15803d', size: 14 }
    );

    label(
      `AC² = ${format(ac * ac)}`,
      B.x + (w + h) / 2,
      B.y - (h + w) / 2,
      { color: '#1d4ed8', size: 14 }
    );
  }

  polygon(
    [A, B, C],
    'rgba(37,99,235,0.06)',
    '#334155',
    2
  );

  drawLine(A, B, colors.ab, 3);
  drawLine(B, C, colors.bc, 3);
  drawLine(A, C, colors.ac, 3);

  const marker = Math.min(18, h * 0.22, w * 0.22);

  createSVG('path', {
    d: `
      M ${B.x} ${B.y - marker}
      L ${B.x + marker} ${B.y - marker}
      L ${B.x + marker} ${B.y}
    `,
    fill: 'none',
    stroke: '#475569',
    'stroke-width': 2,
    'pointer-events': 'none'
  });

  label(
    format(ab),
    B.x - 23,
    B.y - h / 2,
    { color: '#b45309' }
  );

  label(
    format(bc),
    B.x + w / 2,
    B.y + 23,
    { color: '#15803d' }
  );

  const normalX = -state.ab / ac;
  const normalY = state.bc / ac;

  label(
    format(ac),
    (A.x + C.x) / 2 + normalX * 23,
    (A.y + C.y) / 2 + normalY * 23,
    { color: '#1d4ed8' }
  );

  label('A', A.x - 18, A.y - 18);
  label('B', B.x - 18, B.y + 20);
  label('C', C.x + 18, C.y + 18);

  drawHandle('A', A, colors.ab);
  drawHandle('B', B, '#475569');
  drawHandle('C', C, colors.bc);
}

function updateValues() {
  const ab = state.ab;
  const bc = state.bc;
  const ac = getAC();

  $('#ab-value').textContent = format(ab);
  $('#bc-value').textContent = format(bc);
  $('#ac-value').textContent = format(ac);

  $('#pyth-calculation').textContent =
    `${format(ab)}² + ${format(bc)}² = ${format(ac)}²`;

  $('#pyth-result').textContent =
    `${format(ab * ab)} + ${format(bc * bc)} ≈ ${format(ac * ac)}`;

  renderTriangle();
}

function updateViewBox() {
  const c = state.camera;

  svg.setAttribute(
    'viewBox',
    `${c.x} ${c.y} ${c.width} ${c.height}`
  );
}

function currentZoom() {
  return WIDTH / state.camera.width;
}

function zoomAt(factor, worldX, worldY) {
  const old = state.camera;
  const targetZoom = clamp(
    currentZoom() * factor,
    MIN_ZOOM,
    MAX_ZOOM
  );

  const newWidth = WIDTH / targetZoom;
  const newHeight = HEIGHT / targetZoom;

  const ratioX = (worldX - old.x) / old.width;
  const ratioY = (worldY - old.y) / old.height;

  state.camera = {
    x: worldX - ratioX * newWidth,
    y: worldY - ratioY * newHeight,
    width: newWidth,
    height: newHeight
  };

  updateViewBox();
}

function zoomCenter(factor) {
  const c = state.camera;

  zoomAt(
    factor,
    c.x + c.width / 2,
    c.y + c.height / 2
  );
}

function resetView() {
  state.camera = {
    x: 0,
    y: 0,
    width: WIDTH,
    height: HEIGHT
  };

  updateViewBox();
}

function clientToWorld(clientX, clientY) {
  const matrix = svg.getScreenCTM();

  if (!matrix) return null;

  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;

  return point.matrixTransform(matrix.inverse());
}

function clientDeltaToWorld(dx, dy) {
  const rect = svg.getBoundingClientRect();

  const renderedWidth = Math.min(
    rect.width,
    rect.height * WIDTH / HEIGHT
  );

  const renderedHeight = renderedWidth * HEIGHT / WIDTH;

  return {
    x: dx * state.camera.width / renderedWidth,
    y: dy * state.camera.height / renderedHeight
  };
}

function pointerPair() {
  return [...state.pointers.values()].slice(0, 2);
}

function midpoint(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2
  };
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function beginPinch() {
  const [a, b] = pointerPair();

  if (!a || !b) return;

  const mid = midpoint(a, b);
  const world = clientToWorld(mid.x, mid.y);

  if (!world) return;

  state.gesture = {
    type: 'pinch',
    startDistance: Math.max(distance(a, b), 1),
    startMid: mid,
    startCamera: { ...state.camera },
    anchor: world
  };
}

svg.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' && event.button !== 0) {
    return;
  }

  event.preventDefault();

  state.pointers.set(event.pointerId, {
    x: event.clientX,
    y: event.clientY
  });

  svg.setPointerCapture(event.pointerId);

  if (state.pointers.size >= 2) {
    beginPinch();
    return;
  }

  const handle = event.target.closest('[data-vertex]');
  const vertex = handle
    ? handle.getAttribute('data-vertex')
    : null;

  const world = clientToWorld(
    event.clientX,
    event.clientY
  );

  if (!world) return;

  state.gesture = {
    type: vertex ? 'vertex' : 'pan',
    vertex,
    pointerId: event.pointerId,
    startWorld: world,
    startClient: {
      x: event.clientX,
      y: event.clientY
    },
    startAB: state.ab,
    startBC: state.bc,
    startBX: state.bx,
    startBY: state.by,
    startCamera: { ...state.camera }
  };

  svg.style.cursor = 'grabbing';
});

svg.addEventListener('pointermove', event => {
  if (!state.pointers.has(event.pointerId)) return;

  state.pointers.set(event.pointerId, {
    x: event.clientX,
    y: event.clientY
  });

  const gesture = state.gesture;

  if (!gesture) return;

  if (gesture.type === 'pinch') {
    if (state.pointers.size < 2) return;

    const [a, b] = pointerPair();
    const mid = midpoint(a, b);
    const newDistance = Math.max(distance(a, b), 1);

    const startZoom = WIDTH / gesture.startCamera.width;
    const targetZoom = clamp(
      startZoom * newDistance / gesture.startDistance,
      MIN_ZOOM,
      MAX_ZOOM
    );

    const newWidth = WIDTH / targetZoom;
    const newHeight = HEIGHT / targetZoom;

    const rect = svg.getBoundingClientRect();

    const scale = Math.min(
      rect.width / WIDTH,
      rect.height / HEIGHT
    );

    const displayedWidth = WIDTH * scale;
    const displayedHeight = HEIGHT * scale;

    const left = rect.left + (rect.width - displayedWidth) / 2;
    const top = rect.top + (rect.height - displayedHeight) / 2;

    const rx = clamp((mid.x - left) / displayedWidth, 0, 1);
    const ry = clamp((mid.y - top) / displayedHeight, 0, 1);

    state.camera = {
      x: gesture.anchor.x - rx * newWidth,
      y: gesture.anchor.y - ry * newHeight,
      width: newWidth,
      height: newHeight
    };

    updateViewBox();
    return;
  }

  if (gesture.pointerId !== event.pointerId) return;

  if (gesture.type === 'pan') {
    const dx = event.clientX - gesture.startClient.x;
    const dy = event.clientY - gesture.startClient.y;

    const movement = clientDeltaToWorld(dx, dy);

    state.camera.x = gesture.startCamera.x - movement.x;
    state.camera.y = gesture.startCamera.y - movement.y;

    updateViewBox();
    return;
  }

  const world = clientToWorld(
    event.clientX,
    event.clientY
  );

  if (!world) return;

  const dx = world.x - gesture.startWorld.x;
  const dy = world.y - gesture.startWorld.y;

  if (gesture.vertex === 'A') {
    state.ab = clamp(
      gesture.startAB - dy / UNIT,
      MIN_SIDE,
      MAX_SIDE
    );
  }

  if (gesture.vertex === 'C') {
    state.bc = clamp(
      gesture.startBC + dx / UNIT,
      MIN_SIDE,
      MAX_SIDE
    );
  }

  if (gesture.vertex === 'B') {
    state.bx = gesture.startBX + dx;
    state.by = gesture.startBY + dy;
  }

  updateValues();
});

function endPointer(event) {
  state.pointers.delete(event.pointerId);

  if (svg.hasPointerCapture(event.pointerId)) {
    svg.releasePointerCapture(event.pointerId);
  }

  if (state.pointers.size === 0) {
    state.gesture = null;
    svg.style.cursor = 'grab';
    return;
  }

  if (state.gesture?.type === 'pinch') {
    const remaining = [...state.pointers.entries()][0];

    if (!remaining) {
      state.gesture = null;
      return;
    }

    const [pointerId, point] = remaining;

    state.gesture = {
      type: 'pan',
      pointerId,
      startClient: { ...point },
      startCamera: { ...state.camera }
    };
  }
}

svg.addEventListener('pointerup', endPointer);
svg.addEventListener('pointercancel', endPointer);
svg.addEventListener('lostpointercapture', event => {
  if (state.pointers.has(event.pointerId)) {
    endPointer(event);
  }
});

svg.addEventListener('wheel', event => {
  event.preventDefault();

  const point = clientToWorld(
    event.clientX,
    event.clientY
  );

  if (!point) return;

  const factor = Math.exp(-event.deltaY * 0.0015);

  zoomAt(factor, point.x, point.y);
}, { passive: false });

$('#zoom-in').addEventListener('click', () => {
  zoomCenter(1.25);
});

$('#zoom-out').addEventListener('click', () => {
  zoomCenter(1 / 1.25);
});

$('#reset-view').addEventListener('click', resetView);

$('#toggle-squares').addEventListener('click', () => {
  state.showSquares = !state.showSquares;

  const button = $('#toggle-squares');

  button.textContent = state.showSquares
    ? 'Remove Squares'
    : 'Add Squares';

  button.setAttribute(
    'aria-pressed',
    String(state.showSquares)
  );

  renderTriangle();
});

$('#reset-triangle').addEventListener('click', () => {
  state.ab = 3;
  state.bc = 4;
  state.bx = 330;
  state.by = 330;
  state.showSquares = false;

  $('#toggle-squares').textContent = 'Add Squares';
  $('#toggle-squares').setAttribute('aria-pressed', 'false');

  updateValues();
});

updateViewBox();
updateValues();
