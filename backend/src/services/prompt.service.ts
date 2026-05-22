import { IAssignmentInput } from '../types';

export const buildPrompt = (assignment: IAssignmentInput): string => {
  const subject = assignment.subject;
  const numberOfQuestions = assignment.numberOfQuestions;
  const totalMarks = assignment.totalMarks;
  const questionTypesStr = assignment.questionTypes.join(", ");
  const difficulty = assignment.difficulty;
  const additionalInstructions = assignment.additionalInstructions || "None";

  return `You are an expert teacher. Generate a question paper with the following requirements:
Subject: ${subject}
Total Questions: ${numberOfQuestions}
Total Marks: ${totalMarks}
Question Types: ${questionTypesStr}
Overall Difficulty: ${difficulty}
Additional Instructions: ${additionalInstructions}

Respond ONLY with a valid JSON object. No explanation, no markdown, no code blocks.
The JSON must follow this exact structure:
{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "text": "question text here",
          "difficulty": "easy",
          "marks": 2,
          "type": "MCQ"
        }
      ]
    }
  ]
}
Distribute questions across sections based on type. Assign marks so total adds up to ${totalMarks}.`;
};
