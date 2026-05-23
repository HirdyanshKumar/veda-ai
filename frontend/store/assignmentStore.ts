import { create } from 'zustand';
import { IAssignment, IGeneratedPaper, ICreateFormData, IQuestionTypeRow } from '../types';
import { api } from '../lib/api';

interface AssignmentStore {
  // Assignments list
  assignments: IAssignment[];
  isLoadingList: boolean;
  listError: string | null;
  fetchAssignments: (token?: string) => Promise<void>;
  setAssignments: (assignments: IAssignment[]) => void;
  deleteAssignment: (id: string, token?: string) => Promise<void>;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  clearMenu: () => void;

  // Create form
  currentStep: 1 | 2;
  formData: ICreateFormData;
  isSubmitting: boolean;
  submitError: string | null;
  setStep: (step: 1 | 2) => void;
  updateFormData: (data: Partial<ICreateFormData>) => void;
  addQuestionTypeRow: () => void;
  removeQuestionTypeRow: (id: string) => void;
  updateQuestionTypeRow: (id: string, field: keyof IQuestionTypeRow, value: any) => void;
  submitAssignment: (token?: string) => Promise<string>; // returns assignmentId
  resetForm: () => void;
  setSubmitting: (submitting: boolean) => void;

  // Generated paper
  currentPaper: IGeneratedPaper | null;
  paperLoading: boolean;
  paperError: string | null;
  setPaper: (paper: IGeneratedPaper) => void;
  setPaperError: (error: string | null) => void;
  fetchPaper: (id: string, token?: string) => Promise<void>;

  // Computed
  totalQuestions: () => number;
  totalMarks: () => number;

  // Reset
  resetStore: () => void;
}

const initialFormData = (): ICreateFormData => ({
  title: "",
  subject: "",
  difficulty: "medium",
  dueDate: "",
  questionTypeRows: [
    { id: "1", type: "Multiple Choice Questions", questions: 4, marks: 1 }
  ],
  additionalInstructions: "",
});

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  // Assignments list state
  assignments: [],
  isLoadingList: false,
  listError: null,
  openMenuId: null,

  setAssignments: (assignments) => set({ assignments }),

  fetchAssignments: async (token?: string) => {
    set({ isLoadingList: true, listError: null });
    try {
      const data = await api.getAssignments(token);
      set({ assignments: data, isLoadingList: false });
    } catch (error: any) {
      set({ listError: error.message || "Failed to fetch assignments", isLoadingList: false });
    }
  },

  deleteAssignment: async (id: string, token?: string) => {
    try {
      await api.deleteAssignment(id, token);
      set((state) => ({
        assignments: state.assignments.filter((a) => a._id !== id)
      }));
    } catch (error: any) {
      throw error;
    }
  },

  setOpenMenuId: (id) => set({ openMenuId: id }),
  clearMenu: () => set({ openMenuId: null }),

  // Create form state
  currentStep: 1,
  formData: initialFormData(),
  isSubmitting: false,
  submitError: null,

  setStep: (step) => set({ currentStep: step }),
  setSubmitting: (submitting) => set({ isSubmitting: submitting }),

  updateFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),

  addQuestionTypeRow: () => set((state) => {
    const newId = (state.formData.questionTypeRows.length + 1).toString();
    const newRow: IQuestionTypeRow = {
      id: Date.now().toString() + "-" + newId,
      type: "Short Questions",
      questions: 2,
      marks: 2
    };
    return {
      formData: {
        ...state.formData,
        questionTypeRows: [...state.formData.questionTypeRows, newRow]
      }
    };
  }),

  removeQuestionTypeRow: (id) => set((state) => ({
    formData: {
      ...state.formData,
      questionTypeRows: state.formData.questionTypeRows.filter(r => r.id !== id)
    }
  })),

  updateQuestionTypeRow: (id, field, value) => set((state) => ({
    formData: {
      ...state.formData,
      questionTypeRows: state.formData.questionTypeRows.map(r => 
        r.id === id ? { ...r, [field]: value } : r
      )
    }
  })),

  submitAssignment: async (token?: string) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const assignment = await api.createAssignment(get().formData, token);
      set((state) => ({
        assignments: [assignment, ...state.assignments],
        isSubmitting: false
      }));
      return assignment._id;
    } catch (error: any) {
      set({ submitError: error.message || "Failed to create assignment", isSubmitting: false });
      throw error;
    }
  },

  resetForm: () => set({
    currentStep: 1,
    formData: initialFormData(),
    submitError: null,
    isSubmitting: false
  }),

  // Generated paper state
  currentPaper: null,
  paperLoading: false,
  paperError: null,

  setPaper: (paper) => set({ currentPaper: paper, paperLoading: false, paperError: null }),
  setPaperError: (error) => set({ paperError: error, paperLoading: false }),

  fetchPaper: async (id: string, token?: string) => {
    set({ paperLoading: true, paperError: null, currentPaper: null });
    try {
      const paper = await api.getPaper(id, token);
      if (paper === null) {
        set({ paperLoading: true }); // still waiting for socket
      } else {
        set({ currentPaper: paper, paperLoading: false });
      }
    } catch (error: any) {
      set({ paperError: error.message || "Failed to fetch generated paper", paperLoading: false });
    }
  },

  resetStore: () => set({
    assignments: [],
    currentPaper: null,
    formData: initialFormData(),
    currentStep: 1,
    submitError: null,
    paperError: null,
    listError: null,
    isLoadingList: false,
    paperLoading: false
  }),

  // Computed properties
  totalQuestions: () => {
    return get().formData.questionTypeRows.reduce((sum, r) => sum + r.questions, 0);
  },

  totalMarks: () => {
    return get().formData.questionTypeRows.reduce((sum, r) => sum + (r.questions * r.marks), 0);
  }
}));
export default useAssignmentStore;
