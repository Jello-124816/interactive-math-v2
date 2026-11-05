
export class CoordinatePlane {
  constructor(container) {
    this.container = container;

    this.width = 800;
    this.height = 520;

    this.centerX = 0;
    this.centerY = 0;
    this.pixelsPerUnit = 45;
    this.gridOpacity = 0.35;

    this.functions = [];
    this.pointers = new Map();

    this.ns = "http://www.w3.org/2000/svg";

    this.svg = document.createElementNS(this.ns, "svg");
    this.svg.setAttribute("viewBox", "0 0 800 520");
    this.svg.setAttribute("role", "img");
    this.svg.setAttribute(
      "aria-label",
      "Interactive Cartesian coordinate plane"
    );

    Object.assign(this.svg.style, {
      width: "100%",
      height: "100%",
      display: "block",
      touchAction: "none",
      cursor: "grab",
      userSelect: "none"
    });

    this.container.appendChild(this.svg);

    this.installEvents();
    this.render();
  }

  element(tag, attrs = {}, parent = this.svg) {
    const node = document.createElementNS(this.ns, tag);

    for (const [key, value] of Object.entries(attrs)) {
      node.setAttribute(key, String(value));
    }

    parent.appendChild(node);
    return node;
  }

  toScreen(x, y) {
    return {
      x: this.width / 2 +
        (x - this.centerX) * this.pixelsPerUnit,
      y: this.height / 2 -
        (y - this.centerY) * this.pixelsPerUnit
    };
  }

  toWorld(x, y) {
    return {
      x: this.centerX +
        (x - this.width / 2) / this.pixelsPerUnit,
      y: this.centerY -
        (y - this.height / 2) / this.pixelsPerUnit
    };
  }

  niceStep() {
    const target = 75 / this.pixelsPerUnit;
    const magnitude = 10 ** Math.floor(Math.log10(target));
    const ratio = target / magnitude;

    const factor =
      ratio <= 1 ? 1 :
      ratio <= 2 ? 2 :
      ratio <= 5 ? 5 : 10;

    return factor * magnitude;
  }

  format(value) {
    if (Math.abs(value) < 1e-10) return "0";
    return String(Number(value.toPrecision(7)));
  }

  setFunctions(functions) {
    this.functions = functions;
    this.render();
  }

  setGridOpacity(value) {
    this.gridOpacity = Math.max(0, Math.min(1, value));
    this.render();
  }

  zoom(factor, screenX = 400, screenY = 260) {
    const before = this.toWorld(screenX, screenY);

    this.pixelsPerUnit = Math.max(
      4,
      Math.min(600, this.pixelsPerUnit * factor)
    );

    const after = this.toWorld(screenX, screenY);

    this.centerX += before.x - after.x;
    this.centerY += before.y - after.y;

    this.render();
  }

  pan(dx, dy) {
    this.centerX -= dx / this.pixelsPerUnit;
    this.centerY += dy / this.pixelsPerUnit;
    this.render();
  }

  resetView() {
    this.centerX = 0;
    this.centerY = 0;
    this.pixelsPerUnit = 45;
    this.render();
  }

  render() {
    this.svg.replaceChildren();

    this.element("rect", {
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      fill: "#ffffff"
    });

    const step = this.niceStep();

    const left = this.toWorld(0, 0).x;
    const right = this.toWorld(this.width, 0).x;
    const top = this.toWorld(0, 0).y;
    const bottom = this.toWorld(0, this.height).y;

    // Grid
    const grid = this.element("g", {
      stroke: "#94a3b8",
      "stroke-width": 1,
      opacity: this.gridOpacity
    });

    for (
      let i = Math.ceil(left / step);
      i <= Math.floor(right / step);
      i++
    ) {
      const sx = this.toScreen(i * step, 0).x;

      this.element("line", {
        x1: sx,
        y1: 0,
        x2: sx,
        y2: this.height
      }, grid);
    }

    for (
      let i = Math.ceil(bottom / step);
      i <= Math.floor(top / step);
      i++
    ) {
      const sy = this.toScreen(0, i * step).y;

      this.element("line", {
        x1: 0,
        y1: sy,
        x2: this.width,
        y2: sy
      }, grid);
    }

    // Axes
    const origin = this.toScreen(0, 0);

    const axes = this.element("g", {
      stroke: "#475569",
      "stroke-width": 1.7
    });

    if (origin.y >= 0 && origin.y <= this.height) {
      this.element("line", {
        x1: 0,
        y1: origin.y,
        x2: this.width,
        y2: origin.y
      }, axes);
    }

    if (origin.x >= 0 && origin.x <= this.width) {
      this.element("line", {
        x1: origin.x,
        y1: 0,
        x2: origin.x,
        y2: this.height
      }, axes);
    }

    // Axis labels
    const labels = this.element("g", {
      fill: "#64748b",
      "font-size": 12,
      "font-family": "Arial, sans-serif"
    });

    const labelY = Math.max(
      15,
      Math.min(this.height - 8, origin.y + 17)
    );

    const labelX = Math.max(
      6,
      Math.min(this.width - 48, origin.x + 8)
    );

    for (
      let i = Math.ceil(left / step);
      i <= Math.floor(right / step);
      i++
    ) {
      if (i === 0) continue;

      const sx = this.toScreen(i * step, 0).x;

      const label = this.element("text", {
        x: sx + 3,
        y: labelY
      }, labels);

      label.textContent = this.format(i * step);
    }

    for (
      let i = Math.ceil(bottom / step);
      i <= Math.floor(top / step);
      i++
    ) {
      if (i === 0) continue;

      const sy = this.toScreen(0, i * step).y;

      const label = this.element("text", {
        x: labelX,
        y: sy - 5
      }, labels);

      label.textContent = this.format(i * step);
    }

    if (
      origin.x >= 0 && origin.x <= this.width &&
      origin.y >= 0 && origin.y <= this.height
    ) {
      const zero = this.element("text", {
        x: origin.x + 5,
        y: origin.y + 16
      }, labels);

      zero.textContent = "0";
    }

    // Graph functions
    const graphs = this.element("g", {
      fill: "none",
      "stroke-width": 3,
      "stroke-linecap": "round"
    });

    for (const graph of this.functions) {
      if (graph.type !== "linear") continue;

      const { m, b } = graph;

      let start = left;
      let end = right;

      if (m === 0) {
        if (b < bottom || b > top) continue;
      } else {
        const a = (bottom - b) / m;
        const c = (top - b) / m;

        start = Math.max(left, Math.min(a, c));
        end = Math.min(right, Math.max(a, c));
      }

      if (start > end) continue;

      const p1 = this.toScreen(start, m * start + b);
      const p2 = this.toScreen(end, m * end + b);

      this.element("line", {
        x1: p1.x,
        y1: p1.y,
        x2: p2.x,
        y2: p2.y,
        stroke: graph.color || "#2563eb"
      }, graphs);
    }
  }

  installEvents() {
    const getPoint = event => {
      const rect = this.svg.getBoundingClientRect();

      return {
        x: (event.clientX - rect.left) *
          this.width / rect.width,
        y: (event.clientY - rect.top) *
          this.height / rect.height
      };
    };

    this.svg.addEventListener("wheel", event => {
      event.preventDefault();

      const point = getPoint(event);
      const factor = Math.exp(-event.deltaY * 0.001);

      this.zoom(factor, point.x, point.y);
    }, { passive: false });

    this.svg.addEventListener("pointerdown", event => {
      this.svg.setPointerCapture(event.pointerId);

      this.pointers.set(event.pointerId, getPoint(event));
      this.svg.style.cursor = "grabbing";
    });

    this.svg.addEventListener("pointermove", event => {
      if (!this.pointers.has(event.pointerId)) return;

      const oldPoints = [...this.pointers.values()];
      const previous = this.pointers.get(event.pointerId);
      const current = getPoint(event);

      this.pointers.set(event.pointerId, current);

      const points = [...this.pointers.values()];

      if (points.length === 1) {
        this.pan(
          current.x - previous.x,
          current.y - previous.y
        );
      }

      if (points.length === 2 && oldPoints.length === 2) {
        const oldMid = {
          x: (oldPoints[0].x + oldPoints[1].x) / 2,
          y: (oldPoints[0].y + oldPoints[1].y) / 2
        };

        const newMid = {
          x: (points[0].x + points[1].x) / 2,
          y: (points[0].y + points[1].y) / 2
        };

        const oldDistance = Math.hypot(
          oldPoints[0].x - oldPoints[1].x,
          oldPoints[0].y - oldPoints[1].y
        );

        const newDistance = Math.hypot(
          points[0].x - points[1].x,
          points[0].y - points[1].y
        );

        this.pan(
          newMid.x - oldMid.x,
          newMid.y - oldMid.y
        );

        if (oldDistance > 0) {
          this.zoom(
            newDistance / oldDistance,
            newMid.x,
            newMid.y
          );
        }
      }
    });

    const release = event => {
      this.pointers.delete(event.pointerId);

      if (this.pointers.size === 0) {
        this.svg.style.cursor = "grab";
      }
    };

    this.svg.addEventListener("pointerup", release);
    this.svg.addEventListener("pointercancel", release);
    this.svg.addEventListener("lostpointercapture", release);
  }
}
