'use client';

import React from 'react';
import { LucideIcon, CheckCircle2 } from 'lucide-react';

interface StageItemProps {
  stageNumber: 1 | 2 | 3 | 4;
  icon: LucideIcon;
  label: string;
  sublabel: string;
  currentStage: number;
}

export const StageItem: React.FC<StageItemProps> = ({
  stageNumber,
  icon: Icon,
  label,
  sublabel,
  currentStage,
}) => {
  const isCompleted = currentStage > stageNumber;
  const isActive = currentStage === stageNumber;
  const isPending = currentStage < stageNumber;

  return (
    <div className="flex flex-row items-start gap-4 w-full">
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isCompleted
              ? 'bg-[#1A1A1A] text-white'
              : isActive
              ? 'bg-[#E8572A] text-white shadow-[0_0_0_4px_rgba(232,87,42,0.2),0_0_0_8px_rgba(232,87,42,0.1)] animate-[ripple_1.5s_ease-out_infinite]'
              : 'bg-[#F3F4F6] text-[#9CA3AF]'
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 md:w-[22px] md:h-[22px]" />
          ) : (
            <Icon className="w-5 h-5 md:w-5 md:h-5" />
          )}
        </div>

        {stageNumber < 4 && (
          <div
            className={`w-[2px] min-h-[32px] md:min-h-[40px] my-1 transition-all duration-300 ${
              isCompleted
                ? 'bg-[#1A1A1A]'
                : isActive
                ? 'bg-gradient-to-b from-[#E8572A] to-[#DADADA]'
                : 'bg-[#DADADA]'
            }`}
          />
        )}
      </div>

      <div className="flex flex-col pt-1.5 pb-6 flex-1 min-w-0">
        <h4
          className={`text-sm md:text-[15px] transition-all duration-300 leading-snug ${
            isCompleted
              ? 'font-semibold text-[#1A1A1A]'
              : isActive
              ? 'font-bold text-[#1A1A1A] stage-label-shimmer'
              : 'font-medium text-[#9CA3AF]'
          }`}
        >
          {label}
        </h4>

        <div className="mt-1 transition-all duration-300">
          {isCompleted ? (
            <div className="flex items-center gap-1 text-[12px] md:text-[13px] font-semibold text-[#16A34A] animate-[fade-in_300ms_ease_forwards]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Done</span>
            </div>
          ) : isActive ? (
            <p className="text-[12px] md:text-[13px] font-normal text-[#6B7280] animate-[fade-in_300ms_ease_forwards]">
              {sublabel}
            </p>
          ) : (
            <p className="text-[12px] md:text-[13px] font-normal text-[#C4C4C4]">
              {sublabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StageItem;
