export interface IQuestion {
  text: string;
  difficulty: "easy" | "medium" | "hard";
  marks: number;
  type: string;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IGeneratedPaper {
  _id: string;
  assignmentId: string;
  sections: ISection[];
}

export interface IAssignment {
  _id: string;
  title: string;
  subject: string;
  dueDate: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  difficulty: "easy" | "medium" | "hard";
  additionalInstructions?: string;
  fileUrl?: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface IQuestionTypeRow {
  id: string;
  type: string;
  questions: number;
  marks: number;
}

export interface ICreateFormData {
  title: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  dueDate: string;
  questionTypeRows: IQuestionTypeRow[];
  additionalInstructions: string;
  fileUrl?: string;
}

export interface NavItem {
  label: string;
  icon: any;
  href: string;
  active?: boolean;
}
