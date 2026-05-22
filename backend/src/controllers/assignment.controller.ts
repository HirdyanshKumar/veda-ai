import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Assignment } from '../models/Assignment';
import { GeneratedPaper } from '../models/GeneratedPaper';
import { assignmentInputSchema } from '../validators/assignment.validator';
import { addGenerationJob } from '../queues/generation.queue';

const isValidObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};

export const createAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Zod validation
    const validation = assignmentInputSchema.safeParse(req.body);
    if (!validation.success) {
      const formattedErrors = validation.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors
      });
      return;
    }

    const validatedData = validation.data;

    // Parse DD-MM-YYYY due date to Date object
    let parsedDueDate = new Date();
    if (validatedData.dueDate.includes('-')) {
      const parts = validatedData.dueDate.split('-');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        parsedDueDate = new Date(year, month, day);
      }
    } else {
      parsedDueDate = new Date(validatedData.dueDate);
    }

    // 2. Save Assignment to DB
    const assignment = new Assignment({
      title: validatedData.title,
      subject: validatedData.subject,
      dueDate: parsedDueDate,
      questionTypes: validatedData.questionTypes,
      numberOfQuestions: validatedData.numberOfQuestions,
      totalMarks: validatedData.totalMarks,
      difficulty: validatedData.difficulty,
      additionalInstructions: validatedData.additionalInstructions,
      fileUrl: validatedData.fileUrl,
      status: 'pending'
    });

    await assignment.save();

    // 3. Queue generation job
    await addGenerationJob(assignment._id.toString());

    // 4. Return created assignment
    res.status(201).json({
      success: true,
      data: assignment
    });

  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const dbErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      res.status(400).json({
        success: false,
        message: "Database validation failed",
        errors: dbErrors
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getAssignments = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: assignments
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // 1. Validate ObjectId
    if (!isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid assignment ID format"
      });
      return;
    }

    // 2. Fetch assignment
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      res.status(404).json({
        success: false,
        message: "Assignment not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: assignment
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getGeneratedPaper = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // 1. Validate ObjectId
    if (!isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid assignment ID format"
      });
      return;
    }

    // 2. Fetch assignment
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      res.status(404).json({
        success: false,
        message: "Assignment not found"
      });
      return;
    }

    // 3. Evaluate active status
    if (assignment.status === 'pending' || assignment.status === 'processing') {
      res.status(202).json({
        success: true,
        message: "Paper is being generated",
        status: assignment.status
      });
      return;
    }

    if (assignment.status === 'failed') {
      res.status(500).json({
        success: false,
        message: "Paper generation failed"
      });
      return;
    }

    // 4. Find Generated Paper
    const paper = await GeneratedPaper.findOne({ assignmentId: id });
    if (!paper) {
      res.status(404).json({
        success: false,
        message: "Paper not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: paper
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Simple bonus endpoint to support deleting assignments
export const deleteAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: "Invalid ID format" });
      return;
    }
    const assignment = await Assignment.findByIdAndDelete(id);
    if (!assignment) {
      res.status(404).json({ success: false, message: "Assignment not found" });
      return;
    }
    // Delete the related generated paper if any
    await GeneratedPaper.deleteOne({ assignmentId: id });
    res.status(200).json({ success: true, message: "Assignment deleted cleanly" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
