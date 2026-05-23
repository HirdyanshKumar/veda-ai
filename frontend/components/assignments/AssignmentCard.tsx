import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical } from 'lucide-react';
import { IAssignment } from '../../types';
import { useAssignmentStore } from '../../store/assignmentStore';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useAuth } from '@clerk/nextjs';

interface AssignmentCardProps {
  assignment: IAssignment;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment }) => {
  const router = useRouter();
  const { openMenuId, setOpenMenuId, clearMenu, deleteAssignment } = useAssignmentStore();
  const { getToken } = useAuth();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isMenuOpen = openMenuId === assignment._id;

  const handleCardClick = () => {
    router.push(`/assignments/${assignment._id}`);
  };

  const getStatusBadge = (status: IAssignment['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-block bg-[#FEF3C7] text-[#D97706] rounded-full px-2.5 py-0.5 text-[12px] font-bold select-none uppercase tracking-wide">
            Pending
          </span>
        );
      case 'processing':
        return (
          <span className="inline-block bg-[#DBEAFE] text-[#2563EB] rounded-full px-2.5 py-0.5 text-[12px] font-bold select-none uppercase tracking-wide animate-pulse">
            Processing
          </span>
        );
      case 'failed':
        return (
          <span className="inline-block bg-[#FEE2E2] text-[#DC2626] rounded-full px-2.5 py-0.5 text-[12px] font-bold select-none uppercase tracking-wide">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  // Human readable date converter helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    // If it's already short format like DD-MM-YYYY, return it
    if (dateStr.includes('-') && dateStr.split('-').length === 3 && dateStr.length <= 10) {
      return dateStr;
    }
    // Else parse date
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateStr;
    }
  };

  const createdDate = formatDate(assignment.createdAt || new Date().toISOString());
  const dueDateStr = formatDate(assignment.dueDate);

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="bg-white rounded-[16px] p-5 md:p-[20px_24px] border border-[#F3F4F6] shadow-[0px_1px_4px_rgba(0,0,0,0.06)] min-h-[110px] flex flex-col justify-between transition-all hover:shadow-[0px_4px_12px_rgba(0,0,0,0.04)] relative cursor-pointer"
      >
        {/* Top Row: Title, Badges + Dropdown */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5 min-w-0">
            <h3 className="font-bold text-[#1A1A1A] text-base md:text-lg leading-tight underline decoration-1 underline-offset-4 decoration-[#E5E7EB] truncate">
              {assignment.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] font-medium text-[#6B7280]">
                {assignment.subject}
              </span>
              {getStatusBadge(assignment.status)}
            </div>
          </div>
          
          {/* More options three-dot popover */}
          <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setOpenMenuId(isMenuOpen ? null : assignment._id)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-50 text-[#9CA3AF] hover:text-[#6E6E6E] transition-colors"
              aria-label="More options"
            >
              <MoreVertical size={20} />
            </button>

            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-40 bg-transparent" onClick={clearMenu} />
                <div className="absolute right-0 top-full mt-1 bg-white rounded-[12px] p-2 shadow-[0px_8px_24px_rgba(0,0,0,0.12)] min-w-[170px] z-50 border border-neutral-100/80 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button 
                    onClick={() => {
                      clearMenu();
                      router.push(`/assignments/${assignment._id}`);
                    }}
                    className="w-full text-left font-medium text-sm text-[#1A1A1A] px-4 py-2.5 hover:bg-[#F9FAFB] rounded-[8px] transition-colors whitespace-nowrap"
                  >
                    View Assignment
                  </button>
                  <button 
                    onClick={() => {
                      clearMenu();
                      setIsDeleteOpen(true);
                    }}
                    className="w-full text-left font-medium text-sm text-[#EF4444] px-4 py-2.5 hover:bg-[#FEF2F2] rounded-[8px] transition-colors whitespace-nowrap"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Row: Date indicators */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-x-3 gap-y-1 mt-5 text-[13px] text-neutral-500 border-t border-neutral-50/50 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-[#6B7280]">Assigned on :</span>
            <span className="font-semibold text-[#1A1A1A]">{createdDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-[#6B7280]">Due :</span>
            <span className="font-semibold text-[#1A1A1A]">{dueDateStr}</span>
          </div>
        </div>
      </div>

      <DeleteConfirmModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={async () => {
          const token = await getToken();
          await deleteAssignment(assignment._id, token || undefined);
        }}
        title={assignment.title}
      />
    </>
  );
};
