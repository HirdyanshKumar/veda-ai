import React from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, ArrowRight, FileText } from 'lucide-react';
import { IAssignment } from '../../types';
import { formatRelativeTime } from '../../lib/utils';

interface PaperCardProps {
  paper: IAssignment;
  viewMode: 'grid' | 'list';
}

const subjectColor = (subject: string): { bg: string; text: string } => {
  const s = (subject || '').toLowerCase();
  if (s.includes('science') || s.includes('physic') || s.includes('chemist') || s.includes('biolog')) {
    return { bg: '#EFF6FF', text: '#3B82F6' };
  }
  if (s.includes('math')) {
    return { bg: '#F0FDF4', text: '#22C55E' };
  }
  if (s.includes('english') || s.includes('literat')) {
    return { bg: '#FAF5FF', text: '#A855F7' };
  }
  if (s.includes('history') || s.includes('social') || s.includes('geograph')) {
    return { bg: '#FFF7ED', text: '#E8572A' };
  }
  if (s.includes('computer') || s.includes('cs') || s.includes('technolog')) {
    return { bg: '#F0F9FF', text: '#0EA5E9' };
  }
  return { bg: '#F3F4F6', text: '#6B7280' };
};

const getDifficultyStyle = (difficulty: string) => {
  const d = (difficulty || '').toLowerCase();
  if (d === 'easy') return { bg: '#DCFCE7', text: '#16A34A', label: 'Easy' };
  if (d === 'hard') return { bg: '#FEE2E2', text: '#DC2626', label: 'Hard' };
  return { bg: '#FEF9C3', text: '#CA8A04', label: 'Medium' };
};

const PaperCard: React.FC<PaperCardProps> = ({ paper, viewMode }) => {
  const router = useRouter();
  const subColors = subjectColor(paper.subject);
  const diffColors = getDifficultyStyle(paper.difficulty);

  const handleClick = () => {
    router.push(`/paper/${paper._id}`);
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={handleClick}
        className="group w-full bg-white border border-[#F3F4F6] rounded-[16px] p-4 md:px-6 flex flex-row items-center gap-4 cursor-pointer transition-all duration-150 hover:border-neutral-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
      >
        <div
          className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: subColors.bg }}
        >
          <FileText size={22} style={{ color: subColors.text }} />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-[15px] font-bold text-[#1A1A1A] truncate pr-4">
            {paper.title}
          </h4>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: subColors.bg, color: subColors.text }}
            >
              {paper.subject}
            </span>
            <span className="text-xs text-[#9CA3AF]">
              {paper.numberOfQuestions} questions
            </span>
            <span className="text-xs text-[#9CA3AF]">
              {paper.totalMarks} marks
            </span>
            <span className="text-xs text-[#9CA3AF]">
              {formatRelativeTime(paper.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: diffColors.bg, color: diffColors.text }}
          >
            {diffColors.label}
          </span>
          <span className="text-xs font-semibold text-[#E8572A] group-hover:underline">
            View →
          </span>
        </div>
      </div>
    );
  }

  const types = paper.questionTypes || [];
  const displayTypes = types.slice(0, 3);
  const remainingTypes = types.length - 3;

  return (
    <div
      onClick={handleClick}
      className="group bg-white border border-[#F3F4F6] rounded-[20px] p-5 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:translate-y-[-3px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-neutral-200 relative overflow-hidden"
    >
      <div>
        <div className="flex items-center justify-between">
          <span
            className="text-[12px] font-bold px-2.5 py-1 rounded-full font-sans tracking-tight"
            style={{ backgroundColor: subColors.bg, color: subColors.text }}
          >
            {paper.subject}
          </span>
          <span
            className="text-[12px] font-bold px-2.5 py-1 rounded-full font-sans tracking-tight"
            style={{ backgroundColor: diffColors.bg, color: diffColors.text }}
          >
            {diffColors.label}
          </span>
        </div>

        <h4 className="text-base font-bold text-[#1A1A1A] font-sans tracking-tight leading-snug mt-3 line-clamp-2 pr-2">
          {paper.title}
        </h4>
      </div>

      <div className="grid grid-cols-3 gap-2 border-y border-[#F3F4F6] py-3 my-4">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-lg font-bold text-[#1A1A1A] font-sans leading-none">
            {paper.numberOfQuestions}
          </span>
          <span className="text-[11px] font-medium text-[#9CA3AF]">Questions</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 border-x border-[#F3F4F6]">
          <span className="text-lg font-bold text-[#1A1A1A] font-sans leading-none">
            {paper.totalMarks}
          </span>
          <span className="text-[11px] font-medium text-[#9CA3AF]">Total Marks</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-lg font-bold text-[#1A1A1A] font-sans leading-none">
            {types.length}
          </span>
          <span className="text-[11px] font-medium text-[#9CA3AF]">Types</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
          <div className="flex items-center gap-1">
            <CalendarDays size={12} className="text-[#9CA3AF]" />
            <span>{formatRelativeTime(paper.createdAt)}</span>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-[#F3F4F6] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] font-semibold text-[13px] rounded-full py-1 px-3 flex items-center gap-1">
            <span>View Paper</span>
            <ArrowRight size={12} />
          </div>
        </div>

        {types.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-[#F9FAFB]">
            {displayTypes.map((t, i) => (
              <span
                key={i}
                className="text-[11px] font-medium text-[#6B7280] bg-[#F9FAFB] border border-[#F3F4F6] rounded-full px-2 py-0.5"
              >
                {t}
              </span>
            ))}
            {remainingTypes > 0 && (
              <span className="text-[11px] font-medium text-[#9CA3AF] bg-[#F9FAFB] border border-[#F3F4F6] rounded-full px-2 py-0.5">
                +{remainingTypes} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperCard;
