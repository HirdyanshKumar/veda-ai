import { Schema, model, Document } from 'mongoose';

export interface IAssignmentDoc extends Document {
  userId: string;
  title: string;
  subject: string;
  dueDate: Date;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  additionalInstructions?: string;
  fileUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignmentDoc>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long']
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    },
    questionTypes: {
      type: [String],
      required: [true, 'Question types are required'],
      validate: {
        validator: function(v: string[]) {
          return v && v.length > 0;
        },
        message: 'Must specify at least one question type'
      }
    },
    numberOfQuestions: {
      type: Number,
      required: [true, 'Number of questions is required'],
      min: [1, 'Number of questions must be at least 1']
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required'],
      min: [1, 'Total marks must be at least 1']
    },
    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty must be either easy, medium, or hard'
      },
      required: [true, 'Difficulty is required']
    },
    additionalInstructions: {
      type: String,
      trim: true,
      maxlength: [500, 'Instructions must be less than 500 characters']
    },
    fileUrl: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for optimized filtering
AssignmentSchema.index({ userId: 1, createdAt: -1 });

export const Assignment = model<IAssignmentDoc>('Assignment', AssignmentSchema);
