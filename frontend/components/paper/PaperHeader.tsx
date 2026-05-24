import React from 'react';
import { IAssignment } from '../../types';

interface PaperHeaderProps {
  assignment: IAssignment;
}

const PaperHeader: React.FC<PaperHeaderProps> = ({ assignment }) => {
  const formattedDate = assignment.dueDate
    ? new Date(assignment.dueDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="text-center border-b border-gray-200 pb-6 mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400 mb-1">
        Veda AI · Question Paper
      </p>
      <h1 className="text-2xl font-bold text-gray-900 mt-1">{assignment.title}</h1>
      <p className="text-sm text-gray-500 mt-1">{assignment.subject}</p>

      <div className="mt-5 grid grid-cols-3 gap-4 text-left border border-gray-100 rounded-xl bg-gray-50 px-5 py-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Total Marks</p>
          <p className="text-base font-bold text-gray-800 mt-0.5">{assignment.totalMarks}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Questions</p>
          <p className="text-base font-bold text-gray-800 mt-0.5">{assignment.numberOfQuestions}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Due Date</p>
          <p className="text-base font-bold text-gray-800 mt-0.5">{formattedDate || '—'}</p>
        </div>
      </div>

      {assignment.additionalInstructions && (
        <div className="mt-4 text-left">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">General Instructions</p>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {assignment.additionalInstructions}
          </p>
        </div>
      )}
    </div>
  );
};

export default PaperHeader;
