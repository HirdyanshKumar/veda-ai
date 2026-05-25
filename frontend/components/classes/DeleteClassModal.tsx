import React from 'react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteClassModalProps {
  isOpen: boolean;
  className: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteClassModal: React.FC<DeleteClassModalProps> = ({
  isOpen,
  className,
  isDeleting,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[4px]">
      <div
        className="w-[400px] max-w-[90vw] bg-white rounded-[24px] p-7 flex flex-col items-center gap-5 text-center shadow-[0_32px_64px_rgba(0,0,0,0.15)] animate-[fadeInUp_200ms_ease_forwards]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
          <Trash2 size={32} className="text-[#EF4444]" />
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <h3 className="text-xl font-bold text-[#1A1A1A]">Delete Class?</h3>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-[#1A1A1A]">{className}</span>? This cannot be undone.
          </p>
        </div>

        <div className="w-full bg-[#FFF7ED] border border-[#FED7AA] rounded-[10px] p-3 flex items-center gap-2 text-[#92400E]">
          <AlertTriangle size={14} className="text-[#E8572A] flex-shrink-0" />
          <span className="text-[12.5px] font-medium text-left leading-normal">
            Students with the join code will lose access.
          </span>
        </div>

        <div className="w-full flex items-center gap-3 mt-1">
          <button
            onClick={onClose}
            className="flex-1 h-11 bg-white border border-[#E5E7EB] rounded-full text-sm font-medium text-[#303030] hover:bg-neutral-50 active:scale-95 transition-all"
            disabled={isDeleting}
          >
            Keep Class
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-75 text-white rounded-full text-sm font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Yes, Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteClassModal;
