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
  assignmentId: string;
  sections: ISection[];
}

export interface IAssignmentInput {
  title: string;
  subject: string;
  dueDate: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  difficulty: "easy" | "medium" | "hard";
  additionalInstructions?: string;
  fileUrl?: string;
}

export interface IJobPayload {
  assignmentId: string;
}
