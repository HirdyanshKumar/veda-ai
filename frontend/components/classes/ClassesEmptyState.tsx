import React from 'react';
import { Plus, Users, Copy, GraduationCap } from 'lucide-react';

interface ClassesEmptyStateProps {
  onCreateClick: () => void;
}

const ClassesEmptyState: React.FC<ClassesEmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="w-full min-height-[60vh] flex flex-col items-center justify-center gap-7 py-12">
      <div className="w-[240px] h-[180px] relative flex items-center justify-center">
        <div className="absolute w-[200px] h-[200px] bg-[#F3F4F6] rounded-full scale-95" />
        <div className="absolute w-[160px] h-[110px] bg-[#1A1A1A] rounded-[12px] border-[6px] border-[#5E5E5E] shadow-md flex flex-col gap-2.5 p-3.5 select-none z-10">
          <div className="h-[3px] w-[70%] bg-white/40 rounded-full" />
          <div className="h-[3px] w-[55%] bg-white/40 rounded-full" />
          <div className="h-[3px] w-[40%] bg-white/40 rounded-full" />
        </div>
        <div className="absolute bottom-[24px] right-[24px] w-7 h-7 bg-[#E8572A] rounded-full flex items-center justify-center shadow-md shadow-[#E8572A]/20 select-none z-20">
          <Plus size={14} className="text-white stroke-[3]" />
        </div>
      </div>

      <div className="flex flex-col items-center text-center gap-2">
        <h3 className="text-xl font-bold text-[#1A1A1A] font-sans">
          No classes yet
        </h3>
        <p className="text-sm text-[#6B7280] max-w-[300px] leading-relaxed">
          Create a class to organize your students and share assignments using a join code.
        </p>
      </div>

      <div className="flex items-center gap-6 py-2 select-none">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="w-9 h-9 rounded-full bg-[#F3F4F6] flex items-center justify-center">
            <Plus size={16} className="text-[#6B7280]" />
          </div>
          <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Create class</span>
        </div>
        <div className="text-[#DADADA] text-lg font-bold">→</div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="w-9 h-9 rounded-full bg-[#F3F4F6] flex items-center justify-center">
            <Copy size={15} className="text-[#6B7280]" />
          </div>
          <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Share code</span>
        </div>
        <div className="text-[#DADADA] text-lg font-bold">→</div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="w-9 h-9 rounded-full bg-[#F3F4F6] flex items-center justify-center">
            <Users size={16} className="text-[#6B7280]" />
          </div>
          <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Students join</span>
        </div>
      </div>

      <button
        onClick={onCreateClick}
        className="h-12 px-8 bg-[#1A1A1A] border-[3px] border-[#E8572A] rounded-full flex items-center justify-center gap-2 text-[#FFFFFF] text-[15px] font-semibold hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-md shadow-black/10 cursor-pointer"
      >
        <GraduationCap size={16} className="text-white" />
        <span>Create Your First Class</span>
      </button>
    </div>
  );
};

export default ClassesEmptyState;
