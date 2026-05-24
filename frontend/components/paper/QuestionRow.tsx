import React, { useState } from 'react';
import { IQuestion } from '../../types';

interface QuestionRowProps {
  question: IQuestion;
  index: number;
  sectionIndex: number;
  onUpdate: (sectionIndex: number, questionIndex: number, updates: Partial<IQuestion>) => void;
  onDelete: (sectionIndex: number, questionIndex: number) => void;
  isOnly: boolean;
}

const QuestionRow: React.FC<QuestionRowProps> = ({
  question,
  index,
  sectionIndex,
  onUpdate,
  onDelete,
  isOnly,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(question.text);
  const [editMarks, setEditMarks] = useState(String(question.marks));
  const [editDifficulty, setEditDifficulty] = useState(question.difficulty);

  const difficultyColors: Record<string, string> = {
    easy: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    hard: 'bg-red-100 text-red-700',
  };

  const handleSave = () => {
    onUpdate(sectionIndex, index, {
      text: editText,
      marks: Number(editMarks),
      difficulty: editDifficulty as IQuestion['difficulty'],
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(question.text);
    setEditMarks(String(question.marks));
    setEditDifficulty(question.difficulty);
    setIsEditing(false);
  };

  return (
    <div className="group relative flex gap-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors px-2 rounded-lg">
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center mt-0.5">
        {index + 1}
      </span>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              className="w-full text-sm text-gray-800 border border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              autoFocus
            />
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 font-medium">Marks</label>
                <input
                  type="number"
                  value={editMarks}
                  onChange={(e) => setEditMarks(e.target.value)}
                  min={1}
                  className="w-16 text-sm border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 font-medium">Difficulty</label>
                <select
                  value={editDifficulty}
                  onChange={(e) => setEditDifficulty(e.target.value as IQuestion['difficulty'])}
                  className="text-sm border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={handleCancel}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-800 leading-relaxed">{question.text}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${difficultyColors[question.difficulty] || difficultyColors.medium}`}>
                {question.difficulty}
              </span>
              <span className="text-xs text-gray-400">{question.marks} mark{question.marks !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="flex-shrink-0 flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            title="Edit"
            className="p-1.5 rounded-md hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" />
            </svg>
          </button>
          {!isOnly && (
            <button
              onClick={() => onDelete(sectionIndex, index)}
              title="Delete"
              className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionRow;
