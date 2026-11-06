
const base = import.meta.env.BASE_URL;

// =====================================
// Main mathematics courses
// =====================================

export const freeCourses = [
  {
    id: 'algebra',
    title: 'Algebra',
    category: 'Mathematics Course',
    description:
      'Learn equations, functions, graphs, and essential algebraic concepts through structured topics and lessons.',
    icon: '📈',
    hasFree: true,
    hasPremium: true
  },

  {
    id: 'geometry',
    title: 'Geometry',
    category: 'Mathematics Course',
    description:
      'Study shapes, measurements, geometric relationships, and mathematical reasoning.',
    icon: '📐',
    hasFree: true,
    hasPremium: true
  },

  {
    id: 'sat-math',
    title: 'SAT Math Practices',
    category: 'Standardized Test Preparation',
    description:
      'Practice SAT Math questions covering Algebra, Advanced Math, Geometry and Trigonometry, and Problem-Solving and Data Analysis.',
    icon: '📝',
    hasFree: true,
    hasPremium: true
  }
];

// =====================================
// Existing Algebra and Geometry topics
// =====================================

export const interactiveTopics = [
  {
    id: 'linear',
    courseId: 'algebra',
    title: 'Linear Equations & Functions',
    category: 'Algebra',
    description:
      'Learn linear equations, functions, slope, intercepts, and graphs.',
    icon: '📈',
    url: `${base}linear.html`
  },

  {
    id: 'pythagorean',
    courseId: 'geometry',
    title: 'Pythagorean Theorem',
    category: 'Geometry',
    description:
      'Study right triangles and the relationship between their side lengths.',
    icon: '📐',
    url: `${base}pythagorean.html`
  }
];

// =====================================
// SAT Math categories
// =====================================

export const satCategories = [
  {
    id: 'advanced-math',
    title: 'Advanced Math',
    category: 'SAT Math',
    description:
      'Practice nonlinear equations, functions, and equivalent expressions.',
    icon: '📊'
  },

  {
    id: 'sat-algebra',
    title: 'Algebra',
    category: 'SAT Math',
    description:
      'Practice linear equations, inequalities, systems, and linear functions.',
    icon: '📈'
  },

  {
    id: 'geometry-trigonometry',
    title: 'Geometry and Trigonometry',
    category: 'SAT Math',
    description:
      'Practice area, volume, triangles, circles, and trigonometric relationships.',
    icon: '📐'
  },

  {
    id: 'problem-solving-data',
    title: 'Problem-Solving and Data Analysis',
    category: 'SAT Math',
    description:
      'Practice ratios, percentages, probability, statistics, and data interpretation.',
    icon: '📉'
  }
];

// =====================================
// Existing SAT Math practices
// =====================================

export const satPractices = [
  {
    id: 'sat-linear-equations',
    categoryId: 'sat-algebra',
    title: 'Linear Equations & Functions',
    category: 'SAT Algebra',
    description:
      'Practice linear equations, linear functions, slope, intercepts, and graphs.',
    icon: '📈'
  }
];
