'use client';

import React from 'react';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#EEEEEE] to-[#DADADA] p-6">
      
      {/* Top Branding Section */}
      <div className="flex flex-col items-center text-center gap-2 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9800] via-[#FF5722] to-[#E64A19] flex items-center justify-center shadow-md shadow-[#E64A19]/25 select-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M3 4C3 3.44772 3.44772 3 4 3H9.5C9.9122 3 10.2763 3.25248 10.4226 3.6393L12 7.82088L13.5774 3.6393C13.7237 3.25248 14.0878 3 14.5 3H20C20.5523 3 21 3.44772 21 4C21 4.22383 20.925 4.44062 20.7874 4.61718L13.7874 19.6172C13.4831 20.1979 12.8767 20.5524 12.2126 20.5524H11.7874C11.1233 20.5524 10.5169 20.1979 10.2126 19.6172L3.2126 4.61718C3.07502 4.44062 3 4.22383 3 4Z" 
                fill="white"
              />
            </svg>
          </div>
          <span className="text-[24px] font-bold text-[#1A1A1A] tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>VedaAI</span>
        </div>
        <p className="text-sm font-medium text-[#6B7280] max-w-[320px]">
          AI-powered assessment creator for teachers
        </p>
      </div>

      {/* Clerk SignIn Form */}
      <SignIn
        path="/sign-in"
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

      {/* Footer Disclaimer */}
      <p className="text-xs text-[#9CA3AF] mt-6 text-center font-medium">
        For teachers only — student access coming soon
      </p>
      
    </div>
  );
}
