import { Worker, Job } from 'bullmq';
import { Assignment } from '../models/Assignment';
import { GeneratedPaper } from '../models/GeneratedPaper';
import { generatePaper } from '../services/ai.service';
import { getIO } from '../socket/socket';
import redisConnection from '../config/redis';
import { IJobPayload, IAssignmentInput } from '../types';

export const generationWorker = new Worker<IJobPayload>(
  'generation',
  async (job: Job<IJobPayload>) => {
    const { assignmentId } = job.data;
    console.log(`[Worker] Started processing assignment: ${assignmentId}`);

    try {
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        throw new Error("Assignment not found");
      }

      assignment.status = 'processing';
      await assignment.save();
      console.log(`[Worker] Status updated to 'processing' for: ${assignmentId}`);

      const assignmentInput: IAssignmentInput = {
        title: assignment.title,
        subject: assignment.subject,
        dueDate: assignment.dueDate.toISOString(),
        questionTypes: assignment.questionTypes,
        numberOfQuestions: assignment.numberOfQuestions,
        totalMarks: assignment.totalMarks,
        difficulty: assignment.difficulty,
        additionalInstructions: assignment.additionalInstructions,
        fileUrl: assignment.fileUrl
      };

      console.log(`[Worker] Triggering Gemini AI generator for: ${assignmentId}`);
      const result = await generatePaper(assignmentInput, assignmentId);

      await GeneratedPaper.deleteOne({ assignmentId });
      
      const paper = new GeneratedPaper({
        assignmentId,
        sections: result.sections
      });
      await paper.save();
      console.log(`[Worker] Generated paper saved in MongoDB for: ${assignmentId}`);

      assignment.status = 'completed';
      await assignment.save();
      console.log(`[Worker] Status updated to 'completed' for: ${assignmentId}`);

      try {
        const io = getIO();
        const payload = {
          assignmentId,
          paper: {
            assignmentId,
            sections: result.sections
          }
        };
        io.to(assignmentId).emit('paper:ready', payload);
        io.emit('paper:ready', payload);
        console.log(`[Worker] Emitted 'paper:ready' event for: ${assignmentId}`);
      } catch (sockErr) {
        console.error(`[Worker] Socket emission failed:`, sockErr);
      }

      return result;

    } catch (error: any) {
      console.error(`[Worker] Error generating paper for ${assignmentId}:`, error);

      try {
        const assignment = await Assignment.findById(assignmentId);
        if (assignment) {
          assignment.status = 'failed';
          await assignment.save();
          console.log(`[Worker] Status marked 'failed' for: ${assignmentId}`);
        }
      } catch (dbErr) {
        console.error(`[Worker] DB fallback status update failed:`, dbErr);
      }

      try {
        const io = getIO();
        const payload = {
          assignmentId,
          error: error.message || "Paper generation failed"
        };
        io.to(assignmentId).emit('paper:failed', payload);
        io.emit('paper:failed', payload);
        console.log(`[Worker] Emitted 'paper:failed' event for: ${assignmentId}`);
      } catch (sockErr) {
        console.error(`[Worker] Socket emission error failed:`, sockErr);
      }

      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5
  }
);

export default generationWorker;
