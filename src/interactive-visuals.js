
import './interactive-visuals.css';

function createLinearGraph(container) {
  let slope = 1;
  let intercept = 0;

  container.innerHTML = `
    <div class="visual-graph">
      <h4>Interactive Graph</h4>

      <p class="visual-equation" aria-live="polite"></p>

      <canvas
        class="visual-canvas"
        width="600"
        height="360"
        aria-label="Interactive linear function graph"
        role="img"
      ></canvas>

      <div class="visual-control">
        <label for="visual-slope">Slope (a)</label>
        <input
          id="visual-slope"
          type="range"
          min="-5"
          max="5"
          step="0.5"
          value="1"
        />
        <output id="visual-slope-value">1</output>
      </div>

      <div class="visual-control">
        <label for="visual-intercept">Intercept (b)</label>
        <input
          id="visual-intercept"
          type="range"
          min="-5"
          max="5"
          step="0.5"
          value="0"
        />
        <output id="visual-intercept-value">0</output>
      </div>
    </div>
  `;

  const canvas = container.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const equation = container.querySelector('.visual-equation');

  const slopeInput = container.querySelector('#visual-slope');
  const interceptInput = container.querySelector('#visual-intercept');

  const slopeValue = container.querySelector('#visual-slope-value');
  const interceptValue = container.querySelector('#visual-intercept-value');

  function draw() {
    const width = canvas.width;
    const height = canvas.height;
    const scale = 30;

    const originX = width / 2;
    const originY = height / 2;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;

    ctx.beginPath();

    for (let pixelX = 0; pixelX <= width; pixelX++) {
      const x = (pixelX - originX) / scale;
      const y = slope * x + intercept;
      const pixelY = originY - y * scale;

      if (pixelX === 0) {
        ctx.moveTo(pixelX, pixelY);
      } else {
        ctx.lineTo(pixelX, pixelY);
      }
    }

    ctx.stroke();

    slopeValue.textContent = slope;
    interceptValue.textContent = intercept;

    const sign = intercept >= 0 ? '+' : '−';

    equation.textContent =
      `y = ${slope}x ${sign} ${Math.abs(intercept)}`;
  }

  function update() {
    slope = Number(slopeInput.value);
    intercept = Number(interceptInput.value);
    draw();
  }

  slopeInput.addEventListener('input', update);
  interceptInput.addEventListener('input', update);

  draw();

  return () => {
    slopeInput.removeEventListener('input', update);
    interceptInput.removeEventListener('input', update);
  };
}

const visualRegistry = {
  'linear-graph': createLinearGraph
};

export function mountInteractiveVisual(container, visualId) {
  const factory = visualRegistry[visualId];

  if (!factory) {
    container.textContent = 'Visual not available.';
    return () => {};
  }

  return factory(container);
}
