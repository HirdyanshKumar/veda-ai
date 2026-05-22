import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 gap-5 bg-transparent min-h-[500px]">
      <div className="bg-white rounded-3xl p-10 max-w-[400px] w-full text-center flex flex-col items-center gap-4 shadow-xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Spinner */}
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
        <p className="text-[12px] text-neutral-400 italic mt-[-5px]">
          AI is creating your question paper...
        </p>
        
        {/* Three animated bounce dots */}
        <div className="flex gap-1.5 justify-center mt-1">
          <span className="w-2.5 h-2.5 bg-[#FF5623] rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2.5 h-2.5 bg-[#FF5623] rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2.5 h-2.5 bg-[#FF5623] rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};
export default LoadingState;
