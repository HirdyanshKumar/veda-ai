import React from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';

const LibraryEmptyState: React.FC = () => {
  const router = useRouter();

  return (
    <div className="w-full min-height-[60vh] flex flex-col items-center justify-center gap-6 py-12">
      <div className="w-[200px] h-[160px] bg-white rounded-[24px] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] relative overflow-visible">
        <div className="absolute transition-transform duration-300 rotate-[-8deg] translate-x-[-12px] opacity-40">
          <BookOpen size={40} className="text-[#DADADA]" />
        </div>
        <div className="absolute transition-transform duration-300 rotate-[8deg] translate-x-[12px] opacity-60">
          <BookOpen size={48} className="text-[#C4C4C4]" />
        </div>
        <div className="absolute z-10 scale-110">
          <BookOpen size={48} className="text-[#E8572A]" />
        </div>
      </div>

      <div className="flex flex-col items-center text-center gap-2">
        <h3 className="text-xl font-bold text-[#1A1A1A] font-sans">
          Your library is empty
        </h3>
        <p className="text-sm text-[#6B7280] max-w-[320px] leading-relaxed">
          Generated papers will appear here once you create assignments.
        </p>
      </div>

      <button
        onClick={() => router.push('/assignments/create')}
        className="h-12 px-8 bg-[#1A1A1A] border-[3px] border-[#E8572A] rounded-full flex items-center justify-center text-[#FFFFFF] text-[15px] font-semibold hover:bg-neutral-800 transition-all active:scale-[0.98] cursor-pointer"
      >
        ✦ Create Your First Assignment
      </button>
    </div>
  );
};

export default LibraryEmptyState;
