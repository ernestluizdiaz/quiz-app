import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { quizQuestions } from './quiz-data';
import { gradeQuiz } from './grading';
import { gradeRequestSchema } from './validation';

const app = new Hono();

app.use('/*', cors({
  origin: [
    'http://localhost:3000',
    'https://quiz-app-nu-cyan-69.vercel.app',
  ],
  credentials: true,
}));

app.get('/', (c) => c.text('Quiz API is running'));

app.get('/api/quiz', (c) => {
  try {
    const sanitizedQuestions = quizQuestions.map(q => {
      const { correctIndex, correctIndexes, correctText, ...rest } = q;
      return rest;
    });
    return c.json(sanitizedQuestions);
  } catch (error) {
    return c.json({ error: 'Failed to fetch quiz questions' }, 500);
  }
});

app.post('/api/grade', async (c) => {
  try {
    const body = await c.req.json();
    const validation = gradeRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return c.json({ 
        error: 'Invalid request format',
        details: validation.error.issues
      }, 400);
    }

    const gradeResult = gradeQuiz(quizQuestions, validation.data.answers);
    return c.json(gradeResult);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return c.json({ error: 'Invalid JSON' }, 400);
    }
    return c.json({ error: 'Failed to grade quiz' }, 500);
  }
});

export default app;  