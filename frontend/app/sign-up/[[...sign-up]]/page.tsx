'use client';

import React from 'react';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#EEEEEE] to-[#DADADA] p-6">
      
      <div className="flex flex-col items-center text-center gap-2 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9800] via-[#FF5722] to-[#E64A19] flex items-center justify-center shadow-md shadow-[#E64A19]/25 select-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[24px] font-bold text-[#1A1A1A] tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>QuestAI</span>
        </div>
        <p className="text-sm font-medium text-[#6B7280] max-w-[320px]">
          AI-powered assessment creator for teachers
        </p>
      </div>

      <SignUp
        path="/sign-up"
        appearance={{
          elements: {
            formButtonPrimary: 'bg-[#1A1A1A] hover:bg-neutral-800 text-white rounded-full font-semibold text-sm cursor-pointer border-0 active:scale-95 transition-all shadow-sm py-2.5',
            card: 'rounded-[24px] border border-neutral-100/50 shadow-[0_16px_48px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.01)] bg-white',
            headerTitle: 'font-bold text-[#1A1A1A]',
            headerSubtitle: 'text-[#6B7280]',
            socialButtonsBlockButton: 'rounded-full border border-[#E5E7EB] hover:bg-neutral-50 active:scale-98 transition-all',
            footerActionLink: 'text-[#E8572A] hover:text-[#D74619]',
            identityPreviewEditButton: 'text-[#E8572A] hover:text-[#D74619]'
          }
        }}
      />

      <p className="text-xs text-[#9CA3AF] mt-6 text-center font-medium">
        For teachers only — student access coming soon
      </p>
      
    </div>
  );
}
