import React from 'react';

const LibrarySkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse">
      <div className="h-16 w-full bg-[#E5E7EB] rounded-[20px] mb-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[220px] bg-white border border-[#F3F4F6] rounded-[20px] p-5 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="h-6 w-20 bg-[#F3F4F6] rounded-full" />
                <div className="h-6 w-16 bg-[#F3F4F6] rounded-full" />
              </div>
              <div className="h-5 w-4/5 bg-[#F3F4F6] rounded-md mt-2" />
              <div className="h-5 w-2/3 bg-[#F3F4F6] rounded-md" />
            </div>

            <div className="grid grid-cols-3 gap-2 border-y border-[#F3F4F6] py-3 my-2">
              <div className="flex flex-col items-center gap-1">
                <div className="h-5 w-8 bg-[#F3F4F6] rounded-md" />
                <div className="h-3 w-12 bg-[#F3F4F6] rounded-md" />
              </div>
              <div className="flex flex-col items-center gap-1 border-x border-[#F3F4F6]">
                <div className="h-5 w-8 bg-[#F3F4F6] rounded-md" />
                <div className="h-3 w-12 bg-[#F3F4F6] rounded-md" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="h-5 w-8 bg-[#F3F4F6] rounded-md" />
                <div className="h-3 w-12 bg-[#F3F4F6] rounded-md" />
              </div>
            </div>

            <div className="flex justify-between items-center mt-2">
              <div className="h-4 w-28 bg-[#F3F4F6] rounded-md" />
              <div className="h-8 w-24 bg-[#F3F4F6] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibrarySkeleton;
