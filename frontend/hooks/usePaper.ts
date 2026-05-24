import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { api } from '../lib/api';
import { IGeneratedPaper, IAssignment, IQuestion } from '../types';

export const usePaper = (id: string) => {
  const router = useRouter();
  const { getToken } = useAuth();
  
  const [paper, setPaper] = useState<IGeneratedPaper | null>(null);
  const [assignment, setAssignment] = useState<IAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const [meta, paperData] = await Promise.all([
          api.getAssignment(id, token || undefined),
          api.getPaper(id, token || undefined)
        ]);
        if (active) {
          setAssignment(meta);
          setPaper(paperData);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || "Failed to load paper details");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [id, getToken]);

  const updateQuestion = async (sectionIndex: number, questionIndex: number, updates: Partial<IQuestion>) => {
    if (!paper) return;
    setIsSaving(true);
    setSaveError(null);
    setHasUnsavedChanges(true);

    const prevPaper = { ...paper };
    const updatedSections = [...paper.sections];
    const updatedQuestions = [...updatedSections[sectionIndex].questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      ...updates
    };
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      questions: updatedQuestions
    };
    const nextPaper = { ...paper, sections: updatedSections };
    setPaper(nextPaper);

    try {
      const token = await getToken();
      const updated = await api.updateQuestion(paper._id, sectionIndex, questionIndex, updates, token || undefined);
      setPaper(updated);
      setHasUnsavedChanges(false);
    } catch (err: any) {
      setPaper(prevPaper);
      setSaveError(err.message || "Failed to update question");
    } finally {
      setIsSaving(false);
    }
  };

  const addQuestion = async (sectionIndex: number, newQuestion: IQuestion) => {
    if (!paper) return;
    setIsSaving(true);
    setSaveError(null);
    setHasUnsavedChanges(true);

    const prevPaper = { ...paper };
    const updatedSections = [...paper.sections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      questions: [...updatedSections[sectionIndex].questions, newQuestion]
    };
    const nextPaper = { ...paper, sections: updatedSections };
    setPaper(nextPaper);

    try {
      const token = await getToken();
      const updated = await api.addQuestion(paper._id, sectionIndex, newQuestion, token || undefined);
      setPaper(updated);
      setHasUnsavedChanges(false);
    } catch (err: any) {
      setPaper(prevPaper);
      setSaveError(err.message || "Failed to add question");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteQuestion = async (sectionIndex: number, questionIndex: number) => {
    if (!paper) return;
    
    if (paper.sections[sectionIndex].questions.length <= 1) {
      setSaveError("Cannot delete the last question in a section");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setHasUnsavedChanges(true);

    const prevPaper = { ...paper };
    const updatedSections = [...paper.sections];
    const updatedQuestions = [...updatedSections[sectionIndex].questions];
    updatedQuestions.splice(questionIndex, 1);
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      questions: updatedQuestions
    };
    const nextPaper = { ...paper, sections: updatedSections };
    setPaper(nextPaper);

    try {
      const token = await getToken();
      const updated = await api.deleteQuestion(paper._id, sectionIndex, questionIndex, token || undefined);
      setPaper(updated);
      setHasUnsavedChanges(false);
    } catch (err: any) {
      setPaper(prevPaper);
      setSaveError(err.message || "Failed to delete question");
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPDF = async () => {
    setIsDownloading(true);
    setSaveError(null);
    try {
      const token = await getToken();
      const blob = await api.downloadPDF(id, token || undefined);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `paper-${assignment?.title || id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setSaveError("PDF generation failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const regenerate = async () => {
    try {
      const token = await getToken();
      await api.regeneratePaper(id, token || undefined);
      router.push(`/loading/${id}`);
    } catch (err: any) {
      setSaveError(err.message || "Failed to regenerate assignment");
    }
  };

  return {
    paper,
    assignment,
    isLoading,
    isSaving,
    isDownloading,
    error,
    saveError,
    hasUnsavedChanges,
    updateQuestion,
    addQuestion,
    deleteQuestion,
    downloadPDF,
    regenerate
  };
};
