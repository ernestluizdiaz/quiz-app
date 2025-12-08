import { z } from 'zod';

export const answerSchema = z.object({
  id: z.union([z.string(), z.number()]),
  value: z.union([z.string(), z.number(), z.array(z.number())])
});

export const gradeRequestSchema = z.object({
  answers: z.array(answerSchema)
});

// ✅ Correct use of z.infer
export type AnswerInput = z.infer<typeof answerSchema>;
export type GradeRequest = z.infer<typeof gradeRequestSchema>;
