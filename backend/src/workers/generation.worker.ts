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
      // Step 2: Fetch Assignment
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        throw new Error("Assignment not found");
      }

      // Step 3: Update status to processing
      assignment.status = 'processing';
      await assignment.save();
      console.log(`[Worker] Status updated to 'processing' for: ${assignmentId}`);

      // Step 4: Build IAssignmentInput
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

      // Step 5: Call generatePaper
      console.log(`[Worker] Triggering Gemini AI generator for: ${assignmentId}`);
      const result = await generatePaper(assignmentInput, assignmentId);

      // Step 6: Save GeneratedPaper
      // Make sure we delete any previously failed papers first (to support retry attempts)
      await GeneratedPaper.deleteOne({ assignmentId });
      
      const paper = new GeneratedPaper({
        assignmentId,
        sections: result.sections
      });
      await paper.save();
      console.log(`[Worker] Generated paper saved in MongoDB for: ${assignmentId}`);

      // Step 7: Update assignment status to completed
      assignment.status = 'completed';
      await assignment.save();
      console.log(`[Worker] Status updated to 'completed' for: ${assignmentId}`);

      // Step 8: Emit paper:ready via socket
      try {
        const io = getIO();
        const payload = {
          assignmentId,
          paper: {
            assignmentId,
            sections: result.sections
          }
        };
        // Emit to room for isolated updates, and broadcast globally to be extra safe
        io.to(assignmentId).emit('paper:ready', payload);
        io.emit('paper:ready', payload);
        console.log(`[Worker] Emitted 'paper:ready' event for: ${assignmentId}`);
      } catch (sockErr) {
        console.error(`[Worker] Socket emission failed:`, sockErr);
      }

      return result;

    } catch (error: any) {
      console.error(`[Worker] Error generating paper for ${assignmentId}:`, error);

      // On error, update status to failed
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

      // Emit paper:failed via socket
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

      // Re-throw the error so BullMQ handles attempts/exponential backoff
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5
  }
);

export default generationWorker;
