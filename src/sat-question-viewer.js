
import { satQuestions } from './sat-questions.js';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

let activeSatNavigationCleanup = null;

function getSolutionFileUrl(src) {
  const base = import.meta.env.BASE_URL;

  const path = String(src ?? '')
    .replace(/^\/+/, '')
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');

  return `${base}${path}`;
}

async function typesetMath(container) {
  try {
    if (!window.MathJax) return;

    if (window.MathJax.startup?.promise) {
      await window.MathJax.startup.promise;
    }

    if (!container.isConnected) return;

    if (typeof window.MathJax.typesetPromise === 'function') {
      await window.MathJax.typesetPromise([container]);
    }
  } catch (error) {
    console.error('MathJax rendering error:', error);
  }
}

function renderPdfSolution(container, block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'sat-solution-pdf';

  wrapper.style.width = '100%';
  wrapper.style.maxWidth = '100%';
  wrapper.style.margin = '20px 0';

  const controls = document.createElement('div');

  controls.style.display = 'flex';
  controls.style.alignItems = 'center';
  controls.style.justifyContent = 'center';
  controls.style.flexWrap = 'wrap';
  controls.style.gap = '12px';
  controls.style.marginBottom = '16px';

  function createControl(text, label) {
    const button = document.createElement('button');

    button.type = 'button';
    button.textContent = text;
    button.setAttribute('aria-label', label);

    button.style.padding = '8px 14px';
    button.style.border = '1px solid #cbd5e1';
    button.style.borderRadius = '8px';
    button.style.background = '#ffffff';
    button.style.color = '#1e293b';
    button.style.font = 'inherit';
    button.style.fontSize = '15px';
    button.style.fontWeight = '600';
    button.style.cursor = 'pointer';

    return button;
  }

  const zoomOut = createControl('−', 'Zoom out');
  const zoomIn = createControl('+', 'Zoom in');
  const resetZoom = createControl('Reset', 'Reset zoom');

  const zoomLabel = document.createElement('span');

  zoomLabel.style.minWidth = '54px';
  zoomLabel.style.textAlign = 'center';
  zoomLabel.style.fontSize = '14px';
  zoomLabel.style.fontWeight = '600';
  zoomLabel.style.color = '#334155';

  controls.append(
    zoomOut,
    zoomLabel,
    zoomIn,
    resetZoom
  );

  const viewport = document.createElement('div');

  viewport.style.width = '100%';
  viewport.style.maxWidth = '100%';
  viewport.style.overflowX = 'auto';
  viewport.style.overflowY = 'visible';
  viewport.style.background = '#f1f5f9';
  viewport.style.border = '1px solid #e2e8f0';
  viewport.style.borderRadius = '8px';
  viewport.style.boxSizing = 'border-box';
  viewport.style.padding = '8px 0';
  viewport.style.webkitOverflowScrolling = 'touch';

  const pages = document.createElement('div');

  pages.style.display = 'flex';
  pages.style.flexDirection = 'column';
  pages.style.alignItems = 'flex-start';
  pages.style.gap = '16px';
  pages.style.width = 'max-content';
  pages.style.minWidth = '100%';

  viewport.append(pages);

  const status = document.createElement('p');

  status.textContent = 'Loading PDF solution...';
  status.style.color = '#64748b';
  status.style.fontSize = '14px';
  status.style.marginTop = '10px';

  wrapper.append(
    controls,
    viewport,
    status
  );

  container.append(wrapper);

  const pdfUrl = getSolutionFileUrl(block.src);

  let pdfDocument = null;
  let loadingPromise = null;
  let zoom = 1;
  let renderVersion = 0;
  let activeTasks = [];

  const minZoom = 0.75;
  const maxZoom = 3;
  const zoomStep = 0.25;

  function updateZoomControls() {
    zoomLabel.textContent = `${Math.round(zoom * 100)}%`;

    zoomOut.disabled = zoom <= minZoom;
    zoomIn.disabled = zoom >= maxZoom;

    zoomOut.style.opacity =
      zoomOut.disabled ? '0.5' : '1';

    zoomIn.style.opacity =
      zoomIn.disabled ? '0.5' : '1';
  }

  async function renderPages() {
    if (!pdfDocument) return;

    const version = ++renderVersion;

    activeTasks.forEach(task => {
      task.cancel();
    });

    activeTasks = [];

    pages.replaceChildren();

    status.textContent = 'Rendering PDF...';

    try {
      const availableWidth = Math.max(
        100,
        viewport.clientWidth - 4
      );

      for (
        let pageNumber = 1;
        pageNumber <= pdfDocument.numPages;
        pageNumber++
      ) {
        if (version !== renderVersion) return;

        const page = await pdfDocument.getPage(pageNumber);

        if (version !== renderVersion) return;

        const originalViewport = page.getViewport({
          scale: 1
        });

        const fitScale =
          availableWidth / originalViewport.width;

        const displayScale = fitScale * zoom;

        const pageViewport = page.getViewport({
          scale: displayScale
        });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
          throw new Error('Canvas is not supported.');
        }

        const pixelRatio = Math.min(
          window.devicePixelRatio || 1,
          2
        );

        canvas.width = Math.ceil(
          pageViewport.width * pixelRatio
        );

        canvas.height = Math.ceil(
          pageViewport.height * pixelRatio
        );

        canvas.style.display = 'block';
        canvas.style.width = `${pageViewport.width}px`;
        canvas.style.height = `${pageViewport.height}px`;
        canvas.style.background = '#ffffff';
        canvas.style.boxShadow =
          '0 1px 4px rgba(0, 0, 0, 0.12)';

        const pageWrapper = document.createElement('div');

        pageWrapper.style.flex = '0 0 auto';
        pageWrapper.style.margin = '0 auto';

        pageWrapper.append(canvas);
        pages.append(pageWrapper);

        const renderTask = page.render({
          canvasContext: context,
          viewport: pageViewport,
          transform: [
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
          ]
        });

        activeTasks.push(renderTask);

        await renderTask.promise;

        activeTasks = activeTasks.filter(
          task => task !== renderTask
        );
      }

      if (version === renderVersion) {
        status.textContent = '';
      }

    } catch (error) {
      if (version !== renderVersion) return;

      if (error?.name === 'RenderingCancelledException') {
        return;
      }

      console.error('PDF rendering error:', error);

      status.textContent =
        'Unable to display the PDF solution.';
    }
  }

  function changeZoom(nextZoom) {
    const newZoom = Math.max(
      minZoom,
      Math.min(maxZoom, nextZoom)
    );

    if (newZoom === zoom) return;

    zoom = newZoom;

    updateZoomControls();

    if (pdfDocument) {
      renderPages();
    }
  }

  zoomOut.addEventListener('click', () => {
    changeZoom(zoom - zoomStep);
  });

  zoomIn.addEventListener('click', () => {
    changeZoom(zoom + zoomStep);
  });

  resetZoom.addEventListener('click', () => {
    changeZoom(1);
  });

  updateZoomControls();

  async function loadPdf() {
    if (pdfDocument) {
      renderPages();
      return;
    }

    if (loadingPromise) {
      return;
    }

    loadingPromise = (async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl
        });

        pdfDocument = await loadingTask.promise;

        const details = wrapper.closest('details');

        if (!details || details.open) {
          renderPages();
        }

      } catch (error) {
        console.error('PDF loading error:', error);

        status.textContent =
          'Unable to load the PDF solution. Please check the file.';
      } finally {
        loadingPromise = null;
      }
    })();

    await loadingPromise;
  }

  const details = container.closest('details');

  if (details) {
    details.addEventListener('toggle', () => {
      if (details.open) {
        loadPdf();
      } else {
        renderVersion++;

        activeTasks.forEach(task => {
          task.cancel();
        });

        activeTasks = [];
      }
    });

    if (details.open) {
      loadPdf();
    }
  } else {
    loadPdf();
  }
}

function renderQuestionBlocks(container, blocks = []) {
  let paragraph = null;

  function getParagraph() {
    if (!paragraph) {
      paragraph = document.createElement('p');
      paragraph.className = 'sat-question-paragraph';
      container.append(paragraph);
    }

    return paragraph;
  }

  function endParagraph() {
    paragraph = null;
  }

  blocks.forEach(block => {
    if (block.type === 'text') {
      const content = String(block.content ?? '');

      const p = getParagraph();

      if (
        p.childNodes.length > 0 &&
        content.length > 0 &&
        !/^\s/.test(content)
      ) {
        const previous = p.lastChild;
        const previousText = previous?.textContent ?? '';

        if (
          previous?.nodeType === Node.ELEMENT_NODE ||
          (previousText && !/\s$/.test(previousText))
        ) {
          p.append(document.createTextNode(' '));
        }
      }

      p.append(document.createTextNode(content));
    }

    else if (block.type === 'math') {
      const p = getParagraph();

      const math = document.createElement('span');
      math.className = 'sat-inline-math';

      math.textContent = `\\(${block.content}\\)`;

      if (p.childNodes.length > 0) {
        const previousText =
          p.lastChild?.textContent ?? '';

        if (
          previousText &&
          !/\s$/.test(previousText)
        ) {
          p.append(document.createTextNode(' '));
        }
      }

      p.append(math);
    }

    else if (block.type === 'paragraph') {
      endParagraph();

      const p = document.createElement('p');
      p.className = 'sat-question-paragraph';
      p.textContent = String(block.content ?? '');

      container.append(p);
    }

    else if (block.type === 'display-math') {
      endParagraph();

      const math = document.createElement('div');
      math.className = 'sat-display-math';
      math.textContent = `\\[${block.content}\\]`;

      container.append(math);
    }

    else if (block.type === 'image') {
      endParagraph();

      const figure = document.createElement('figure');
      figure.className = 'sat-question-figure';

      const image = document.createElement('img');
      image.src = block.src;
      image.alt = block.alt || 'SAT Math question diagram';
      image.loading = 'lazy';

      figure.append(image);

      if (block.caption) {
        const caption = document.createElement('figcaption');
        caption.textContent = block.caption;
        figure.append(caption);
      }

      container.append(figure);
    }

    else if (block.type === 'svg') {
      endParagraph();

      const figure = document.createElement('figure');
      figure.className = 'sat-question-figure';

      figure.style.margin = '20px 0';
      figure.style.width = '100%';

      const image = document.createElement('img');

      image.src = getSolutionFileUrl(block.src);
      image.alt = block.alt || 'SAT Math SVG solution';
      image.loading = 'lazy';

      image.style.display = 'block';
      image.style.width = '100%';
      image.style.height = 'auto';
      image.style.maxWidth = '100%';

      figure.append(image);

      if (block.caption) {
        const caption = document.createElement('figcaption');
        caption.textContent = block.caption;
        figure.append(caption);
      }

      container.append(figure);
    }

    else if (block.type === 'pdf') {
      endParagraph();

      renderPdfSolution(container, block);
    }
  });
}

export function renderSatQuestion(container, questionId) {
  if (typeof activeSatNavigationCleanup === 'function') {
    activeSatNavigationCleanup();
    activeSatNavigationCleanup = null;
  }

  if (typeof container._satNavigationCleanup === 'function') {
    container._satNavigationCleanup();
    container._satNavigationCleanup = null;
  }

  const question = satQuestions.find(
    item => item.id === questionId
  );

  container.replaceChildren();

  if (!question) {
    const message = document.createElement('p');
    message.textContent = 'Question not found.';
    container.append(message);
    return;
  }

  const content = document.createElement('div');
  content.className = 'sat-question-content';

  renderQuestionBlocks(content, question.blocks || []);

  container.append(content);

  const solutionDetails = document.createElement('details');
  solutionDetails.className = 'sat-solution-details';

  const solutionSummary = document.createElement('summary');
  solutionSummary.textContent = 'See Solution';

  const solutionContent = document.createElement('div');
  solutionContent.className = 'sat-solution-content';

  solutionDetails.append(
    solutionSummary,
    solutionContent
  );

  container.append(solutionDetails);

  if (
    Array.isArray(question.solution) &&
    question.solution.length > 0
  ) {
    renderQuestionBlocks(
      solutionContent,
      question.solution
    );
  } else {
    const placeholder = document.createElement('p');
    placeholder.textContent =
      'The step-by-step solution will be added soon.';

    solutionContent.append(placeholder);
  }

  const navigationButton = document.createElement('button');
  navigationButton.type = 'button';
  navigationButton.className = 'sat-question-solution-navigation';

  navigationButton.style.position = 'fixed';
  navigationButton.style.right = 'max(16px, env(safe-area-inset-right))';
  navigationButton.style.bottom = 'max(20px, env(safe-area-inset-bottom))';
  navigationButton.style.zIndex = '1000';
  navigationButton.style.display = 'none';
  navigationButton.style.alignItems = 'center';
  navigationButton.style.justifyContent = 'center';
  navigationButton.style.gap = '7px';
  navigationButton.style.padding = '9px 13px';
  navigationButton.style.border = '1px solid #cbd5e1';
  navigationButton.style.borderRadius = '9px';
  navigationButton.style.background = '#ffffff';
  navigationButton.style.color = '#2563eb';
  navigationButton.style.font = 'inherit';
  navigationButton.style.fontSize = '13px';
  navigationButton.style.fontWeight = '600';
  navigationButton.style.lineHeight = '1.3';
  navigationButton.style.cursor = 'pointer';
  navigationButton.style.boxShadow =
    '0 2px 10px rgba(15, 23, 42, 0.10)';
  navigationButton.style.maxWidth = 'calc(100vw - 32px)';

  document.body.append(navigationButton);

  let navigationFrame = null;
  let navigationTarget = null;
  let navigationActive = true;
  let navigationEnabled = false;
  let navigationObserver = null;

  function getScrollOffset() {
    const header = document.querySelector('header');

    if (!header) return 16;

    const style = window.getComputedStyle(header);

    if (
      style.position !== 'fixed' &&
      style.position !== 'sticky'
    ) {
      return 16;
    }

    const rect = header.getBoundingClientRect();

    if (rect.bottom <= 0 || rect.top > 0) {
      return 16;
    }

    return Math.max(16, rect.bottom + 12);
  }

  function scrollToSection(element) {
    if (!element) return;

    const top =
      window.scrollY +
      element.getBoundingClientRect().top -
      getScrollOffset();

    window.scrollTo({
      top: Math.max(0, top),
      behavior: 'smooth'
    });
  }

  function getQuestionHeading() {
    const number = String(
      question.number || question.id
    ).trim();

    const possibleHeadings = document.querySelectorAll(
      'h1, h2, h3, h4, h5, h6'
    );

    for (const heading of possibleHeadings) {
      if (
        heading.textContent.trim() === number &&
        heading.getBoundingClientRect().width > 0
      ) {
        return heading;
      }
    }

    return content;
  }

  function getSolutionControls() {
    return solutionContent.querySelector(
      '.sat-solution-pdf > div'
    ) || solutionContent;
  }

  function getPdfViewport() {
    const pdf = solutionContent.querySelector(
      '.sat-solution-pdf'
    );

    if (!pdf) return solutionContent;

    return pdf.children[1] || pdf;
  }

  function isVisible(element) {
    if (!element || !element.isConnected) {
      return false;
    }

    const rect = element.getBoundingClientRect();

    const visibleTop = getScrollOffset();
    const visibleBottom = window.innerHeight;

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom > visibleTop &&
      rect.top < visibleBottom
    );
  }

  function setNavigationTarget(target) {
    navigationTarget = target;

    if (
      !navigationActive ||
      !navigationEnabled ||
      !solutionDetails.open
    ) {
      navigationButton.style.display = 'none';
      return;
    }

    if (target === 'solution') {
      navigationButton.textContent = '↓ Go to Solution';
      navigationButton.setAttribute(
        'aria-label',
        'Go to Solution'
      );
      navigationButton.style.display = 'flex';
    } else if (target === 'question') {
      navigationButton.textContent = '↑ Go to Question';
      navigationButton.setAttribute(
        'aria-label',
        'Go to Question'
      );
      navigationButton.style.display = 'flex';
    } else {
      navigationButton.style.display = 'none';
    }
  }

  function updateNavigationButton() {
    if (!navigationActive) return;

    if (
      !navigationEnabled ||
      !container.isConnected ||
      !content.isConnected ||
      !solutionDetails.isConnected ||
      !solutionDetails.open
    ) {
      setNavigationTarget(null);
      return;
    }

    const questionVisible = isVisible(content);
    const pdfVisible = isVisible(getPdfViewport());

    if (questionVisible && pdfVisible) {
      setNavigationTarget(null);
      return;
    }

    if (questionVisible && !pdfVisible) {
      setNavigationTarget('solution');
      return;
    }

    if (!questionVisible && pdfVisible) {
      setNavigationTarget('question');
      return;
    }

    const questionRect = content.getBoundingClientRect();
    const solutionRect =
      getSolutionControls().getBoundingClientRect();

    if (window.innerHeight <= questionRect.top) {
      setNavigationTarget('question');
    } else if (solutionRect.top >= window.innerHeight) {
      setNavigationTarget('solution');
    } else if (questionRect.bottom <= getScrollOffset()) {
      setNavigationTarget('question');
    } else {
      setNavigationTarget('solution');
    }
  }

  function scheduleNavigationUpdate() {
    if (!navigationActive) return;

    if (navigationFrame !== null) return;

    navigationFrame = window.requestAnimationFrame(() => {
      navigationFrame = null;
      updateNavigationButton();
    });
  }

  navigationButton.addEventListener('click', () => {
    if (
      !navigationEnabled ||
      !solutionDetails.open
    ) {
      return;
    }

    if (navigationTarget === 'solution') {
      scrollToSection(getSolutionControls());
    } else if (navigationTarget === 'question') {
      scrollToSection(getQuestionHeading());
    }
  });

  function onSolutionToggle() {
    if (!navigationActive) return;

    if (solutionDetails.open) {
      navigationEnabled = true;
      typesetMath(solutionContent);
    } else {
      navigationEnabled = false;
      setNavigationTarget(null);
    }

    scheduleNavigationUpdate();
  }

  function cleanupNavigation() {
    if (!navigationActive) return;

    navigationActive = false;
    navigationEnabled = false;

    window.removeEventListener(
      'scroll',
      scheduleNavigationUpdate
    );

    window.removeEventListener(
      'resize',
      scheduleNavigationUpdate
    );

    solutionDetails.removeEventListener(
      'toggle',
      onSolutionToggle
    );

    if (navigationFrame !== null) {
      window.cancelAnimationFrame(navigationFrame);
      navigationFrame = null;
    }

    if (navigationObserver) {
      navigationObserver.disconnect();
      navigationObserver = null;
    }

    navigationButton.remove();

    if (container._satNavigationCleanup === cleanupNavigation) {
      container._satNavigationCleanup = null;
    }

    if (activeSatNavigationCleanup === cleanupNavigation) {
      activeSatNavigationCleanup = null;
    }
  }

  solutionDetails.addEventListener(
    'toggle',
    onSolutionToggle
  );

  window.addEventListener(
    'scroll',
    scheduleNavigationUpdate,
    { passive: true }
  );

  window.addEventListener(
    'resize',
    scheduleNavigationUpdate
  );

  navigationObserver = new MutationObserver(() => {
    if (
      !content.isConnected ||
      !solutionDetails.isConnected ||
      !container.isConnected
    ) {
      cleanupNavigation();
    }
  });

  navigationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  container._satNavigationCleanup = cleanupNavigation;
  activeSatNavigationCleanup = cleanupNavigation;

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.textContent = '← Back to Questions';

  backButton.style.display = 'block';
  backButton.style.marginTop = '28px';
  backButton.style.padding = '12px 20px';
  backButton.style.border = '1px solid #cbd5e1';
  backButton.style.borderRadius = '10px';
  backButton.style.background = 'transparent';
  backButton.style.color = '#2563eb';
  backButton.style.font = 'inherit';
  backButton.style.fontWeight = '600';
  backButton.style.cursor = 'pointer';

  backButton.addEventListener('click', () => {
    cleanupNavigation();

    const existingBackButton =
      document.querySelector('#library-back');

    existingBackButton?.click();
  });

  container.append(backButton);

  typesetMath(content);
}
