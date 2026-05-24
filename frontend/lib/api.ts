import { IAssignment, IGeneratedPaper, ICreateFormData } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = "/sign-in";
    }
    throw new Error("Unauthorized");
  }
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

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  getAssignments: async (token?: string): Promise<IAssignment[]> => {
    try {
      const response = await fetch(`${BASE_URL}/assignments`, {
        method: 'GET',
        headers: getHeaders(token),
        cache: 'no-store'
      });
      const data = await handleResponse(response);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message || "Failed to fetch assignments");
    }
  },

  createAssignment: async (payload: ICreateFormData, token?: string): Promise<IAssignment> => {
    try {
      const numberOfQuestions = payload.questionTypeRows.reduce((sum, r) => sum + r.questions, 0);
      const totalMarks = payload.questionTypeRows.reduce((sum, r) => sum + (r.questions * r.marks), 0);
      const questionTypes = payload.questionTypeRows.map(r => r.type);

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
        headers: getHeaders(token),
        body: JSON.stringify(bodyPayload),
      });
      const data = await handleResponse(response);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message || "Failed to create assignment");
    }
  },

  getAssignment: async (id: string, token?: string): Promise<IAssignment> => {
    try {
      const response = await fetch(`${BASE_URL}/assignments/${id}`, {
        method: 'GET',
        headers: getHeaders(token),
        cache: 'no-store'
      });
      const data = await handleResponse(response);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message || "Failed to fetch assignment details");
    }
  },

  getPaper: async (id: string, token?: string): Promise<IGeneratedPaper | null> => {
    try {
      const response = await fetch(`${BASE_URL}/assignments/${id}/paper`, {
        method: 'GET',
        headers: getHeaders(token),
        cache: 'no-store'
      });

      if (response.status === 202) {
        return null;
      }

      const data = await handleResponse(response);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message || "Failed to fetch generated paper");
    }
  },

  deleteAssignment: async (id: string, token?: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/assignments/${id}`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });
      await handleResponse(response);
    } catch (err: any) {
      throw new Error(err.message || "Failed to delete assignment");
    }
  },

  regenerateAssignment: async (id: string, token?: string): Promise<IAssignment> => {
    try {
      const response = await fetch(`${BASE_URL}/assignments/${id}/regenerate`, {
        method: 'POST',
        headers: getHeaders(token),
      });
      const data = await handleResponse(response);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message || "Failed to regenerate assignment");
    }
  },

  updateQuestion: async (
    paperId: string,
    sectionIndex: number,
    questionIndex: number,
    updates: any,
    token?: string
  ): Promise<IGeneratedPaper> => {
    try {
      const response = await fetch(`${BASE_URL}/papers/${paperId}/question`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify({ sectionIndex, questionIndex, updates }),
      });
      const data = await handleResponse(response);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message || "Failed to update question");
    }
  },

  addQuestion: async (
    paperId: string,
    sectionIndex: number,
    question: any,
    token?: string
  ): Promise<IGeneratedPaper> => {
    try {
      const response = await fetch(`${BASE_URL}/papers/${paperId}/question`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ sectionIndex, question }),
      });
      const data = await handleResponse(response);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message || "Failed to add question");
    }
  },

  deleteQuestion: async (
    paperId: string,
    sectionIndex: number,
    questionIndex: number,
    token?: string
  ): Promise<IGeneratedPaper> => {
    try {
      const response = await fetch(`${BASE_URL}/papers/${paperId}/question`, {
        method: 'DELETE',
        headers: getHeaders(token),
        body: JSON.stringify({ sectionIndex, questionIndex }),
      });
      const data = await handleResponse(response);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message || "Failed to delete question");
    }
  },

  downloadPDF: async (id: string, token?: string): Promise<Blob> => {
    try {
      const response = await fetch(`${BASE_URL}/assignments/${id}/pdf`, {
        method: 'GET',
        headers: getHeaders(token),
      });
      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }
      return await response.blob();
    } catch (err: any) {
      throw new Error(err.message || "Failed to download PDF");
    }
  },

  regeneratePaper: async (id: string, token?: string): Promise<IAssignment> => {
    try {
      const response = await fetch(`${BASE_URL}/assignments/${id}/regenerate`, {
        method: 'POST',
        headers: getHeaders(token),
      });
      const data = await handleResponse(response);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message || "Failed to regenerate paper");
    }
  }
};
export default api;
