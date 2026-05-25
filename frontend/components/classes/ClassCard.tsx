import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Pencil, Trash2, RefreshCw, Users, CalendarDays, Copy, CheckCircle2, Info, GraduationCap } from 'lucide-react';
import { IClass } from '../../types';
import { formatRelativeTime } from '../../lib/utils';

interface ClassCardProps {
  class: IClass;
  isCopied: boolean;
  isDeleting: boolean;
  onCopyCode: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRegenerateCode: () => void;
}

const gradeColor = (grade: string): { bg: string; text: string } => {
  const g = parseInt(grade, 10);
  if (g >= 1 && g <= 3) return { bg: '#EFF6FF', text: '#3B82F6' };
  if (g >= 4 && g <= 6) return { bg: '#F0FDF4', text: '#22C55E' };
  if (g >= 7 && g <= 9) return { bg: '#FFF7ED', text: '#E8572A' };
  if (g >= 10 && g <= 12) return { bg: '#FAF5FF', text: '#A855F7' };
  return { bg: '#F3F4F6', text: '#6B7280' };
};

const ClassCard: React.FC<ClassCardProps> = ({
  class: cls,
  isCopied,
  isDeleting,
  onCopyCode,
  onEdit,
  onDelete,
  onRegenerateCode
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowActions(false);
      }
    };
    if (showActions) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showActions]);

  const colors = gradeColor(cls.grade);

  const formattedCode = () => {
    const code = cls.joinCode || '';
    if (code.length === 6) {
      return `${code.slice(0, 3)} · ${code.slice(3)}`;
    }
    return code;
  };

  return (
    <div
      className={`group bg-white border border-[#F3F4F6] rounded-[20px] p-5 flex flex-col justify-between transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-neutral-200 ${
        isDeleting ? 'opacity-50 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start relative">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: colors.bg }}
            >
              <GraduationCap size={22} style={{ color: colors.text }} />
            </div>
            <div className="flex flex-col min-w-0">
              <h4 className="text-[16px] font-bold text-[#1A1A1A] font-sans truncate pr-2">
                {cls.name}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-[#6B7280] font-medium mt-0.5">
                <span className="truncate max-w-[100px]">{cls.subject}</span>
                <span className="text-[#DADADA]">·</span>
                <span>Grade {cls.grade}</span>
              </div>
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowActions(!showActions)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-[#F9FAFB] transition-all"
            >
              <MoreVertical size={20} />
            </button>

            {showActions && (
              <div className="absolute right-0 top-9 w-40 bg-white border border-[#F3F4F6] rounded-[12px] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-30 animate-[fadeInUp_150ms_ease_forwards]">
                <button
                  onClick={() => {
                    onEdit();
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#303030] hover:bg-[#F9FAFB] rounded-[8px] transition-colors"
                >
                  <Pencil size={14} className="text-[#6B7280]" />
                  <span>Edit Class</span>
                </button>
                <button
                  onClick={() => {
                    setShowRegenerateConfirm(true);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#303030] hover:bg-[#F9FAFB] rounded-[8px] transition-colors"
                >
                  <RefreshCw size={14} className="text-[#6B7280]" />
                  <span>New Join Code</span>
                </button>
                <div className="h-px bg-[#F3F4F6] my-1" />
                <button
                  onClick={() => {
                    onDelete();
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#EF4444] hover:bg-red-50 rounded-[8px] transition-colors"
                >
                  <Trash2 size={14} className="text-[#EF4444]" />
                  <span>Delete Class</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#F9FAFB] rounded-full px-3 py-1 flex items-center gap-1.5 border border-[#F3F4F6]">
            <Users size={12} className="text-[#9CA3AF]" />
            <span className="text-[11.5px] font-semibold text-[#6B7280]">
              {cls.studentCount} student{cls.studentCount === 1 ? '' : 's'}
            </span>
          </div>
          <div className="bg-[#F9FAFB] rounded-full px-3 py-1 flex items-center gap-1.5 border border-[#F3F4F6]">
            <CalendarDays size={12} className="text-[#9CA3AF]" />
            <span className="text-[11.5px] font-semibold text-[#6B7280]">
              {formatRelativeTime(cls.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {showRegenerateConfirm ? (
          <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-[16px] p-4 flex flex-col gap-2.5 animate-[fadeInUp_150ms_ease_forwards]">
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold text-[#1A1A1A]">Generate a new code?</span>
              <span className="text-[11px] text-[#6B7280]">The old code will stop working immediately.</span>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowRegenerateConfirm(false)}
                className="text-[11.5px] font-semibold text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onRegenerateCode();
                  setShowRegenerateConfirm(false);
                }}
                className="bg-[#E8572A] hover:bg-[#D8471A] text-white text-[11.5px] font-bold px-3.5 py-1.5 rounded-full shadow-sm active:scale-95 transition-all"
              >
                Yes, regenerate
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-[16px] p-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-1 relative select-none">
              <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Join Code</span>
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-[#DADADA] hover:text-[#6B7280] transition-colors"
              >
                <Info size={11} />
              </button>
              {showTooltip && (
                <div className="absolute left-0 bottom-5 bg-[#1A1A1A] text-white text-[10px] font-medium py-1 px-2.5 rounded-[6px] shadow-md z-40 whitespace-nowrap">
                  Students enter this code to join your class
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xl font-bold font-mono tracking-wider text-[#1A1A1A]">
                {formattedCode()}
              </span>

              <button
                onClick={onCopyCode}
                className={`h-9 px-4 rounded-full text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
                  isCopied
                    ? 'bg-[#F0FDF4] text-[#22C55E] border border-[#BBF7D0]'
                    : 'bg-[#1A1A1A] hover:bg-neutral-800 text-white'
                }`}
              >
                {isCopied ? (
                  <>
                    <CheckCircle2 size={13} className="text-[#22C55E]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassCard;
