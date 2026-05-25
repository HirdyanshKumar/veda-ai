import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { api } from '../lib/api';
import { IClass, ICreateClassInput } from '../types';

export const useClasses = () => {
  const { getToken } = useAuth();
  const [classes, setClasses] = useState<IClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const data = await api.getClasses(token || undefined);
      setClasses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load classes');
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const createClass = async (payload: ICreateClassInput): Promise<boolean> => {
    setIsCreating(true);
    setCreateError(null);
    try {
      const token = await getToken();
      const newClass = await api.createClass(payload, token || undefined);
      setClasses((prev) => [newClass, ...prev]);
      setIsCreating(false);
      return true;
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create class');
      setIsCreating(false);
      return false;
    }
  };

  const deleteClass = async (id: string): Promise<boolean> => {
    setDeletingId(id);
    try {
      const token = await getToken();
      await api.deleteClass(id, token || undefined);
      setClasses((prev) => prev.filter((c) => c._id !== id));
      setDeletingId(null);
      return true;
    } catch (err: any) {
      setDeletingId(null);
      return false;
    }
  };

  const updateClass = async (id: string, payload: Partial<ICreateClassInput>): Promise<boolean> => {
    setUpdatingId(id);
    try {
      const token = await getToken();
      const updated = await api.updateClass(id, payload, token || undefined);
      setClasses((prev) => prev.map((c) => (c._id === id ? updated : c)));
      setUpdatingId(null);
      return true;
    } catch (err: any) {
      setUpdatingId(null);
      return false;
    }
  };

  const copyJoinCode = (id: string, code: string): void => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const regenerateCode = async (id: string): Promise<void> => {
    try {
      const token = await getToken();
      const updated = await api.regenerateJoinCode(id, token || undefined);
      setClasses((prev) => prev.map((c) => (c._id === id ? updated : c)));
    } catch (err) {
      // Ignored
    }
  };

  return {
    classes,
    isLoading,
    error,
    isCreating,
    createError,
    deletingId,
    updatingId,
    copiedId,
    fetchClasses,
    createClass,
    deleteClass,
    updateClass,
    copyJoinCode,
    regenerateCode
  };
};
export default useClasses;
