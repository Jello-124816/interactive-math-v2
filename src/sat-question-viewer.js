
import { satQuestions } from './sat-questions.js';

/**
 * Render question content while preserving natural
 * paragraph flow and inline mathematical expressions.
 */
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

      // Preserve spaces provided by the question data.
      // Add a separator only when consecutive blocks
      // otherwise have no whitespace between them.
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

      const base = import.meta.env.BASE_URL;
      const path = String(block.src ?? '')
        .replace(/^\/+/, '')
        .split('/')
        .map(segment => encodeURIComponent(segment))
        .join('/');

      image.src = `${base}${path}`;
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
  });
}

/**
 * Render the selected SAT question.
 *
 * @param {HTMLElement} container
 * @param {string} questionId
 */
export function renderSatQuestion(container, questionId) {
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

  // Keep the solution hidden until the user opens it.
  const solutionDetails = document.createElement('details');
  solutionDetails.className = 'sat-solution-details';

  const solutionSummary = document.createElement('summary');
  solutionSummary.textContent = 'See Solution';

  const solutionContent = document.createElement('div');
  solutionContent.className = 'sat-solution-content';

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

  solutionDetails.append(
    solutionSummary,
    solutionContent
  );

  container.append(solutionDetails);

  // Back to Questions button below the solution
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
    const existingBackButton =
      document.querySelector('#library-back');

    existingBackButton?.click();
  });

  container.append(backButton);

  // Typeset LaTeX after adding the question to the DOM.
  if (window.MathJax?.typesetPromise) {
    window.MathJax.typesetPromise([container]).catch(error => {
      console.error('MathJax rendering error:', error);
    });
  }
}
