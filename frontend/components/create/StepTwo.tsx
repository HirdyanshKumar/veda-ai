import React, { useRef } from 'react';
import { useAssignmentStore } from '../../store/assignmentStore';
import { QuestionTypeRow } from './QuestionTypeRow';
import { 
  UploadCloud, 
  CalendarPlus, 
  Plus, 
  ArrowLeft, 
  ArrowRight, 
  Mic, 
  Loader2 
} from 'lucide-react';

interface StepTwoProps {
  goPrev: () => void;
  onSubmit: () => void | Promise<any>;
  isSubmitting: boolean;
  validationErrors: Record<string, string>;
}

export const StepTwo: React.FC<StepTwoProps> = ({ 
  goPrev, 
  onSubmit, 
  isSubmitting,
  validationErrors 
}) => {
  const { 
    formData, 
    updateFormData, 
    addQuestionTypeRow, 
    removeQuestionTypeRow, 
    updateQuestionTypeRow,
    totalQuestions,
    totalMarks
  } = useAssignmentStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload base64 encoding handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormData({ fileUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-[810px] mx-auto px-4 md:px-0 mb-[160px] md:mb-[100px]">
      <div className="w-full bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[24px] md:rounded-[32px] p-5 md:p-8 flex flex-col gap-6 md:gap-8 items-start">
        
        {/* Header */}
        <div className="flex flex-col gap-0.5">
          <h2 
            className="text-[20px] font-bold text-[#303030]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.04em' }}
          >
            Assignment Details
          </h2>
          <p className="text-sm font-normal text-neutral-500">
            Provide additional files, due date, questions specifications, and guidelines
          </p>
        </div>

        {/* SECTION 1 — File Upload Zone */}
        <div className="w-full flex flex-col gap-3">
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            className="hidden"
          />
          <div 
            onClick={triggerFileSelect}
            className="w-full h-[180px] md:h-[202px] p-5 md:p-8 bg-white border-[1.75px] border-dashed border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50/50 rounded-[20px] md:rounded-[24px] flex flex-col justify-center items-center gap-4 transition-all cursor-pointer relative"
          >
            {/* Upload icon in a premium white rounded block */}
            <div className="w-10 h-10 bg-white border border-neutral-100 shadow-sm rounded-lg flex items-center justify-center text-[#1E1E1E]">
              <UploadCloud size={24} />
            </div>
            
            {/* Upload text info stack */}
            <div className="flex flex-col gap-1 items-center text-center">
              <span className="text-sm md:text-base font-semibold text-[#303030] tracking-tight">
                {formData.fileUrl ? "Image Attached successfully" : "Choose a file or drag & drop it here"}
              </span>
              <span className="text-xs md:text-sm font-normal text-[#A9A9A9]">
                {formData.fileUrl ? "Click to swap the file" : "JPEG, PNG, upto 10MB"}
              </span>
            </div>

            {/* Browse Files Button */}
            <button 
              type="button"
              className="px-6 py-2 bg-[#F6F6F6] hover:bg-[#ECECEC] rounded-full text-xs md:text-sm font-semibold text-[#303030] shadow-sm transition-all"
            >
              {formData.fileUrl ? "Change File" : "Browse Files"}
            </button>
          </div>

          <p className="text-center font-semibold text-[13px] md:text-[16px] text-[#303030]/60">
            Upload images of your preferred document/image
          </p>
        </div>

        {/* SECTION 2 — Due Date */}
        <div className="w-full flex flex-col gap-2">
          <label 
            className="text-[16px] font-bold text-[#303030]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.04em' }}
          >
            Due Date
          </label>
          <div className="w-full h-11 px-4 border border-[#DADADA] rounded-full bg-white md:bg-transparent flex justify-between items-center focus-within:border-neutral-400 transition-colors shadow-sm md:shadow-none">
            <input 
              type="text"
              value={formData.dueDate}
              onChange={(e) => updateFormData({ dueDate: e.target.value })}
              placeholder="DD-MM-YYYY"
              className="w-full bg-transparent border-none text-base font-medium text-[#303030] placeholder-[#A9A9A9] focus:outline-none"
            />
            <CalendarPlus size={22} className="text-[#2B2B2B] ml-2 flex-shrink-0" />
          </div>
          {validationErrors.dueDate && (
            <span className="text-[#EF4444] text-[12px] font-medium pl-3">
              {validationErrors.dueDate}
            </span>
          )}
        </div>

        {/* SECTION 3 — Question Types Table */}
        <div className="w-full flex flex-col gap-3">
          {/* Desktop Header row */}
          <div className="hidden md:flex justify-between items-center text-sm md:text-[16px] font-bold text-[#303030] px-2 mb-1">
            <span className="w-[471px]">Question Type</span>
            <span className="w-[100px] text-center pr-1.5">No. of Questions</span>
            <span className="w-[100px] text-center">Marks</span>
          </div>

          {/* Mobile label fallback */}
          <label className="flex md:hidden text-[16px] font-bold text-[#303030] mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.04em' }}>
            Question Type
          </label>

          {/* Question Rows Stack */}
          <div className="flex flex-col gap-3 md:gap-3.5 w-full">
            {formData.questionTypeRows.map((row) => (
              <QuestionTypeRow 
                key={row.id}
                row={row}
                onUpdate={updateQuestionTypeRow}
                onRemove={removeQuestionTypeRow}
                validationError={validationErrors[`row_${row.id}_type`]}
              />
            ))}
          </div>

          {validationErrors.questionTypeRows && (
            <span className="text-[#EF4444] text-[12px] font-medium pl-3">
              {validationErrors.questionTypeRows}
            </span>
          )}

          {/* Add Row Action */}
          <div className="flex items-center gap-2 mt-2 select-none w-full max-w-[746px]">
            <button 
              type="button"
              onClick={addQuestionTypeRow}
              className="w-9 h-9 bg-[#2B2B2B] hover:bg-neutral-800 rounded-full flex items-center justify-center text-white transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <Plus size={20} className="stroke-[2.5]" />
            </button>
            <span 
              className="text-sm font-bold text-[#303030] hover:text-black cursor-pointer transition-colors"
              onClick={addQuestionTypeRow}
            >
              Add Question Type
            </span>
          </div>

          {/* Totals displays */}
          <div className="flex flex-col items-end gap-1.5 w-full max-w-[746px] mt-4 border-t border-neutral-100/80 pt-3 pr-2">
            <span className="text-[14px] md:text-base font-semibold text-black">
              Total Questions : <span className="font-bold text-black">{totalQuestions()}</span>
            </span>
            <span className="text-[14px] md:text-base font-semibold text-black">
              Total Marks : <span className="font-bold text-black">{totalMarks()}</span>
            </span>
          </div>
        </div>

        {/* SECTION 4 — Additional Information */}
        <div className="w-full flex flex-col gap-2 relative">
          <label 
            className="text-[16px] font-bold text-[#303030]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.04em' }}
          >
            Additional Information (For better output)
          </label>
          <div className="w-full h-[102px] p-4 bg-white/20 border border-dashed border-[#DADADA] rounded-[16px] flex flex-col justify-between items-end relative shadow-sm">
            <textarea 
              value={formData.additionalInstructions}
              onChange={(e) => updateFormData({ additionalInstructions: e.target.value })}
              placeholder="e.g. Generate a question paper for 3 hour exam duration..."
              className="w-full h-full bg-transparent border-none outline-none focus:ring-0 resize-none text-xs md:text-sm text-[#303030] placeholder-neutral-400"
            />
            
            <button 
              type="button"
              onClick={() => alert('Voice note transcription coming soon!')}
              className="w-9 h-9 rounded-full bg-[#F0F0F0] hover:bg-[#E4E4E4] flex items-center justify-center text-[#303030] active:scale-95 transition-colors absolute bottom-2 right-2 shadow-sm"
              aria-label="Record voice note"
            >
              <Mic size={16} className="text-[#303030]" />
            </button>
          </div>
          {validationErrors.additionalInstructions && (
            <span className="text-[#EF4444] text-[12px] font-medium pl-3">
              {validationErrors.additionalInstructions}
            </span>
          )}
        </div>

        {/* BOTTOM ACTIONS (Previous & Submit) */}
        <div className="flex justify-between items-center w-full max-w-[810px] mt-6 pt-4 border-t border-neutral-100/50">
          <button 
            type="button"
            onClick={goPrev}
            disabled={isSubmitting}
            className="px-5 py-2.5 md:px-6 md:py-3 bg-white border border-[#DADADA] rounded-full flex items-center gap-1.5 md:gap-2 text-sm md:text-base font-semibold text-[#303030] hover:bg-neutral-50 active:scale-95 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <ArrowLeft size={16} className="stroke-[2.5]" />
            <span>Previous</span>
          </button>
          <button 
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 md:px-6 md:py-3 bg-[#181818] rounded-full flex items-center gap-1.5 md:gap-2 text-sm md:text-base font-semibold text-white hover:bg-black active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50 min-w-[130px] justify-center"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <>
                <span>Generate Paper</span>
                <ArrowRight size={16} className="stroke-[2.5]" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
