
const base = import.meta.env.BASE_URL;

export const freeCourses = [
  {
    id: 'algebra',
    title: 'Algebra',
    category: 'Free Course',
    description:
      'Explore equations, functions, and graphs through interactive mathematics.',
    icon: '📈'
  },
  {
    id: 'geometry',
    title: 'Geometry',
    category: 'Free Course',
    description:
      'Explore shapes, measurements, and geometric relationships through interactive diagrams.',
    icon: '📐'
  },
  {
    id: 'sat-math',
    title: 'SAT Math Practices',
    category: 'Free Course',
    description:
      'Practice SAT Math questions across the four Digital SAT mathematics domains.',
    icon: '📝'
  }
];

export const interactiveTopics = [
  {
    id: 'linear',
    courseId: 'algebra',
    title: 'Linear Equations & Functions',
    category: 'Algebra',
    description:
      'Explore linear equations, functions, slope, intercepts, and graphs using interactive visuals.',
    icon: '📈',
    url: `${base}linear.html`
  },
  {
    id: 'pythagorean',
    courseId: 'geometry',
    title: 'Pythagorean Theorem',
    category: 'Geometry',
    description:
      'Adjust the sides of a right triangle and explore the squares constructed on each side.',
    icon: '📐',
    url: `${base}pythagorean.html`
  }
];

export const satCategories = [
  {
    id: 'advanced-math',
    title: 'Advanced Math (Free)',
    category: 'SAT Math',
    description:
      'Practice nonlinear equations, functions, and equivalent expressions.',
    icon: '📊'
  },
  {
    id: 'sat-algebra',
    title: 'Algebra (Free)',
    category: 'SAT Math',
    description:
      'Practice linear equations, inequalities, systems, and linear functions.',
    icon: '📈'
  },
  {
    id: 'geometry-trigonometry',
    title: 'Geometry and Trigonometry (Free)',
    category: 'SAT Math',
    description:
      'Practice area, volume, triangles, circles, and trigonometric relationships.',
    icon: '📐'
  },
  {
    id: 'problem-solving-data',
    title: 'Problem-Solving and Data Analysis (Free)',
    category: 'SAT Math',
    description:
      'Practice ratios, percentages, probability, statistics, and data interpretation.',
    icon: '📉'
  }
];

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
