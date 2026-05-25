import { z } from 'zod';

export const assignmentInputSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  subject: z.string().min(1, "Subject is required"),
  dueDate: z.string().min(1, "Due date is required"),
  questionTypes: z.array(z.string()).min(1, "Must select at least one question type"),
  numberOfQuestions: z.number().int().positive("Number of questions must be positive"),
  totalMarks: z.number().int().positive("Total marks must be positive"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  additionalInstructions: z.string().max(500, "Instructions cannot exceed 500 characters").optional(),
  fileUrl: z.string().optional(),
  classId: z.string().optional()
});

const questionSchema = z.object({
  text: z.string().min(1, "Question text cannot be empty"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  marks: z.number().positive("Question marks must be positive"),
  type: z.string().min(1, "Question type cannot be empty")
});

const sectionSchema = z.object({
  title: z.string().min(1, "Section title cannot be empty"),
  instruction: z.string().min(1, "Section instruction cannot be empty"),
  questions: z.array(questionSchema).min(1, "Section must contain at least one question")
});

export const generatedPaperSchema = z.object({
  assignmentId: z.string(),
  sections: z.array(sectionSchema).min(1, "Paper must contain at least one section")
});
