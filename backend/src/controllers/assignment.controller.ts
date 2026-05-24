import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Assignment } from '../models/Assignment';
import { GeneratedPaper } from '../models/GeneratedPaper';
import { assignmentInputSchema } from '../validators/assignment.validator';
import { addGenerationJob } from '../queues/generation.queue';
import puppeteer from 'puppeteer';

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

export const updateQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paperId } = req.params;
    const { sectionIndex, questionIndex, updates } = req.body;

    if (typeof sectionIndex !== 'number' || typeof questionIndex !== 'number') {
      res.status(400).json({ success: false, message: "Invalid section or question index" });
      return;
    }

    if (!isValidObjectId(paperId)) {
      res.status(400).json({ success: false, message: "Invalid paper ID format" });
      return;
    }

    const paper = await GeneratedPaper.findById(paperId);
    if (!paper) {
      res.status(404).json({ success: false, message: "Paper not found" });
      return;
    }

    if (!paper.sections[sectionIndex] || !paper.sections[sectionIndex].questions[questionIndex]) {
      res.status(404).json({ success: false, message: "Question not found" });
      return;
    }

    const question = paper.sections[sectionIndex].questions[questionIndex];

    if (updates.difficulty && !['easy', 'medium', 'hard'].includes(updates.difficulty)) {
      res.status(400).json({ success: false, message: "Difficulty must be easy, medium, or hard" });
      return;
    }

    if (updates.marks !== undefined && (typeof updates.marks !== 'number' || updates.marks < 1)) {
      res.status(400).json({ success: false, message: "Marks must be at least 1" });
      return;
    }

    if (updates.text !== undefined) question.text = updates.text;
    if (updates.difficulty !== undefined) question.difficulty = updates.difficulty;
    if (updates.marks !== undefined) question.marks = updates.marks;
    if (updates.type !== undefined) question.type = updates.type;

    paper.markModified('sections');
    await paper.save();

    res.status(200).json({ success: true, data: paper });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const addQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paperId } = req.params;
    const { sectionIndex, question } = req.body;

    if (typeof sectionIndex !== 'number') {
      res.status(400).json({ success: false, message: "Invalid section index" });
      return;
    }

    if (!isValidObjectId(paperId)) {
      res.status(400).json({ success: false, message: "Invalid paper ID format" });
      return;
    }

    if (!question || !question.text || !question.difficulty || !question.marks || !question.type) {
      res.status(400).json({ success: false, message: "Missing required question fields" });
      return;
    }

    if (!['easy', 'medium', 'hard'].includes(question.difficulty)) {
      res.status(400).json({ success: false, message: "Difficulty must be easy, medium, or hard" });
      return;
    }

    if (typeof question.marks !== 'number' || question.marks < 1) {
      res.status(400).json({ success: false, message: "Marks must be at least 1" });
      return;
    }

    const paper = await GeneratedPaper.findById(paperId);
    if (!paper) {
      res.status(404).json({ success: false, message: "Paper not found" });
      return;
    }

    if (!paper.sections[sectionIndex]) {
      res.status(404).json({ success: false, message: "Section not found" });
      return;
    }

    paper.sections[sectionIndex].questions.push(question);
    paper.markModified('sections');
    await paper.save();

    res.status(200).json({ success: true, data: paper });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paperId } = req.params;
    const { sectionIndex, questionIndex } = req.body;

    if (typeof sectionIndex !== 'number' || typeof questionIndex !== 'number') {
      res.status(400).json({ success: false, message: "Invalid indexes provided" });
      return;
    }

    if (!isValidObjectId(paperId)) {
      res.status(400).json({ success: false, message: "Invalid paper ID format" });
      return;
    }

    const paper = await GeneratedPaper.findById(paperId);
    if (!paper) {
      res.status(404).json({ success: false, message: "Paper not found" });
      return;
    }

    if (!paper.sections[sectionIndex] || !paper.sections[sectionIndex].questions[questionIndex]) {
      res.status(404).json({ success: false, message: "Question not found" });
      return;
    }

    if (paper.sections[sectionIndex].questions.length <= 1) {
      res.status(400).json({ success: false, message: "Cannot delete the last question in a section" });
      return;
    }

    paper.sections[sectionIndex].questions.splice(questionIndex, 1);
    paper.markModified('sections');
    await paper.save();

    res.status(200).json({ success: true, data: paper });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const downloadPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: "Invalid assignment ID format" });
      return;
    }

    const assignment = await Assignment.findOne({ _id: id, userId: req.userId });
    if (!assignment) {
      res.status(404).json({ success: false, message: "Assignment not found or unauthorized" });
      return;
    }

    const paper = await GeneratedPaper.findOne({ assignmentId: id });
    if (!paper) {
      res.status(404).json({ success: false, message: "Generated paper not found" });
      return;
    }

    let questionCount = 0;
    const sectionsHTML = paper.sections.map(section => {
      const questionsHTML = section.questions.map(q => {
        questionCount++;
        return `
          <div class="question">
            <span class="marks">[${q.marks} Mark${q.marks > 1 ? 's' : ''}]</span>
            <span class="badge ${q.difficulty}">${q.difficulty === 'medium' ? 'Moderate' : q.difficulty === 'hard' ? 'Challenging' : 'Easy'}</span>
            <strong>Q${questionCount}.</strong> ${q.text}
          </div>
        `;
      }).join('');

      return `
        <div class="section">
          <div class="section-title">${section.title}</div>
          <div class="instruction">${section.instruction}</div>
          ${questionsHTML}
        </div>
      `;
    }).join('');

    const htmlString = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Times New Roman', serif; margin: 40px; color: #000; font-size: 14px; line-height: 1.5; }
            .header { text-align: center; margin-bottom: 20px; }
            .school-name { font-size: 22px; font-weight: bold; margin-bottom: 5px; }
            .exam-details { font-size: 16px; font-weight: bold; margin-bottom: 5px; }
            .divider { border-top: 1.5px solid #000; margin: 10px 0; }
            .meta-info { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 10px; }
            .instructions { font-style: italic; margin-bottom: 15px; }
            .student-blanks { display: flex; flex-direction: column; gap: 5px; margin-bottom: 20px; font-weight: bold; }
            .section-title { font-size: 16px; font-weight: bold; text-align: center; margin-top: 25px; margin-bottom: 5px; text-decoration: underline; }
            .instruction { font-style: italic; margin-bottom: 10px; }
            .question { margin-bottom: 12px; }
            .marks { float: right; font-weight: bold; }
            .badge { display: inline-block; padding: 1px 4px; border-radius: 3px; font-size: 10px; font-weight: bold; text-transform: uppercase; margin-right: 5px; }
            .easy { background-color: #e8f5e9; color: #2e7d32; border: 0.5px solid #2e7d32; }
            .medium { background-color: #fffde7; color: #f57f17; border: 0.5px solid #f57f17; }
            .hard { background-color: #ffebee; color: #c62828; border: 0.5px solid #c62828; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="school-name">Delhi Public School, Sector-4, Bokaro</div>
            <div class="exam-details">Subject: ${assignment.subject}</div>
            <div class="exam-details">Assignment: ${assignment.title}</div>
          </div>
          <div class="divider"></div>
          <div class="meta-info">
            <div>Time Allowed: 45 minutes</div>
            <div>Maximum Marks: ${assignment.totalMarks}</div>
          </div>
          <div class="divider"></div>
          <div class="instructions">
            All questions are compulsory unless stated otherwise.
          </div>
          <div class="student-blanks">
            <div>Name: _____________________________________</div>
            <div>Roll Number: ______________________________</div>
            <div>Class: ____________ Section: ________________</div>
          </div>
          <div class="divider"></div>
          ${sectionsHTML}
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlString, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '40px', bottom: '40px', left: '40px', right: '40px' },
      printBackground: true
    });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="paper-${id}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to generate PDF", error: error.message });
  }
};

