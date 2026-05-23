'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useCreateAssignment } from '@/hooks/useCreateAssignment';
import { ProgressBar } from '@/components/create/ProgressBar';
import { StepOne } from '@/components/create/StepOne';
import { StepTwo } from '@/components/create/StepTwo';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { 
    currentStep, 
    goNext, 
    goPrev, 
    submitForm, 
    isSubmitting: storeSubmitting, 
    submitError,
    validationErrors,
    resetForm
  } = useCreateAssignment();

  const handleSubmit = async () => {
    await submitForm();
  };

  const isOverlayOpen = storeSubmitting;

  return (
    <MainLayout>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700&display=swap');
      `}} />

      <div className="w-full h-full flex flex-col p-0 md:p-6 text-[#303030] gap-0 overflow-y-auto max-h-[calc(100vh-100px)] md:max-h-[690px] pr-1 -mr-1 relative">
        
        <div className="hidden md:flex items-center justify-between w-full max-w-[810px] mx-auto h-[66px] px-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#4BC26D] border-4 border-[#4BC26D]/40" />
            <div className="flex flex-col gap-0.5">
              <h1 
                className="text-[20px] font-bold text-[#303030] tracking-tight leading-none"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.04em' }}
              >
                Create Assignment
              </h1>
              <p className="text-sm font-normal text-neutral-400 tracking-tight leading-none mt-0.5">
                Set up a new assignment for your students
              </p>
            </div>
          </div>
        </div>

        <div className="flex md:hidden items-center h-12 px-5 mb-2 mt-1 gap-3">
          <button 
            onClick={goPrev}
            className="w-[38px] h-[38px] rounded-full bg-white flex items-center justify-center text-[#1A1A1A] shadow-[0_2px_8px_rgba(0,0,0,0.05)] active:scale-95 transition-all border border-neutral-100"
            aria-label="Back"
          >
            <ChevronLeft size={20} className="stroke-[2.5]" />
          </button>
          <span className="text-base font-semibold text-[#1A1A1A]">Create Assignment</span>
        </div>

        <ProgressBar step={currentStep} />

        {submitError && (
          <div className="w-full max-w-[810px] mx-auto px-4 md:px-0 mb-4">
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
              ⚠️ {submitError}
            </div>
          </div>
        )}

        {currentStep === 1 ? (
          <StepOne goNext={goNext} validationErrors={validationErrors} />
        ) : (
          <StepTwo 
            goPrev={goPrev} 
            onSubmit={handleSubmit} 
            isSubmitting={isOverlayOpen} 
            validationErrors={validationErrors} 
          />
        )}

      </div>

      {isOverlayOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-10 max-w-[400px] w-full text-center flex flex-col items-center gap-4 shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full border-4 border-neutral-100 border-t-[#FF5623] animate-spin" />
            
            <h3 
              className="text-[20px] font-bold text-[#303030]"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Generating your question paper...
            </h3>
            <p className="text-[14px] text-[#6B7280]">
              This usually takes 10-30 seconds
            </p>
            
            <div className="flex gap-1.5 justify-center mt-2">
              <span className="w-2.5 h-2.5 bg-[#FF5623] rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2.5 h-2.5 bg-[#FF5623] rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2.5 h-2.5 bg-[#FF5623] rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
