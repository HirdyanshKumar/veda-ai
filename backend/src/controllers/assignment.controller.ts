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

    const assignment = new Assignment({
      userId: req.userId,
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

    await addGenerationJob(assignment._id.toString());

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
    const assignments = await Assignment.find({ userId: req.userId }).sort({ createdAt: -1 });
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

    if (!isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid assignment ID format"
      });
      return;
    }

    const assignment = await Assignment.findOne({ _id: id, userId: req.userId });
    if (!assignment) {
      res.status(404).json({
        success: false,
        message: "Assignment not found or unauthorized"
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

    if (!isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid assignment ID format"
      });
      return;
    }

    const assignment = await Assignment.findOne({ _id: id, userId: req.userId });
    if (!assignment) {
      res.status(404).json({
        success: false,
        message: "Assignment not found or unauthorized"
      });
      return;
    }

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

export const deleteAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: "Invalid ID format" });
      return;
    }
    const assignment = await Assignment.findOneAndDelete({ _id: id, userId: req.userId });
    if (!assignment) {
      res.status(404).json({ success: false, message: "Assignment not found or unauthorized" });
      return;
    }
    await GeneratedPaper.deleteOne({ assignmentId: id });
    res.status(200).json({ success: true, message: "Assignment deleted cleanly" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const regenerateAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: "Invalid ID format" });
      return;
    }

    const assignment = await Assignment.findOne({ _id: id, userId: req.userId });
    if (!assignment) {
      res.status(404).json({ success: false, message: "Assignment not found or unauthorized" });
      return;
    }

    assignment.status = 'pending';
    await assignment.save();

    await GeneratedPaper.deleteOne({ assignmentId: id });

    await addGenerationJob(id);

    res.status(200).json({
      success: true,
      message: "Regeneration queued successfully",
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

