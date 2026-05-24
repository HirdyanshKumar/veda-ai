import React from 'react';

export const PaperSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-[1416px] mx-auto p-4 md:p-6 flex flex-col gap-6 bg-[#5E5E5E] rounded-[32px]">
      <div className="w-full h-20 bg-white/10 rounded-2xl animate-pulse" />
      
      <div className="w-full bg-white rounded-[32px] p-6 md:p-12 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-3/5 h-8 bg-neutral-200 rounded-lg animate-pulse" />
          <div className="w-2/5 h-6 bg-neutral-200 rounded-lg animate-pulse" />
          <div className="w-1/5 h-6 bg-neutral-200 rounded-lg animate-pulse" />
        </div>
        
        <div className="w-full h-[1.5px] bg-neutral-200" />
        
        <div className="flex justify-between items-center w-full">
          <div className="w-1/4 h-5 bg-neutral-200 rounded-lg animate-pulse" />
          <div className="w-1/4 h-5 bg-neutral-200 rounded-lg animate-pulse" />
        </div>
        
        <div className="w-full h-[1.5px] bg-neutral-200" />
        
        <div className="flex flex-col gap-6 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-6 h-5 bg-neutral-200 rounded-lg animate-pulse flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-5 bg-neutral-200 rounded-lg animate-pulse" />
                  <div className="w-20 h-4 bg-neutral-200 rounded-lg animate-pulse" />
                </div>
                <div className="w-4/5 h-5 bg-neutral-200 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaperSkeleton;
