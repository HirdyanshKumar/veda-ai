import { useState, useEffect, useCallback } from 'react';
import { useAssignmentStore } from '../store/assignmentStore';
import { api } from '../lib/api';
import { IAssignment } from '../types';
import { useAuth } from '@clerk/nextjs';

export const useAssignments = () => {
  const [assignments, setLocalAssignments] = useState<IAssignment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const { setAssignments } = useAssignmentStore();

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const data = await api.getAssignments(token || undefined);
      setLocalAssignments(data);
      setAssignments(data);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch assignments");
    } finally {
      setIsLoading(false);
    }
  }, [setAssignments, getToken]);

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
