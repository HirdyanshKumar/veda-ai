'use client';

import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import { useLibrary } from '../../hooks/useLibrary';
import LibrarySkeleton from '../../components/library/LibrarySkeleton';
import LibraryFilters from '../../components/library/LibraryFilters';
import LibraryGrid from '../../components/library/LibraryGrid';
import LibraryEmptyState from '../../components/library/LibraryEmptyState';
import LibraryEmptySearch from '../../components/library/LibraryEmptySearch';

export default function LibraryPage() {
  const {
    allPapers,
    filteredPapers,
    isLoading,
    error,
    searchQuery,
    selectedSubject,
    sortBy,
    subjects,
    viewMode,
    setSearchQuery,
    setSelectedSubject,
    setSortBy,
    setViewMode,
    clearFilters,
    hasActiveFilters,
    refetch
  } = useLibrary();

  return (
    <MainLayout>
      <div className="w-full flex flex-col gap-6 pb-12">
        
        <div className="w-full flex flex-row justify-between items-end">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#4BC26D] ring-4 ring-[#4BC26D]/30" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-[#303030] font-sans tracking-tight leading-none mb-1">
                My Library
              </h1>
              <p className="text-sm font-medium text-[#9CA3AF]">
                {hasActiveFilters
                  ? `Showing ${filteredPapers.length} of ${allPapers.length} papers`
                  : `${allPapers.length} generated paper${allPapers.length === 1 ? '' : 's'} · All time`}
              </p>
            </div>
          </div>

          {allPapers.length > 0 && (
            <div className="hidden md:flex bg-[#F3F4F6] rounded-[10px] p-0.5 items-center">
              <button
                onClick={() => setViewMode('grid')}
                className={`w-9 h-9 rounded-[8px] flex items-center justify-center transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#1A1A1A] text-white shadow-sm'
                    : 'bg-transparent text-[#9CA3AF] hover:text-[#303030]'
                }`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`w-9 h-9 rounded-[8px] flex items-center justify-center transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#1A1A1A] text-white shadow-sm'
                    : 'bg-transparent text-[#9CA3AF] hover:text-[#303030]'
                }`}
              >
                <List size={18} />
              </button>
            </div>
          )}
        </div>

        {isLoading && <LibrarySkeleton />}

        {!isLoading && error && (
          <div className="w-full flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <p className="text-sm text-neutral-500 font-medium">{error}</p>
            <button
              onClick={refetch}
              className="h-10 px-6 bg-[#1A1A1A] text-white rounded-full text-sm font-semibold hover:bg-neutral-800 transition-all active:scale-95"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && allPapers.length === 0 && <LibraryEmptyState />}

        {!isLoading && !error && allPapers.length > 0 && (
          <>
            <LibraryFilters
              searchQuery={searchQuery}
              selectedSubject={selectedSubject}
              sortBy={sortBy}
              subjects={subjects}
              viewMode={viewMode}
              onSearchChange={setSearchQuery}
              onSubjectChange={setSelectedSubject}
              onSortChange={setSortBy}
              onViewModeChange={setViewMode}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {filteredPapers.length === 0 ? (
              <LibraryEmptySearch
                query={searchQuery}
                subject={selectedSubject}
                onClear={clearFilters}
              />
            ) : (
              <LibraryGrid papers={filteredPapers} viewMode={viewMode} />
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
