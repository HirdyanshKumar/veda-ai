import { IAssignment, IGeneratedPaper, ICreateFormData } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = "An error occurred during the request";
    try {
      const errorData = await response.json();
      errorMessage = errorData?.message || errorData?.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  const result = await response.json();
  return result;
};

export const api = {
  getAssignments: async (): Promise<IAssignment[]> => {
    try {
      const response = await fetch(`${BASE_URL}/assignments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      const data = await handleResponse(response);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message || "Failed to fetch assignments");
    }
  },

  createAssignment: async (payload: ICreateFormData): Promise<IAssignment> => {
    try {
      const numberOfQuestions = payload.questionTypeRows.reduce((sum, r) => sum + r.questions, 0);
      const totalMarks = payload.questionTypeRows.reduce((sum, r) => sum + (r.questions * r.marks), 0);
      const questionTypes = payload.questionTypeRows.map(r => r.type);

      // Parse DD-MM-YYYY -> ISO string before sending
      let formattedDueDate = payload.dueDate;
      if (payload.dueDate.includes('-')) {
        const parts = payload.dueDate.split('-');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);
          const parsed = new Date(year, month, day);
          if (!isNaN(parsed.getTime())) {
            formattedDueDate = parsed.toISOString();
          }
        }
      }

      const bodyPayload = {
        title: payload.title,
        subject: payload.subject,
        dueDate: formattedDueDate,
        difficulty: payload.difficulty,
        additionalInstructions: payload.additionalInstructions,
        fileUrl: payload.fileUrl,
        numberOfQuestions,
        totalMarks,
        questionTypes
      };

      const response = await fetch(`${BASE_URL}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      });
      const data = await handleResponse(response);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message || "Failed to create assignment");
    }
  },

  getAssignment: async (id: string): Promise<IAssignment> => {
    try {
      const response = await fetch(`${BASE_URL}/assignments/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      const data = await handleResponse(response);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message || "Failed to fetch assignment details");
    }
  },

  getPaper: async (id: string): Promise<IGeneratedPaper | null> => {
    try {
      const response = await fetch(`${BASE_URL}/assignments/${id}/paper`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      if (response.status === 202) {
        return null; // still processing
      }

      const data = await handleResponse(response);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message || "Failed to fetch generated paper");
    }
  },

  deleteAssignment: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/assignments/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      await handleResponse(response);
    } catch (err: any) {
      throw new Error(err.message || "Failed to delete assignment");
    }
  }
};
