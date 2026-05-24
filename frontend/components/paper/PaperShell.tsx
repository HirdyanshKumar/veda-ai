import React, { useState } from 'react';
import { IGeneratedPaper, IAssignment, IQuestion } from '../../types';
import AIMessageBar from './AIMessageBar';
import PaperDocument from './PaperDocument';
import PublishModal from './PublishModal';

interface PaperShellProps {
  paper: IGeneratedPaper;
  assignment: IAssignment;
  isSaving: boolean;
  isDownloading: boolean;
  hasUnsavedChanges: boolean;
  saveError: string | null;
  onUpdate: (sectionIndex: number, questionIndex: number, updates: Partial<IQuestion>) => void;
  onDelete: (sectionIndex: number, questionIndex: number) => void;
  onAdd: (sectionIndex: number, question: IQuestion) => void;
  onDownload: () => void;
  onRegenerate: () => void;
}

const PaperShell: React.FC<PaperShellProps> = ({
  paper,
  assignment,
  isSaving,
  isDownloading,
  hasUnsavedChanges,
  saveError,
  onUpdate,
  onDelete,
  onAdd,
  onDownload,
  onRegenerate,
}) => {
  const [isPublishOpen, setIsPublishOpen] = useState(false);

  const handlePublishConfirm = (className: string, deadline: string) => {
    console.log('Publishing to:', className, 'Deadline:', deadline);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0F0F14]">
      <AIMessageBar
        title={assignment.title}
        subject={assignment.subject}
        isSaving={isSaving}
        isDownloading={isDownloading}
        hasUnsavedChanges={hasUnsavedChanges}
        saveError={saveError}
        onDownload={onDownload}
        onRegenerate={onRegenerate}
        onPublish={() => setIsPublishOpen(true)}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <PaperDocument
            paper={paper}
            assignment={assignment}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onAdd={onAdd}
          />
        </div>
      </div>

      <PublishModal
        isOpen={isPublishOpen}
        paperTitle={assignment.title}
        onClose={() => setIsPublishOpen(false)}
        onConfirm={handlePublishConfirm}
      />
    </div>
  );
};

export default PaperShell;
