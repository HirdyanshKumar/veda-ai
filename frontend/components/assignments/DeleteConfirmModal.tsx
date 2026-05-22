import React from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div 
        className="relative bg-white rounded-3xl p-6 md:p-8 max-w-[440px] w-full shadow-2xl border border-neutral-100 flex flex-col items-center gap-4 text-center z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Warning Icon Badge */}
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold text-lg select-none">
          ⚠️
        </div>

        {/* Header Stack */}
        <div className="flex flex-col gap-1.5 mt-2">
          <h3 
            className="text-lg font-bold text-[#1A1A1A] leading-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Delete Assignment
          </h3>
          <p className="text-sm font-normal text-[#6B7280] leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-neutral-800">"{title}"</span>? This action is permanent and cannot be undone.
          </p>
        </div>

        {/* Buttons Action Group */}
        <div className="flex justify-between items-center w-full gap-3 mt-5">
          <button 
            onClick={onClose}
            className="flex-1 px-5 py-2.5 bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-full text-sm font-semibold text-[#6B7280] active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-5 py-2.5 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-full text-sm font-semibold active:scale-95 transition-all shadow-md cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
