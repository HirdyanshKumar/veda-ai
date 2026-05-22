import { useState, useEffect, useCallback } from 'react';
import { useAssignmentStore } from '../store/assignmentStore';
import { api } from '../lib/api';
import { IAssignment } from '../types';

export const useAssignments = () => {
  const [assignments, setLocalAssignments] = useState<IAssignment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { setAssignments } = useAssignmentStore();

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getAssignments();
      setLocalAssignments(data);
      // Synchronize in Zustand store
      setAssignments(data);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch assignments");
    } finally {
      setIsLoading(false);
    }
  }, [setAssignments]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return {
    assignments,
    isLoading,
    error,
    refetch: fetchList
  };
};
export default useAssignments;
