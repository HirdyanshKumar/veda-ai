import React, { useState } from 'react';
import { ChevronDown, X, Minus, Plus } from 'lucide-react';
import { IQuestionTypeRow } from '../../types';
import { AVAILABLE_QUESTION_TYPES } from '../../constants/questionTypes';

interface QuestionTypeRowProps {
  row: IQuestionTypeRow;
  onUpdate: (id: string, field: keyof IQuestionTypeRow, value: any) => void;
  onRemove: (id: string) => void;
  validationError?: string;
}

export const QuestionTypeRow: React.FC<QuestionTypeRowProps> = ({ 
  row, 
  onUpdate, 
  onRemove,
  validationError
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div className="w-full flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-white md:bg-transparent rounded-2xl md:rounded-none p-4 md:p-0 border border-neutral-100 md:border-none shadow-sm md:shadow-none">
      
      {/* Dropdown Selector Pill */}
      <div className="relative flex-1 md:flex-none md:w-[471px]">
        <button 
          type="button"
          onClick={() => setOpenDropdown(!openDropdown)}
          className="w-full h-11 px-4 bg-white border border-[#E5E7EB] rounded-full flex justify-between items-center text-sm md:text-base font-medium text-[#303030] shadow-sm active:scale-[0.99] transition-all"
        >
          <span className="truncate">{row.type}</span>
          <div className="flex items-center gap-2 text-neutral-400">
            <ChevronDown size={16} />
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(row.id);
              }}
              className="hover:text-red-500 transition-colors p-1"
              aria-label="Remove Row"
            >
              <X size={16} />
            </button>
          </div>
        </button>

        {/* Dropdown Options */}
        {openDropdown && (
          <>
            {/* Click-away backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(false)} />
            
            <div className="absolute left-0 top-full mt-1 bg-white rounded-xl p-2 shadow-[0px_8px_24px_rgba(0,0,0,0.12)] min-w-[240px] z-50 border border-neutral-100/80 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
              {AVAILABLE_QUESTION_TYPES.map((opt) => (
                <button 
                  key={opt}
                  type="button"
                  onClick={() => {
                    onUpdate(row.id, 'type', opt);
                    setOpenDropdown(false);
                  }}
                  className="w-full text-left font-medium text-sm text-[#303030] px-4 py-2.5 hover:bg-[#F9FAFB] rounded-lg transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}

        {validationError && (
          <span className="absolute left-3 top-full text-[#EF4444] text-[11px] font-medium mt-0.5">
            {validationError}
          </span>
        )}
      </div>

      {/* Inputs Subgroup (Mobile layout vs Desktop row) */}
      <div className="flex items-center justify-between gap-4 md:gap-3.5 bg-neutral-50 md:bg-transparent rounded-xl md:rounded-none p-2.5 md:p-0">
        
        {/* Stepper — No. of Questions */}
        <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-0">
          <span className="inline md:hidden text-xs font-semibold text-neutral-500">No. of Questions</span>
          <div className="w-[100px] h-[38px] md:h-11 px-3 bg-white border border-[#E5E7EB] rounded-full flex justify-between items-center select-none shadow-sm">
            <button 
              type="button"
              onClick={() => onUpdate(row.id, 'questions', Math.max(1, row.questions - 1))}
              className="text-[#DADADA] hover:text-[#9CA3AF] font-bold text-lg cursor-pointer p-0.5 active:scale-90 transition-transform"
            >
              <Minus size={14} className="stroke-[2.5]" />
            </button>
            <span className="font-semibold text-sm text-[#303030]">{row.questions}</span>
            <button 
              type="button"
              onClick={() => onUpdate(row.id, 'questions', row.questions + 1)}
              className="text-[#DADADA] hover:text-[#9CA3AF] font-bold text-lg cursor-pointer p-0.5 active:scale-90 transition-transform"
            >
              <Plus size={14} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Vertical divider on mobile */}
        <div className="w-[1px] h-8 bg-neutral-200 md:hidden" />

        {/* Stepper — Marks per Question */}
        <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-0">
          <span className="inline md:hidden text-xs font-semibold text-neutral-500">Marks</span>
          <div className="w-[100px] h-[38px] md:h-11 px-3 bg-white border border-[#E5E7EB] rounded-full flex justify-between items-center select-none shadow-sm">
            <button 
              type="button"
              onClick={() => onUpdate(row.id, 'marks', Math.max(1, row.marks - 1))}
              className="text-[#DADADA] hover:text-[#9CA3AF] font-bold text-lg cursor-pointer p-0.5 active:scale-90 transition-transform"
            >
              <Minus size={14} className="stroke-[2.5]" />
            </button>
            <span className="font-semibold text-sm text-[#303030]">{row.marks}</span>
            <button 
              type="button"
              onClick={() => onUpdate(row.id, 'marks', row.marks + 1)}
              className="text-[#DADADA] hover:text-[#9CA3AF] font-bold text-lg cursor-pointer p-0.5 active:scale-90 transition-transform"
            >
              <Plus size={14} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
