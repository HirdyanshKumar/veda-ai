import React from 'react';
import { IAssignment } from '../../types';
import PaperCard from './PaperCard';

interface LibraryGridProps {
  papers: IAssignment[];
  viewMode: 'grid' | 'list';
}

const LibraryGrid: React.FC<LibraryGridProps> = ({ papers, viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="w-full flex flex-col gap-3 transition-opacity duration-150">
        {papers.map((paper, index) => (
          <div
            key={paper._id}
            className="w-full"
            style={{
              animation: 'fadeInUp 300ms ease forwards',
              animationDelay: `${Math.min(index * 50, 300)}ms`,
              opacity: 0,
              transform: 'translateY(12px)'
            }}
          >
            <PaperCard paper={paper} viewMode={viewMode} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-150">
      {papers.map((paper, index) => (
        <div
          key={paper._id}
          style={{
            animation: 'fadeInUp 300ms ease forwards',
            animationDelay: `${Math.min(index * 50, 300)}ms`,
            opacity: 0,
            transform: 'translateY(12px)'
          }}
        >
          <PaperCard paper={paper} viewMode={viewMode} />
        </div>
      ))}
    </div>
  );
};

export default LibraryGrid;
