import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { api } from '../lib/api';
import { IAssignment } from '../types';

export const useLibrary = () => {
  const { getToken } = useAuth();
  const [allPapers, setAllPapers] = useState<IAssignment[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<IAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title_asc' | 'title_desc'>('newest');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchLibraryData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const data = await api.getLibrary({ status: 'completed' }, token || undefined);
      setAllPapers(data);
      
      const uniqueSubjects = Array.from(new Set(data.map(p => p.subject).filter(Boolean)));
      setSubjects(uniqueSubjects.sort());
    } catch (err: any) {
      setError(err.message || 'Failed to load library papers');
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchLibraryData();
  }, [fetchLibraryData]);

  useEffect(() => {
    let result = [...allPapers];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        paper =>
          (paper.title && paper.title.toLowerCase().includes(q)) ||
          (paper.subject && paper.subject.toLowerCase().includes(q))
      );
    }

    if (selectedSubject) {
      const subjectLower = selectedSubject.toLowerCase();
      result = result.filter(
        paper => paper.subject && paper.subject.toLowerCase() === subjectLower
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'title_asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'title_desc') {
        return (b.title || '').localeCompare(a.title || '');
      }
      return 0;
    });

    setFilteredPapers(result);
  }, [searchQuery, selectedSubject, sortBy, allPapers]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedSubject('');
    setSortBy('newest');
  }, []);

  const hasActiveFilters = searchQuery !== '' || selectedSubject !== '';

  return {
    allPapers,
    filteredPapers,
    isLoading,
    error,
    searchQuery,
    selectedSubject,
    sortBy,
    subjects,
    viewMode,
    setSearchQuery,
    setSelectedSubject,
    setSortBy,
    setViewMode,
    clearFilters,
    hasActiveFilters,
    refetch: fetchLibraryData
  };
};
