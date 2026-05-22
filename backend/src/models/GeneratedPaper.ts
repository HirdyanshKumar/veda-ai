import { Schema, model, Document, Types } from 'mongoose';
import { IQuestion, ISection } from '../types';

export interface IGeneratedPaperDoc extends Document {
  assignmentId: Types.ObjectId;
  sections: ISection[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  text: {
    type: String,
    required: [true, 'Question text is required']
  },
  difficulty: {
    type: String,
    enum: {
      values: ['easy', 'medium', 'hard'],
      message: 'Question difficulty must be easy, medium, or hard'
    },
    required: [true, 'Question difficulty is required']
  },
  marks: {
    type: Number,
    required: [true, 'Question marks is required'],
    min: [1, 'Question marks must be at least 1']
  },
  type: {
    type: String,
    required: [true, 'Question type is required']
  }
}, { _id: false });

const SectionSchema = new Schema<ISection>({
  title: {
    type: String,
    required: [true, 'Section title is required']
  },
  instruction: {
    type: String,
    required: [true, 'Section instruction is required']
  },
  questions: {
    type: [QuestionSchema],
    required: [true, 'Section questions are required'],
    validate: {
      validator: function(v: IQuestion[]) {
        return v && v.length > 0;
      },
      message: 'A section must contain at least one question'
    }
  }
}, { _id: false });

const GeneratedPaperSchema = new Schema<IGeneratedPaperDoc>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: [true, 'Assignment reference is required'],
      unique: true
    },
    sections: {
      type: [SectionSchema],
      required: [true, 'Sections are required'],
      validate: {
        validator: function(v: ISection[]) {
          return v && v.length > 0;
        },
        message: 'A generated paper must contain at least one section'
      }
    }
  },
  {
    timestamps: true
  }
);

export const GeneratedPaper = model<IGeneratedPaperDoc>('GeneratedPaper', GeneratedPaperSchema);
