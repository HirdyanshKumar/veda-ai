import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Building2, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { ICreateClassInput } from '../../types';

interface CreateClassModalProps {
  isOpen: boolean;
  isCreating: boolean;
  createError: string | null;
  mode?: 'create' | 'edit';
  initialValues?: ICreateClassInput;
  onClose: () => void;
  onSubmit: (payload: ICreateClassInput) => void;
}

const gradeColor = (grade: string): { bg: string; text: string } => {
  const g = parseInt(grade, 10);
  if (g >= 1 && g <= 3) return { bg: '#EFF6FF', text: '#3B82F6' };
  if (g >= 4 && g <= 6) return { bg: '#F0FDF4', text: '#22C55E' };
  if (g >= 7 && g <= 9) return { bg: '#FFF7ED', text: '#E8572A' };
  if (g >= 10 && g <= 12) return { bg: '#FAF5FF', text: '#A855F7' };
  return { bg: '#F3F4F6', text: '#6B7280' };
};

const CreateClassModal: React.FC<CreateClassModalProps> = ({
  isOpen,
  isCreating,
  createError,
  mode = 'create',
  initialValues,
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [errors, setErrors] = useState<{ name?: string; subject?: string; grade?: string }>({});

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || '');
      setSubject(initialValues.subject || '');
      setGrade(initialValues.grade || '');
    } else {
      setName('');
      setSubject('');
      setGrade('');
    }
    setErrors({});
  }, [initialValues, isOpen]);

  if (!isOpen) return null;

  const subjectSuggestions = [
    'Science',
    'Math',
    'English',
    'History',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science'
  ];

  const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Class name must be at least 2 characters';
    }
    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!grade.trim()) {
      newErrors.grade = 'Grade is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      name: name.trim(),
      subject: subject.trim(),
      grade: grade.trim()
    });
  };

  const showPreview = mode === 'create' && name && subject && grade;
  const colors = gradeColor(grade);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[4px] p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-[480px] max-w-full bg-white rounded-[28px] p-6 md:p-8 flex flex-col gap-6 shadow-[0_32px_64px_rgba(0,0,0,0.15)] animate-[fadeInUp_200ms_ease_forwards] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F3F4F6] rounded-xl flex items-center justify-center">
              <GraduationCap size={20} className="text-[#1A1A1A]" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-[#1A1A1A] font-sans leading-tight">
                {mode === 'edit' ? 'Edit Class' : 'Create New Class'}
              </h3>
              <p className="text-xs text-[#6B7280]">
                {mode === 'edit' ? 'Update your class details' : 'Set up a class for your students'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#303030] font-sans">
              Class Name
            </label>
            <div className="w-full relative">
              <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Grade 8 - Section A"
                className={`w-full h-12 pl-11 pr-4 border rounded-[12px] bg-white text-[15px] font-sans text-[#303030] placeholder-[#A9A9A9] focus:outline-none focus:border-[#1A1A1A] transition-all ${
                  errors.name ? 'border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]/20' : 'border-[#DADADA]'
                }`}
              />
            </div>
            {errors.name && <span className="text-xs font-semibold text-[#EF4444] mt-0.5">{errors.name}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#303030] font-sans">
              Subject
            </label>
            <div className="w-full relative">
              <BookOpen size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none" />
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Science, Mathematics"
                className={`w-full h-12 pl-11 pr-4 border rounded-[12px] bg-white text-[15px] font-sans text-[#303030] placeholder-[#A9A9A9] focus:outline-none focus:border-[#1A1A1A] transition-all ${
                  errors.subject ? 'border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]/20' : 'border-[#DADADA]'
                }`}
              />
            </div>
            {errors.subject && <span className="text-xs font-semibold text-[#EF4444] mt-0.5">{errors.subject}</span>}

            <div className="flex flex-wrap gap-1.5 mt-1">
              {subjectSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubject(s)}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-all ${
                    subject === s
                      ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                      : 'bg-[#F3F4F6] border-transparent text-[#6B7280] hover:bg-[#E5E7EB]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#303030] font-sans">
              Grade / Standard
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {grades.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`h-10 rounded-[10px] border text-sm font-bold transition-all ${
                    grade === g
                      ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-sm'
                      : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#DADADA] hover:bg-[#F9FAFB]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            {errors.grade && <span className="text-xs font-semibold text-[#EF4444] mt-0.5">{errors.grade}</span>}
          </div>

          {createError && (
            <div className="w-full bg-red-50 border border-red-200 rounded-[10px] p-3 flex items-center gap-2 text-[#EF4444] animate-[fadeInUp_200ms_ease_forwards]">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span className="text-xs font-medium text-left leading-normal">{createError}</span>
            </div>
          )}

          {showPreview && (
            <div className="flex flex-col gap-2 mt-1 animate-[fadeInUp_200ms_ease_forwards]">
              <span className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Preview</span>
              <div className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-[16px] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: colors.bg }}
                  >
                    <GraduationCap size={18} style={{ color: colors.text }} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#1A1A1A] truncate max-w-[180px]">{name}</span>
                    <span className="text-[11px] text-[#6B7280]">
                      {subject} · Grade {grade}
                    </span>
                  </div>
                </div>
                <span className="text-[11.5px] font-bold text-[#9CA3AF] font-mono tracking-wider select-none">
                  CODE: ------
                </span>
              </div>
            </div>
          )}

          <div className="w-full flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 h-12 bg-white border border-[#E5E7EB] rounded-full text-sm font-medium text-[#6B7280] hover:border-[#DADADA] active:scale-95 transition-all"
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-12 bg-[#1A1A1A] hover:bg-neutral-800 border-[3px] border-[#E8572A] text-white rounded-full text-[15px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-75"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{mode === 'edit' ? 'Saving...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <GraduationCap size={16} className="text-white" />
                  <span>{mode === 'edit' ? 'Save Changes' : 'Create Class'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClassModal;
