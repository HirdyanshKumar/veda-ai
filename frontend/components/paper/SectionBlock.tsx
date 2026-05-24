import React from 'react';
import { ISection, IQuestion } from '../../types';
import QuestionRow from './QuestionRow';
import AddQuestionRow from './AddQuestionRow';

interface SectionBlockProps {
  section: ISection;
  sectionIndex: number;
  onUpdate: (sectionIndex: number, questionIndex: number, updates: Partial<IQuestion>) => void;
  onDelete: (sectionIndex: number, questionIndex: number) => void;
  onAdd: (sectionIndex: number, question: IQuestion) => void;
}

const SectionBlock: React.FC<SectionBlockProps> = ({
  section,
  sectionIndex,
  onUpdate,
  onDelete,
  onAdd,
}) => {
  const totalMarks = section.questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">{section.title}</h2>
          {section.instruction && (
            <p className="text-xs text-gray-500 mt-0.5 italic">{section.instruction}</p>
          )}
        </div>
        <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2.5 py-1 rounded-full">
          {totalMarks} marks
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        {section.questions.map((question, qIdx) => (
          <QuestionRow
            key={qIdx}
            question={question}
            index={qIdx}
            sectionIndex={sectionIndex}
            onUpdate={onUpdate}
            onDelete={onDelete}
            isOnly={section.questions.length === 1}
          />
        ))}
      </div>

      <AddQuestionRow sectionIndex={sectionIndex} onAdd={onAdd} />
    </div>
  );
};

export default SectionBlock;
