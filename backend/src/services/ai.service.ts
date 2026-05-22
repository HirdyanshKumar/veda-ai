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
    // Provide clean, high-fidelity mock fallback if no API key is set
    // to facilitate seamless testing of the queue, worker, and sockets without crashing!
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
    
    // Add small artificial delay to simulate real network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    return mockPaper;
  }

  // 1. Initialize Gemini
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // 2. Get Model
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // 3. Generate Prompt
  const prompt = buildPrompt(assignment);

  // 4. Generate Content
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // 5. Clean markdown fences
  const cleanedText = responseText.replace(/^\s*```json\s*|```\s*$/g, '').trim();

  let parsedData: any;
  try {
    parsedData = JSON.parse(cleanedText);
  } catch (err) {
    throw new Error("Failed to parse AI response as JSON");
  }

  // 6. Inject assignmentId
  parsedData.assignmentId = assignmentId;

  // 7. Zod validation
  const validation = generatedPaperSchema.safeParse(parsedData);
  if (!validation.success) {
    console.error("Zod Validation Error on AI payload:", validation.error);
    throw new Error("Invalid AI response structure");
  }

  return validation.data as IGeneratedPaper;
};
