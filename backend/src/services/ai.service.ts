import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAssignmentInput, IGeneratedPaper } from '../types';
import { buildPrompt } from './prompt.service';
import { generatedPaperSchema } from '../validators/assignment.validator';

export const generatePaper = async (
  assignment: IAssignmentInput,
  assignmentId: string
): Promise<IGeneratedPaper> => {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_key_here') {
    console.warn("GOOGLE_GEMINI_API_KEY not set. Generating high-fidelity mock CBSE science paper.");
    
    const mockPaper: IGeneratedPaper = {
      assignmentId,
      sections: [
        {
          title: "Section A",
          instruction: "Attempt all questions. Each question carries 2 marks.",
          questions: [
            {
              text: "Explain the two main components of an ecosystem with appropriate examples.",
              difficulty: "easy",
              marks: 2,
              type: "Short Questions"
            },
            {
              text: "Distinguish between a physical change and a chemical change using clean scientific tables.",
              difficulty: "medium",
              marks: 2,
              type: "Short Questions"
            }
          ]
        },
        {
          title: "Section B",
          instruction: "Numerical problems. Show all formulas and step-by-step calculations.",
          questions: [
            {
              text: "A force of 50 N acts on an area of 2 square meters. Calculate the pressure exerted on the surface.",
              difficulty: "hard",
              marks: 4,
              type: "Numerical Problems"
            }
          ]
        }
      ]
    };
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    return mockPaper;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = buildPrompt(assignment);

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const cleanedText = responseText.replace(/^\s*```json\s*|```\s*$/g, '').trim();

  let parsedData: any;
  try {
    parsedData = JSON.parse(cleanedText);
  } catch (err) {
    throw new Error("Failed to parse AI response as JSON");
  }

  parsedData.assignmentId = assignmentId;

  const validation = generatedPaperSchema.safeParse(parsedData);
  if (!validation.success) {
    console.error("Zod Validation Error on AI payload:", validation.error);
    throw new Error("Invalid AI response structure");
  }

  return validation.data as IGeneratedPaper;
};
