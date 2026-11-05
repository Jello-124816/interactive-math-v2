
export function createCard(item, type, onNavigate) {
  const isLink = Boolean(item.url);

  const isNavigationCard =
    type === 'course' ||
    type === 'sat-category' ||
    type === 'practice';

  const card = document.createElement(
    isLink ? 'a' : isNavigationCard ? 'button' : 'div'
  );

  card.className = 'topic-card';

  if (isLink) {
    card.href = item.url;
  } else if (isNavigationCard) {
    card.type = 'button';
    card.style.textAlign = 'left';
    card.style.font = 'inherit';
    card.style.color = 'inherit';
    card.style.cursor = 'pointer';

    card.addEventListener('click', () => {
      onNavigate(type, item);
    });
  }

  const icon = document.createElement('div');
  icon.className = 'topic-icon';
  icon.textContent = item.icon || '📝';

  const category = document.createElement('span');
  category.className = 'topic-category';
  category.textContent = item.category || '';

  const title = document.createElement('h3');

  if (item.title.endsWith('(Free)')) {
    const mainTitle = document.createTextNode(
      item.title.replace(/\s*\(Free\)$/, ' ')
    );

    const freeLabel = document.createElement('span');
    freeLabel.textContent = '(Free)';
    freeLabel.style.color = '#16a34a';
    freeLabel.style.fontWeight = '700';

    title.append(mainTitle, freeLabel);
  } else {
    title.textContent = item.title;
  }

  const description = document.createElement('p');
  description.textContent = item.description || '';

  const action = document.createElement('span');
  action.className = 'topic-action';

  if (type === 'course') {
    action.textContent = `Explore ${item.title} →`;
  } else if (type === 'sat-category') {
    action.textContent = 'Explore Practices →';
  } else if (type === 'practice') {
    action.textContent = 'Start Practice →';
  } else if (isLink) {
    action.textContent = 'Explore Interactive →';
  } else {
    action.textContent = 'Coming Soon';
  }

  card.append(icon, category, title, description, action);

  return card;
}
