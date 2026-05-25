import React, { useState, useEffect } from 'react';
import { useAssignmentStore } from '../../store/assignmentStore';
import { ArrowRight, BookOpen } from 'lucide-react';
import { DIFFICULTY_OPTIONS } from '../../constants/questionTypes';
import { useAuth } from '@clerk/nextjs';
import api from '../../lib/api';
import { IClass } from '../../types';

interface StepOneProps {
  goNext: () => void;
  validationErrors: Record<string, string>;
}

export const StepOne: React.FC<StepOneProps> = ({ goNext, validationErrors }) => {
  const { formData, updateFormData } = useAssignmentStore();
  const { getToken } = useAuth();
  const [classes, setClasses] = useState<IClass[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = await getToken();
        if (token) {
          const res = await api.getClasses(token);
          setClasses(res);
        }
      } catch (err) {
        // Ignored
      } finally {
        setLoadingClasses(false);
      }
    };
    fetchClasses();
  }, [getToken]);

  return (
    <div className="w-full max-w-[810px] mx-auto px-4 md:px-0 mb-[160px] md:mb-[100px]">
      <div className="w-full bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[24px] md:rounded-[32px] p-5 md:p-8 flex flex-col gap-6 md:gap-8 items-start">
        
        {/* Form Header */}
        <div className="flex flex-col gap-0.5">
          <h2 
            className="text-[20px] font-bold text-[#303030]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.04em' }}
          >
            Assignment Basics
          </h2>
          <p className="text-sm font-normal text-neutral-500">
            Define your assignment's title, subject, and general difficulty
          </p>
        </div>

        {/* Title Input */}
        <div className="w-full flex flex-col gap-2">
          <label 
            className="text-[16px] font-bold text-[#303030]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.04em' }}
          >
            Assignment Title
          </label>
          <input 
            type="text"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            placeholder="e.g. Quiz on Electricity"
            className="w-full h-11 px-4 border border-[#DADADA] rounded-full bg-white text-base font-medium text-[#303030] placeholder-[#A9A9A9] focus:outline-none focus:border-neutral-400 transition-colors shadow-sm"
          />
          {validationErrors.title && (
            <span className="text-[#EF4444] text-[12px] font-medium pl-3">
              {validationErrors.title}
            </span>
          )}
        </div>

        {/* Subject Input */}
        <div className="w-full flex flex-col gap-2">
          <label 
            className="text-[16px] font-bold text-[#303030]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.04em' }}
          >
            Subject
          </label>
          <input 
            type="text"
            value={formData.subject}
            onChange={(e) => updateFormData({ subject: e.target.value })}
            placeholder="e.g. Science, Mathematics"
            className="w-full h-11 px-4 border border-[#DADADA] rounded-full bg-white text-base font-medium text-[#303030] placeholder-[#A9A9A9] focus:outline-none focus:border-neutral-400 transition-colors shadow-sm"
          />
          {validationErrors.subject && (
            <span className="text-[#EF4444] text-[12px] font-medium pl-3">
              {validationErrors.subject}
            </span>
          )}
        </div>

        {/* Class Selection Field */}
        <div className="w-full flex flex-col gap-2">
          <label 
            className="text-[16px] font-bold text-[#303030]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.04em' }}
          >
            Class
          </label>
          {!loadingClasses && classes.length === 0 ? (
            <div className="w-full bg-[#FFF7ED] border border-[#FED7AA] rounded-[16px] p-4 flex items-start gap-3">
              <BookOpen size={18} className="text-[#E8572A] mt-0.5 flex-shrink-0" />
              <span className="text-sm text-[#6B7280] leading-normal">
                No classes yet.{' '}
                <a
                  href="/classes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#E8572A] hover:underline"
                >
                  Create a class
                </a>{' '}
                to assign this paper to students.
              </span>
            </div>
          ) : (
            <div className="relative w-full">
              <select
                value={formData.classId || ''}
                onChange={(e) => updateFormData({ classId: e.target.value || undefined })}
                className="w-full h-11 px-4 pr-10 border border-[#DADADA] rounded-full bg-white text-base font-medium text-[#303030] appearance-none focus:outline-none focus:border-neutral-400 transition-colors shadow-sm cursor-pointer"
                disabled={loadingClasses}
              >
                <option value="">Do not assign to class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} — {c.subject} (Grade {c.grade})
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                ▼
              </div>
            </div>
          )}
        </div>

        {/* Difficulty Pill Selection */}
        <div className="w-full flex flex-col gap-2">
          <label 
            className="text-[16px] font-bold text-[#303030] mb-1"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.04em' }}
          >
            Difficulty Level
          </label>
          <div className="flex flex-wrap gap-2.5">
            {DIFFICULTY_OPTIONS.map((opt) => {
              const isActive = formData.difficulty === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateFormData({ difficulty: opt.value as "easy" | "medium" | "hard" })}
                  className={`px-6 py-2.5 rounded-full text-[15px] font-semibold transition-all active:scale-95 shadow-sm border border-neutral-200/40 ${
                    isActive 
                      ? 'bg-[#181818] text-white hover:bg-black' 
                      : 'bg-white text-[#303030] hover:bg-neutral-50'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions bar (Next Only for Step 1) */}
        <div className="flex justify-end items-center w-full mt-6 pt-4 border-t border-neutral-100/50">
          <button 
            type="button"
            onClick={goNext}
            className="px-6 py-3 bg-[#181818] rounded-full flex items-center gap-2 text-base font-semibold text-white hover:bg-black active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <span>Next</span>
            <ArrowRight size={16} className="stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};
