
/**
 * Creates a card for courses, topics, SAT categories,
 * and SAT practice sections.
 *
 * Main course cards have separate Free and Premium buttons.
 */

export function createCard(item, type, onNavigate) {
  const card = document.createElement('article');
  card.className = 'topic-card';

  const icon = document.createElement('div');
  icon.className = 'topic-icon';
  icon.textContent = item.icon || '📚';

  const category = document.createElement('span');
  category.className = 'topic-category';
  category.textContent = item.category || '';

  const title = document.createElement('h3');
  title.className = 'topic-title';
  title.textContent = item.title;

  const description = document.createElement('p');
  description.className = 'topic-description';
  description.textContent = item.description || '';

  card.append(icon, category, title, description);

  // -------------------------------------
  // Main course cards
  // -------------------------------------

  if (type === 'course') {
    const actions = document.createElement('div');
    actions.className = 'course-access-actions';

    Object.assign(actions.style, {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      marginTop: 'auto',
      paddingTop: '18px'
    });

    // Free button
    if (item.hasFree !== false) {
      const freeButton = document.createElement('button');
      freeButton.type = 'button';
      freeButton.textContent = 'Free';

      Object.assign(freeButton.style, {
        flex: '1',
        minWidth: '100px',
        padding: '11px 16px',
        backgroundColor: '#16a34a',
        color: '#ffffff',
        border: 'none',
        borderRadius: '9px',
        fontFamily: 'inherit',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, transform 0.2s ease'
      });

      freeButton.addEventListener('mouseenter', () => {
        freeButton.style.backgroundColor = '#15803d';
        freeButton.style.transform = 'translateY(-2px)';
      });

      freeButton.addEventListener('mouseleave', () => {
        freeButton.style.backgroundColor = '#16a34a';
        freeButton.style.transform = 'translateY(0)';
      });

      freeButton.addEventListener('click', () => {
        onNavigate('course', item);
      });

      actions.append(freeButton);
    }

    // Premium button
    if (item.hasPremium !== false) {
      const premiumButton = document.createElement('button');
      premiumButton.type = 'button';
      premiumButton.textContent = 'Premium';

      Object.assign(premiumButton.style, {
        flex: '1',
        minWidth: '100px',
        padding: '11px 16px',
        backgroundColor: '#7c3aed',
        color: '#ffffff',
        border: 'none',
        borderRadius: '9px',
        fontFamily: 'inherit',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, transform 0.2s ease'
      });

      premiumButton.addEventListener('mouseenter', () => {
        premiumButton.style.backgroundColor = '#6d28d9';
        premiumButton.style.transform = 'translateY(-2px)';
      });

      premiumButton.addEventListener('mouseleave', () => {
        premiumButton.style.backgroundColor = '#7c3aed';
        premiumButton.style.transform = 'translateY(0)';
      });

      premiumButton.addEventListener('click', () => {
        onNavigate('premium', item);
      });

      actions.append(premiumButton);
    }

    card.append(actions);
    return card;
  }

  // -------------------------------------
  // Topic, SAT category, and practice cards
  // -------------------------------------

  const exploreButton = document.createElement('button');
  exploreButton.type = 'button';
  exploreButton.className = 'topic-card-button';

  // Updated button text
  exploreButton.textContent = item.url
    ? 'Open →'
    : 'Explore →';

  Object.assign(exploreButton.style, {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    alignSelf: 'flex-start',
    marginTop: '18px',
    padding: '11px 20px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontFamily: 'inherit',
    fontSize: '15px',
    fontWeight: '600',
    lineHeight: '1.4',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, transform 0.2s ease'
  });

  exploreButton.addEventListener('mouseenter', () => {
    exploreButton.style.backgroundColor = '#1d4ed8';
    exploreButton.style.transform = 'translateY(-2px)';
  });

  exploreButton.addEventListener('mouseleave', () => {
    exploreButton.style.backgroundColor = '#2563eb';
    exploreButton.style.transform = 'translateY(0)';
  });

  exploreButton.addEventListener('click', () => {
    if (item.url) {
      window.location.href = item.url;
    } else {
      onNavigate(type, item);
    }
  });

  card.append(exploreButton);

  return card;
}
