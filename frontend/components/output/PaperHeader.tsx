import React from 'react';

interface PaperHeaderProps {
  title: string;
  subject: string;
  dueDate: string;
  totalMarks: number;
}

export const PaperHeader: React.FC<PaperHeaderProps> = ({
  title,
  subject,
  dueDate,
  totalMarks
}) => {
  return (
    <div className="w-full flex flex-col gap-5 text-[#303030]">
      {/* Paper Title Header */}
      <div 
        className="w-full text-center font-bold text-2xl md:text-[32px] leading-[140%] tracking-tight"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {title || "CBSE Assessment"}
      </div>

      {/* Meta parameters row */}
      <div className="w-full flex justify-between items-center text-sm md:text-[18px] font-semibold px-2 py-2 border-y border-neutral-200/60 mt-1">
        <span style={{ fontFamily: "'Inter', sans-serif" }}>Time Allowed: 45 minutes</span>
        <span style={{ fontFamily: "'Inter', sans-serif" }}>Maximum Marks: {totalMarks || 80}</span>
      </div>

      {/* Subject and Date details */}
      <div className="w-full text-sm md:text-[16px] font-semibold grid grid-cols-2 gap-y-2 mt-2 px-2">
        <div>Subject: <span className="font-normal text-neutral-700">{subject}</span></div>
        <div className="md:text-right">Exam Date: <span className="font-normal text-neutral-700">{dueDate}</span></div>
      </div>

      {/* Instructions line */}
      <div className="w-full text-sm md:text-[16px] font-semibold px-2 mt-1">
        <span className="block font-bold">General Instructions:</span>
        <p className="font-normal text-neutral-600">All questions are compulsory unless stated otherwise.</p>
      </div>

      {/* Student info entry fields */}
      <div 
        className="w-full flex flex-col gap-2.5 text-sm md:text-[16px] font-semibold px-2 mt-2 border-t border-dashed border-neutral-200 pt-4"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="flex flex-wrap gap-2">Name: <span className="flex-1 border-b border-neutral-400 min-w-[200px]" /></div>
        <div className="flex flex-wrap gap-2">Roll Number: <span className="flex-1 border-b border-neutral-400 min-w-[200px]" /></div>
        <div className="flex flex-wrap gap-2">Class/Section: <span className="flex-1 border-b border-neutral-400 min-w-[200px]" /></div>
      </div>
    </div>
  );
};
export default PaperHeader;
