import mongoose, { Schema, Document } from 'mongoose';

export interface IClassDocument extends Document {
  teacherId: string;
  name: string;
  subject: string;
  grade: string;
  joinCode: string;
  studentIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema: Schema = new Schema(
  {
    teacherId: {
      type: String,
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters']
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: 50
    },
    grade: {
      type: String,
      required: [true, 'Grade is required'],
      trim: true,
      maxlength: 20
    },
    joinCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    studentIds: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

ClassSchema.index({ teacherId: 1, createdAt: -1 });

export function generateJoinCode(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export default mongoose.models.Class || mongoose.model<IClassDocument>('Class', ClassSchema);
