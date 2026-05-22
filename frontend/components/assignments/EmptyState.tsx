'use client';

import React from 'react';

interface EmptyStateProps {
  onCreateClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col items-center justify-center select-none max-w-[500px]">
      {/* Illustration Area */}
      <div className="relative w-[280px] h-[200px] flex items-center justify-center group">
        {/* SVG Illustration Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            width="240" 
            height="200" 
            viewBox="0 0 240 200" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="transform group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          >
            {/* 1. Circular Soft Gray Background Backdrop */}
            <circle cx="120" cy="100" r="75" fill="#EAEAEA" fillOpacity="0.75" />
            
            {/* 2. Curly black accent path (top-left) */}
            <path 
              d="M48 60 C38 65 30 75 42 85 C54 95 62 70 52 50 C48 42 42 42 36 48" 
              stroke="#1A1A1A" 
              strokeWidth="2" 
              strokeLinecap="round" 
              fill="none" 
              className="opacity-75"
            />
            
            {/* 3. Blue decorative dot (right-side) */}
            <circle cx="195" cy="115" r="4.5" fill="#3B82F6" />
            
            {/* 4. Blue sparkle star (bottom-left) */}
            <path 
              d="M50 135 L52 140 L57 142 L52 144 L50 149 L48 144 L43 142 L48 140 Z" 
              fill="#2563EB" 
              className="animate-pulse"
            />

            {/* 5. Floating text badge (top-right) */}
            <g filter="url(#shadow-badge)" className="transform translate-y-[-5px]">
              <rect x="156" y="38" width="38" height="24" rx="6" fill="#FFFFFF" />
              <circle cx="166" cy="50" r="4" fill="#9CA3AF" fillOpacity="0.6" />
              <rect x="174" y="47" width="12" height="6" rx="2" fill="#9CA3AF" fillOpacity="0.4" />
            </g>

            {/* 6. Main document sheet */}
            <g filter="url(#shadow-doc)">
              <rect x="85" y="40" width="62" height="88" rx="8" fill="#FFFFFF" />
              {/* Header dark bar */}
              <rect x="94" y="52" width="18" height="6" rx="3" fill="#1A1A1A" />
              {/* Standard text lines */}
              <rect x="94" y="66" width="44" height="4" rx="2" fill="#D1D5DB" />
              <rect x="94" y="76" width="44" height="4" rx="2" fill="#D1D5DB" />
              <rect x="94" y="86" width="30" height="4" rx="2" fill="#D1D5DB" />
              <rect x="94" y="96" width="40" height="4" rx="2" fill="#D1D5DB" />
            </g>

            {/* 7. Magnifying Glass (Positioned correctly, removing clipping filters to fix "broken glass" bug) */}
            <g className="transform translate-x-[15px] translate-y-[10px] group-hover:translate-x-[10px] group-hover:translate-y-[5px] transition-transform duration-500 ease-out">
              {/* Thick solid handle in matching premium lilac tone */}
              <path 
                d="M146 133 L172 159" 
                stroke="#C5C3E8" 
                strokeWidth="10" 
                strokeLinecap="round" 
              />
              {/* Inner handle high-fidelity shading */}
              <path 
                d="M146 133 L162 149" 
                stroke="#A8A6D4" 
                strokeWidth="6" 
                strokeLinecap="round" 
              />
              <path 
                d="M162 149 L172 159" 
                stroke="#D6D4F3" 
                strokeWidth="6" 
                strokeLinecap="round" 
              />
              
              {/* Solid Glass Circle Frame in premium lilac tone (#C5C3E8) */}
              {/* Semi-transparent white-blue glass fill overlay */}
              <circle cx="120" cy="107" r="30" fill="#FFFFFF" fillOpacity="0.4" />
              <circle cx="120" cy="107" r="30" stroke="#C5C3E8" strokeWidth="6" fill="none" />
              <circle cx="120" cy="107" r="27" stroke="#E5E4F8" strokeWidth="1.5" fill="none" />
              
              {/* Giant Red X inside the glass frame */}
              <path 
                d="M110 97 L130 117" 
                stroke="#FF3B30" 
                strokeWidth="6" 
                strokeLinecap="round" 
              />
              <path 
                d="M130 97 L110 117" 
                stroke="#FF3B30" 
                strokeWidth="6" 
                strokeLinecap="round" 
              />
            </g>

            {/* Reusable shadow definitions */}
            <defs>
              <filter id="shadow-doc" x="77" y="36" width="78" height="104" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.08" />
              </filter>
              <filter id="shadow-badge" x="150" y="34" width="50" height="36" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.05" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-[20px] font-bold text-[#1A1A1A] mt-6 text-center leading-snug">
        No assignments yet
      </h2>

      {/* Subtext */}
      <p className="text-sm text-[#6B7280] leading-[1.6] text-center mt-3 max-w-[380px]">
        Create your first assignment to start collecting and grading student submissions. 
        You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>

      {/* CTA Button */}
      <button 
        onClick={onCreateClick}
        className="mt-7 px-8 py-3.5 bg-[#1A1A1A] text-[#FFFFFF] rounded-full text-[15px] font-semibold flex items-center justify-center hover:bg-neutral-800 transition-all active:scale-[0.97] shadow-md hover:shadow-lg"
      >
        + Create Your First Assignment
      </button>
    </div>
  );
};

export default EmptyState;
