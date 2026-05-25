import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Class, { generateJoinCode } from '../models/Class';

const isValidObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};

export const createClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, subject, grade } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 60) {
      res.status(400).json({ success: false, message: 'Class name is required and must be between 2 and 60 characters' });
      return;
    }
    if (!subject || typeof subject !== 'string' || subject.trim().length < 1 || subject.length > 50) {
      res.status(400).json({ success: false, message: 'Subject is required and must be under 50 characters' });
      return;
    }
    if (!grade || typeof grade !== 'string' || grade.trim().length < 1 || grade.length > 20) {
      res.status(400).json({ success: false, message: 'Grade is required and must be under 20 characters' });
      return;
    }

    let joinCode = generateJoinCode();
    let codeExists = await Class.findOne({ joinCode });
    while (codeExists) {
      joinCode = generateJoinCode();
      codeExists = await Class.findOne({ joinCode });
    }

    const classDoc = new Class({
      teacherId: req.userId,
      name: name.trim(),
      subject: subject.trim(),
      grade: grade.trim(),
      joinCode,
      studentIds: []
    });

    await classDoc.save();

    res.status(201).json({
      success: true,
      data: classDoc
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const getClasses = async (req: Request, res: Response): Promise<void> => {
  try {
    const classes = await Class.find({ teacherId: req.userId }).sort({ createdAt: -1 });
    const mapped = classes.map((c: any) => ({
      _id: c._id,
      teacherId: c.teacherId,
      name: c.name,
      subject: c.subject,
      grade: c.grade,
      joinCode: c.joinCode,
      studentCount: (c.studentIds || []).length,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: mapped
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const getClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: 'Invalid class ID format' });
      return;
    }

    const classDoc = await Class.findOne({ _id: id, teacherId: req.userId });
    if (!classDoc) {
      res.status(404).json({ success: false, message: 'Class not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        ...classDoc.toObject(),
        studentCount: (classDoc.studentIds || []).length
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const updateClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: 'Invalid class ID format' });
      return;
    }

    const { name, subject, grade } = req.body;
    const updateFields: any = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (subject !== undefined) updateFields.subject = subject.trim();
    if (grade !== undefined) updateFields.grade = grade.trim();

    const updated = await Class.findOneAndUpdate(
      { _id: id, teacherId: req.userId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updated) {
      res.status(404).json({ success: false, message: 'Class not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        ...updated.toObject(),
        studentCount: (updated.studentIds || []).length
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const deleteClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: 'Invalid class ID format' });
      return;
    }

    const deleted = await Class.findOneAndDelete({ _id: id, teacherId: req.userId });
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Class not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const regenerateJoinCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: 'Invalid class ID format' });
      return;
    }

    const classDoc = await Class.findOne({ _id: id, teacherId: req.userId });
    if (!classDoc) {
      res.status(404).json({ success: false, message: 'Class not found' });
      return;
    }

    let joinCode = generateJoinCode();
    let codeExists = await Class.findOne({ joinCode });
    while (codeExists) {
      joinCode = generateJoinCode();
      codeExists = await Class.findOne({ joinCode });
    }

    classDoc.joinCode = joinCode;
    await classDoc.save();

    res.status(200).json({
      success: true,
      data: {
        ...classDoc.toObject(),
        studentCount: (classDoc.studentIds || []).length
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
