import React from 'react';

interface ProgressBarProps {
  step: 1 | 2;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ step }) => {
  return (
    <div className="w-full max-w-[815px] px-4 md:px-0 mx-auto h-[5px] flex items-center gap-3 mb-6 select-none flex-shrink-0">
      <div 
        className={`flex-1 h-[5px] rounded-[4px] transition-all duration-300 ${
          step >= 1 ? 'bg-[#5E5E5E]' : 'bg-[#DADADA]'
        }`} 
      />
      <div 
        className={`flex-1 h-[5px] rounded-[4px] transition-all duration-300 ${
          step >= 2 ? 'bg-[#5E5E5E]' : 'bg-[#DADADA]'
        }`} 
      />
    </div>
  );
};
