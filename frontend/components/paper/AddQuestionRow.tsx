import React, { useState } from 'react';
import { IQuestion } from '../../types';

interface AddQuestionRowProps {
  sectionIndex: number;
  onAdd: (sectionIndex: number, question: IQuestion) => void;
}

const AddQuestionRow: React.FC<AddQuestionRowProps> = ({ sectionIndex, onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [marks, setMarks] = useState('2');
  const [difficulty, setDifficulty] = useState<IQuestion['difficulty']>('medium');

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(sectionIndex, {
      text: text.trim(),
      marks: Number(marks),
      difficulty,
      type: 'custom',
    });
    setText('');
    setMarks('2');
    setDifficulty('medium');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-2 px-3 py-2.5 mt-2 rounded-xl border border-dashed border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/40 transition-all text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add question
      </button>
    );
  }

  return (
    <div className="mt-3 border border-indigo-200 rounded-xl bg-indigo-50/30 p-4 space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your question here..."
        rows={3}
        autoFocus
        className="w-full text-sm text-gray-800 border border-indigo-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none placeholder-gray-300"
      />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 font-medium">Marks</label>
          <input
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            min={1}
            className="w-16 text-sm border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 font-medium">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as IQuestion['difficulty'])}
            className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!text.trim()}
            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionRow;
