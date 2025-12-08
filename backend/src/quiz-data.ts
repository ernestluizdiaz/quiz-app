export interface Question {
  id: string;
  type: 'text' | 'checkbox' | 'radio';
  question: string;
  choices?: string[];
  correctIndex?: number;
  correctIndexes?: number[];
  correctText?: string;
}

export const quizQuestions: Question[] = [
  {
    id: 'q1',
    type: 'radio',
    question: 'What does JSX stand for?',
    choices: ['JavaScript XML', 'JavaScript Extension', 'Java Syntax Extension', 'JavaScript Execution'],
    correctIndex: 0
  },
  {
    id: 'q2',
    type: 'checkbox',
    question: 'Which of these are React hooks? (Select all that apply)',
    choices: ['useState', 'useEffect', 'useStyle', 'useContext', 'useClass'],
    correctIndexes: [0, 1, 3]
  },
  {
    id: 'q3',
    type: 'text',
    question: 'What HTTP status code indicates a successful response?',
    correctText: '200'
  },
  {
    id: 'q4',
    type: 'radio',
    question: 'Which company developed Next.js?',
    choices: ['Meta', 'Vercel', 'Google', 'Netflix'],
    correctIndex: 1
  },
  {
    id: 'q5',
    type: 'checkbox',
    question: 'Which are valid CSS display values? (Select all that apply)',
    choices: ['flex', 'grid', 'table', 'hidden', 'inline-block'],
    correctIndexes: [0, 1, 2, 4]
  },
  {
    id: 'q6',
    type: 'text',
    question: 'What is the default port for a Next.js development server?',
    correctText: '3000'
  },
  {
    id: 'q7',
    type: 'radio',
    question: 'What does API stand for?',
    choices: ['Application Programming Interface', 'Advanced Programming Integration', 'Application Process Integration', 'Advanced Protocol Interface'],
    correctIndex: 0
  },
  {
    id: 'q8',
    type: 'checkbox',
    question: 'Which HTTP methods are idempotent? (Select all that apply)',
    choices: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    correctIndexes: [0, 2, 3]
  },
  {
    id: 'q9',
    type: 'text',
    question: 'What keyword is used to define a constant in JavaScript?',
    correctText: 'const'
  },
  {
    id: 'q10',
    type: 'radio',
    question: 'Which rendering strategy does Next.js use by default in App Router?',
    choices: ['Client-side Rendering', 'Static Site Generation', 'Server Components', 'Incremental Static Regeneration'],
    correctIndex: 2
  }
];