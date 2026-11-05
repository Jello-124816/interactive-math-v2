
import { mountInteractiveVisual } from './interactive-visuals.js';

function addTextSection(container, heading, value) {
  if (typeof value !== 'string' || !value.trim()) {
    return;
  }

  const section = document.createElement('section');
  section.className = 'lesson-section';

  const title = document.createElement('h3');
  title.textContent = heading;

  const text = document.createElement('div');
  text.className = 'lesson-section-content';
  text.textContent = value;

  section.append(title, text);
  container.append(section);
}

export function renderLessonViewer(container, lesson) {
  container.replaceChildren();

  const viewer = document.createElement('article');
  viewer.className = 'lesson-viewer';

  const title = document.createElement('h2');
  title.className = 'lesson-viewer-title';
  title.textContent = lesson.title || 'Untitled Lesson';

  viewer.append(title);

  if (lesson.description) {
    const description = document.createElement('p');
    description.className = 'lesson-viewer-description';
    description.textContent = lesson.description;
    viewer.append(description);
  }

  addTextSection(viewer, 'Overview', lesson.overview);
  addTextSection(viewer, 'Theory and Formulas', lesson.theory);
  addTextSection(viewer, 'Worked Examples', lesson.examples);

  let cleanupVisual = () => {};

  if (typeof lesson.visualId === 'string' && lesson.visualId.trim()) {
    const section = document.createElement('section');
    section.className = 'lesson-section';

    const heading = document.createElement('h3');
    heading.textContent = 'Interactive Mathematics';

    const visualContainer = document.createElement('div');

    section.append(heading, visualContainer);
    viewer.append(section);

    // Only registered visual components can run.
    cleanupVisual = mountInteractiveVisual(
      visualContainer,
      lesson.visualId
    );
  }

  addTextSection(viewer, 'Exercises', lesson.exercises);

  container.append(viewer);

  return () => {
    cleanupVisual();
  };
}
