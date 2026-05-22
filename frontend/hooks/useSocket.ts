import { useEffect } from 'react';
import { getSocket } from '../lib/socket';
import { IGeneratedPaper } from '../types';

interface UseSocketProps {
  assignmentId: string | undefined;
  onReady: (paper: IGeneratedPaper) => void;
  onFailed: (error: string) => void;
}

export const useSocket = ({ assignmentId, onReady, onFailed }: UseSocketProps) => {
  useEffect(() => {
    if (!assignmentId) return;

    const socket = getSocket();

    // Auto-connect if socket client disconnected
    if (!socket.connected) {
      socket.connect();
    }

    // Join a specific room for this assignment to receive isolated updates
    socket.emit('join', { assignmentId });

    const handlePaperReady = (event: { assignmentId: string; paper: IGeneratedPaper }) => {
      if (event.assignmentId === assignmentId) {
        onReady(event.paper);
      }
    };

    const handlePaperFailed = (event: { assignmentId: string; error: string }) => {
      if (event.assignmentId === assignmentId) {
        onFailed(event.error);
      }
    };

    socket.on('paper:ready', handlePaperReady);
    socket.on('paper:failed', handlePaperFailed);

    return () => {
      socket.off('paper:ready', handlePaperReady);
      socket.off('paper:failed', handlePaperFailed);
      socket.emit('leave', { assignmentId });
    };
  }, [assignmentId, onReady, onFailed]);
};
export default useSocket;
