'use client';

import React from 'react';
import { usePaper } from '../../../hooks/usePaper';
import PaperShell from '../../../components/paper/PaperShell';
import PaperSkeleton from '../../../components/paper/PaperSkeleton';

interface PaperPageProps {
  params: { id: string };
}

export default function PaperPage({ params }: PaperPageProps) {
  const { id } = params;

  const {
    paper,
    assignment,
    isLoading,
    error,
    isSaving,
    isDownloading,
    hasUnsavedChanges,
    saveError,
    updateQuestion,
    addQuestion,
    deleteQuestion,
    downloadPDF,
    regenerate,
  } = usePaper(id);

  if (isLoading) {
    return <PaperSkeleton />;
  }

  if (error || !paper || !assignment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F0F14]">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-white font-bold text-lg">Paper not found</h2>
          <p className="text-white/40 text-sm mt-1">{error || 'This paper could not be loaded.'}</p>
          <a
            href="/assignments"
            className="inline-flex items-center gap-2 mt-5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to assignments
          </a>
        </div>
      </div>
    );
  }

  return (
    <PaperShell
      paper={paper}
      assignment={assignment}
      isSaving={isSaving}
      isDownloading={isDownloading}
      hasUnsavedChanges={hasUnsavedChanges}
      saveError={saveError}
      onUpdate={updateQuestion}
      onDelete={deleteQuestion}
      onAdd={addQuestion}
      onDownload={downloadPDF}
      onRegenerate={regenerate}
    />
  );
}
