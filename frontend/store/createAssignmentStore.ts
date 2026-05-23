import { create } from 'zustand';

export interface QuestionTypeItem {
  id: string;
  type: string;
  questions: number;
  marks: number;
}

interface CreateAssignmentStore {
  questionTypes: QuestionTypeItem[];
  dueDate: string;
  additionalInfo: string;
  
  setDueDate: (date: string) => void;
  setAdditionalInfo: (info: string) => void;
  addQuestionType: () => void;
  removeQuestionType: (id: string) => void;
  updateQuestionType: (id: string, field: 'type' | 'questions' | 'marks', value: any) => void;
  
  getTotalQuestions: () => number;
  getTotalMarks: () => number;
}

const defaultQuestionTypes: QuestionTypeItem[] = [
  { id: '1', type: 'Multiple Choice Questions', questions: 4, marks: 1 },
  { id: '2', type: 'Short Questions', questions: 3, marks: 2 },
  { id: '3', type: 'Diagram/Graph-Based Questions', questions: 5, marks: 5 },
  { id: '4', type: 'Numerical Problems', questions: 5, marks: 5 },
];

export const useCreateAssignmentStore = create<CreateAssignmentStore>((set, get) => ({
  questionTypes: defaultQuestionTypes,
  dueDate: '',
  additionalInfo: '',
  
  setDueDate: (date) => set({ dueDate: date }),
  setAdditionalInfo: (info) => set({ additionalInfo: info }),
  
  addQuestionType: () => set((state) => {
    const newId = Math.random().toString(36).substring(2, 9);
    return {
      questionTypes: [
        ...state.questionTypes,
        { id: newId, type: 'Multiple Choice Questions', questions: 1, marks: 1 }
      ]
    };
  }),
  
  removeQuestionType: (id) => set((state) => ({
    questionTypes: state.questionTypes.filter((item) => item.id !== id)
  })),
  
  updateQuestionType: (id, field, value) => set((state) => ({
    questionTypes: state.questionTypes.map((item) => 
      item.id === id ? { ...item, [field]: value } : item
    )
  })),
  
  getTotalQuestions: () => {
    return get().questionTypes.reduce((sum, item) => sum + Number(item.questions || 0), 0);
  },
  
  getTotalMarks: () => {
    return get().questionTypes.reduce((sum, item) => sum + (Number(item.questions || 0) * Number(item.marks || 0)), 0);
  }
}));
