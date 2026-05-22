import { Queue } from 'bullmq';
import redisConnection from '../config/redis';
import { IJobPayload } from '../types';

export const generationQueue = new Queue<IJobPayload>('generation', {
  connection: redisConnection
});

export const addGenerationJob = async (assignmentId: string): Promise<void> => {
  await generationQueue.add(
    'generate-paper',
    { assignmentId },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      }
    }
  );
};
export default generationQueue;
