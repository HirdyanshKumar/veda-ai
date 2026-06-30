import React from 'react';
import { useRouter } from 'next/navigation';
import { SearchX } from 'lucide-react';

interface LibraryEmptySearchProps {
  query: string;
  subject: string;
  onClear: () => void;
}

const LibraryEmptySearch: React.FC<LibraryEmptySearchProps> = ({ query, subject, onClear }) => {
  const router = useRouter();

  const getMessage = () => {
    if (query && subject) {
      return `No papers matching "${query}" in ${subject}`;
    }
    if (query) {
      return `No papers matching "${query}"`;
    }
    if (subject) {
      return `No papers found in ${subject}`;
    }
    return 'No papers match the selected filters';
  };

  return (
    <div className="w-full min-height-[40vh] flex flex-col items-center justify-center gap-5 py-12">
      <div className="w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center">
        <SearchX size={48} className="text-[#DADADA]" />
      </div>

      <div className="flex flex-col items-center text-center gap-1.5">
        <h3 className="text-lg font-bold text-[#1A1A1A]">No papers found</h3>
        <p className="text-sm text-[#6B7280] max-w-[340px] leading-relaxed">
          {getMessage()}
        </p>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={onClear}
          className="h-10 px-6 bg-[#1A1A1A] text-white rounded-full text-sm font-semibold hover:bg-neutral-800 transition-all active:scale-[0.98]"
        >
          Clear Filters
        </button>
        <button
          onClick={() => router.push('/assignments/create')}
          className="h-10 px-6 border border-[#E5E7EB] bg-white text-[#303030] rounded-full text-sm font-medium hover:bg-neutral-50 transition-all active:scale-[0.98]"
        >
          Create New Paper
        </button>
      </div>
    </div>
  );
};

export default LibraryEmptySearch;
