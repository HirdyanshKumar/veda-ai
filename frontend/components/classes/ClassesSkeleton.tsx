import React from 'react';

const ClassesSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[240px] bg-white border border-[#F3F4F6] rounded-[20px] p-5 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[14px] bg-[#F3F4F6]" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-5 w-32 bg-[#F3F4F6] rounded-md" />
                <div className="h-4.5 w-24 bg-[#F3F4F6] rounded-md" />
              </div>
            </div>

            <div className="flex gap-2 my-2">
              <div className="h-7 w-24 bg-[#F3F4F6] rounded-full" />
              <div className="h-7 w-24 bg-[#F3F4F6] rounded-full" />
            </div>

            <div className="h-[72px] bg-[#F9FAFB] border border-[#F3F4F6] rounded-[12px] p-3.5 flex flex-col justify-between">
              <div className="h-3 w-16 bg-[#F3F4F6] rounded-md" />
              <div className="flex justify-between items-center mt-1">
                <div className="h-6 w-24 bg-[#F3F4F6] rounded-md" />
                <div className="h-7.5 w-16 bg-[#F3F4F6] rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassesSkeleton;
