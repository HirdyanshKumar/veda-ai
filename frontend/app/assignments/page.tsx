'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAssignments } from '@/hooks/useAssignments';
import EmptyState from '@/components/assignments/EmptyState';
import { AssignmentGrid } from '@/components/assignments/AssignmentGrid';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AssignmentsPage() {
  const router = useRouter();
  const { assignments, isLoading, error, refetch } = useAssignments();

  const handleCreateAssignment = () => {
    router.push('/assignments/create');
  };

  return (
    <MainLayout>
      <div className="w-full h-full flex flex-col p-0 md:p-6 text-[#1A1A1A] gap-0 overflow-hidden relative">
        
        {/* DESKTOP HEADER */}
        <div className="hidden md:flex flex-col mb-5 px-6 md:px-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Assignments</h1>
          </div>
          <p className="text-sm font-normal text-[#6B7280] mt-1">
            Manage and create assignments for your classes.
          </p>
        </div>

        {/* MOBILE SUB-HEADER */}
        <div className="flex md:hidden items-center justify-between h-12 px-5 mb-3 mt-1">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="w-[38px] h-[38px] rounded-full bg-white flex items-center justify-center text-[#1A1A1A] shadow-[0_2px_8px_rgba(0,0,0,0.05)] active:scale-95 transition-all border border-neutral-100"
              aria-label="Back"
            >
              <ChevronLeft size={20} className="stroke-[2.5]" />
            </button>
            <span className="text-base font-semibold text-[#1A1A1A]">Assignments</span>
          </div>
        </div>

        {/* PAGE CONTENT SWITCHER */}
        {isLoading ? (
          <div className="flex-1 overflow-y-auto px-4 md:px-0 pr-1 -mr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i}
                  className="bg-white rounded-[16px] p-5 md:p-[20px_24px] border border-[#F3F4F6] min-h-[142px] flex flex-col justify-between animate-pulse"
                >
                  <div className="flex flex-col gap-3">
                    <div className="h-5 w-2/3 bg-neutral-200 rounded-full" />
                    <div className="h-4 w-1/3 bg-neutral-100 rounded-full" />
                  </div>
                  <div className="flex justify-between items-center mt-5 pt-3 border-t border-neutral-50/50">
                    <div className="h-4 w-5/12 bg-neutral-100 rounded-full" />
                    <div className="h-4 w-5/12 bg-neutral-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] gap-4 px-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold text-lg select-none">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-[#303030]">Failed to Load List</h3>
            <p className="text-sm text-neutral-400 max-w-xs">{error}</p>
            <button 
              onClick={refetch}
              className="flex items-center gap-2 px-5 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-full active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Retry Load</span>
            </button>
          </div>
        ) : assignments.length === 0 ? (
          <div className="flex-1 flex items-center justify-center min-h-[440px] px-6">
            <EmptyState onCreateClick={handleCreateAssignment} />
          </div>
        ) : (
          <AssignmentGrid assignments={assignments} />
        )}

      </div>
    </MainLayout>
  );
}
