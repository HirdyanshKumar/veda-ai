import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal, Search, Plus } from 'lucide-react';
import { IAssignment } from '../../types';
import { AssignmentCard } from './AssignmentCard';

interface AssignmentGridProps {
  assignments: IAssignment[];
}

export const AssignmentGrid: React.FC<AssignmentGridProps> = ({ assignments }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('Search Assignment');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPlaceholder('Search Name');
      } else {
        setPlaceholder('Search Assignment');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCreateAssignment = () => {
    router.push('/assignments/create');
  };

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col p-0 md:p-6 text-[#1A1A1A] gap-0 overflow-hidden relative">
      
      {/* FILTER & SEARCH ROW */}
      <div className="mx-4 md:mx-0 bg-white rounded-[24px] p-3 flex items-center justify-between border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.04)] mb-4 md:mb-5">
        {/* Left Side: Filter button */}
        <button 
          onClick={() => alert('Filter toggles coming soon!')}
          className="flex items-center justify-center gap-1.5 border border-[#E5E7EB] rounded-full bg-white text-[#6B7280] font-medium transition-all hover:bg-neutral-50 active:scale-95 cursor-pointer
                     w-[90px] h-10 text-[13px] md:w-auto md:h-10 md:px-4 md:text-sm"
        >
          <SlidersHorizontal size={16} className="text-[#6B7280]" />
          <span>{placeholder === 'Search Name' ? 'Filter' : 'Filter By'}</span>
        </button>

        {/* Right Side: Search Input */}
        <div className="relative flex items-center flex-1 md:flex-initial md:w-[280px] ml-2 md:ml-0">
          <Search size={16} className="absolute left-4 text-[#9CA3AF] pointer-events-none" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 h-10 rounded-full border border-[#E5E7EB] bg-white text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:border-neutral-400 transition-all font-medium"
          />
        </div>
      </div>

      {/* ASSIGNMENTS GRID LIST */}
      <div className="flex-1 overflow-y-auto pb-[130px] md:pb-24 px-4 md:px-0 pr-1 -mr-1">
        {filteredAssignments.length === 0 ? (
          <div className="w-full py-12 flex flex-col items-center justify-center text-center">
            <p className="text-[#6B7280] font-medium text-sm bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-neutral-100">
              No assignments found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard 
                key={assignment._id}
                assignment={assignment}
              />
            ))}
          </div>
        )}
      </div>

      {/* DESKTOP FLOATING CTA (Double guard) */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 hidden md:block">
        <button 
          onClick={handleCreateAssignment}
          className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white px-8 py-3.5 rounded-full shadow-[0px_4px_20px_rgba(0,0,0,0.20)] font-semibold text-[15px] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus size={16} className="stroke-[2.5]" />
          <span>Create Assignment</span>
        </button>
      </div>

    </div>
  );
};
