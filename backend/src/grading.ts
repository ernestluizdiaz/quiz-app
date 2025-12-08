import { Question } from './quiz-data';
import { AnswerInput } from './validation';

export interface GradeResult {
  id: string | number;
  correct: boolean;
}

export interface GradeResponse {
  score: number;
  total: number;
  results: GradeResult[];
}

export function gradeQuiz(questions: Question[], answers: AnswerInput[]): GradeResponse {
  const results: GradeResult[] = [];
  let score = 0;

  for (const answer of answers) {
    const question = questions.find(q => q.id === answer.id);
    
    if (!question) {
      results.push({ id: answer.id, correct: false });
      continue;
    }

    let isCorrect = false;

    switch (question.type) {
      case 'text':
        isCorrect = String(answer.value).trim().toLowerCase() === 
                    String(question.correctText).trim().toLowerCase();
        break;

      case 'radio':
        isCorrect = Number(answer.value) === question.correctIndex;
        break;

      case 'checkbox':
        if (Array.isArray(answer.value) && question.correctIndexes) {
          const sorted1 = [...answer.value].sort();
          const sorted2 = [...question.correctIndexes].sort();
          isCorrect = JSON.stringify(sorted1) === JSON.stringify(sorted2);
        }
        break;
    }

    results.push({ id: answer.id, correct: isCorrect });
    if (isCorrect) score++;
  }

  return {
    score,
    total: questions.length,
    results
  };
}
