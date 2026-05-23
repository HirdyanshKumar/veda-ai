'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FailedStateProps {
  errorMessage?: string;
  onTryAgain: () => void;
  onBack: () => void;
}

export const FailedState: React.FC<FailedStateProps> = ({
  errorMessage,
  onTryAgain,
  onBack,
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full animate-[fade-in_300ms_ease_forwards] gap-6">
      <div className="w-20 h-20 md:w-24 md:h-24 bg-[#FEF2F2] rounded-full flex items-center justify-center shadow-inner">
        <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-[#EF4444]" />
      </div>

      <div className="flex flex-col items-center text-center gap-2">
        <h3
          className="text-lg md:text-[20px] font-bold text-[#1A1A1A]"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          Generation Failed
        </h3>
        <p className="text-[13px] md:text-[14px] font-normal text-[#6B7280] max-w-[360px] leading-relaxed px-4">
          {errorMessage || "Something went wrong while generating your paper."}
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full mt-2">
        <button
          onClick={onTryAgain}
          className="w-full h-[48px] bg-[#1A1A1A] hover:bg-neutral-800 text-white rounded-full text-[15px] md:text-[16px] font-semibold active:scale-[0.98] transition-all shadow-md cursor-pointer flex items-center justify-center"
        >
          Try Again
        </button>

        <button
          onClick={onBack}
          className="w-full h-[48px] bg-white border border-[#E5E7EB] hover:bg-neutral-50 text-[#1A1A1A] rounded-full text-[15px] md:text-[16px] font-medium active:scale-[0.98] transition-all shadow-sm cursor-pointer flex items-center justify-center"
        >
          Back to Assignments
        </button>
      </div>

      <span className="text-[12px] font-medium text-[#9CA3AF] mt-2 select-none">
        Need help? Contact support
      </span>
    </div>
  );
};

export default FailedState;
