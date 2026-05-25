import React from 'react';
import { Search, ChevronDown, X, Tag } from 'lucide-react';

interface LibraryFiltersProps {
  searchQuery: string;
  selectedSubject: string;
  sortBy: string;
  subjects: string[];
  viewMode: 'grid' | 'list';
  onSearchChange: (q: string) => void;
  onSubjectChange: (s: string) => void;
  onSortChange: (s: 'newest' | 'oldest' | 'title_asc' | 'title_desc') => void;
  onViewModeChange: (m: 'grid' | 'list') => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const LibraryFilters: React.FC<LibraryFiltersProps> = ({
  searchQuery,
  selectedSubject,
  sortBy,
  subjects,
  onSearchChange,
  onSubjectChange,
  onSortChange,
  onClearFilters,
  hasActiveFilters
}) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full bg-white/70 border border-white/80 rounded-[20px] p-4 flex flex-col md:flex-row items-center gap-3 flex-wrap backdrop-blur-[8px] shadow-sm">
        
        <div className="flex-1 min-w-[220px] w-full relative">
          <Search size={16} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or subject..."
            className="w-full h-11 pl-10 pr-10 border border-[#DADADA] rounded-full bg-white text-sm text-[#303030] placeholder-[#A9A9A9] focus:border-[#1A1A1A] focus:outline-none transition-all duration-150"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#303030] transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="relative w-full md:w-auto">
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className={`w-full md:w-[170px] h-11 pl-4 pr-9 border rounded-full bg-white text-sm font-medium text-[#303030] cursor-pointer appearance-none focus:outline-none focus:border-[#1A1A1A] transition-all duration-150 ${
              selectedSubject ? 'border-[#1A1A1A] bg-[#F9F9F9]' : 'border-[#DADADA]'
            }`}
          >
            <option value="">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>

        <div className="relative w-full md:w-auto">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="w-full md:w-[170px] h-11 pl-4 pr-9 border border-[#DADADA] rounded-full bg-white text-sm font-medium text-[#303030] cursor-pointer appearance-none focus:outline-none focus:border-[#1A1A1A] transition-all duration-150"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title_asc">Title A → Z</option>
            <option value="title_desc">Title Z → A</option>
          </select>
          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="h-10 px-5 border border-[#DADADA] bg-white rounded-full flex items-center gap-1.5 text-sm font-semibold text-[#6B7280] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all duration-200 active:scale-95 animate-[fadeInUp_200ms_ease_forwards]"
          >
            <X size={14} />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap animate-[fadeInUp_200ms_ease_forwards]">
          {searchQuery && (
            <div className="bg-[#F3F4F6] text-[#303030] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-neutral-200">
              <Search size={11} className="text-[#6B7280]" />
              <span>Keyword: "{searchQuery}"</span>
              <button
                onClick={() => onSearchChange('')}
                className="hover:text-red-500 text-[#9CA3AF] transition-colors ml-0.5"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {selectedSubject && (
            <div className="bg-[#F3F4F6] text-[#303030] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-neutral-200">
              <Tag size={11} className="text-[#6B7280]" />
              <span>Subject: {selectedSubject}</span>
              <button
                onClick={() => onSubjectChange('')}
                className="hover:text-red-500 text-[#9CA3AF] transition-colors ml-0.5"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LibraryFilters;
