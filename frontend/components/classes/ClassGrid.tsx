import React from 'react';
import { IClass } from '../../types';
import ClassCard from './ClassCard';

interface ClassGridProps {
  classes: IClass[];
  copiedId: string | null;
  deletingId: string | null;
  onCopyCode: (id: string, code: string) => void;
  onEdit: (cls: IClass) => void;
  onDelete: (cls: IClass) => void;
  onRegenerateCode: (id: string) => void;
}

const ClassGrid: React.FC<ClassGridProps> = ({
  classes,
  copiedId,
  deletingId,
  onCopyCode,
  onEdit,
  onDelete,
  onRegenerateCode
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {classes.map((cls, index) => (
        <div
          key={cls._id}
          style={{
            animation: 'fadeInUp 300ms ease forwards',
            animationDelay: `${Math.min(index * 50, 300)}ms`,
            opacity: 0,
            transform: 'translateY(12px)'
          }}
        >
          <ClassCard
            class={cls}
            isCopied={copiedId === cls._id}
            isDeleting={deletingId === cls._id}
            onCopyCode={() => onCopyCode(cls._id, cls.joinCode)}
            onEdit={() => onEdit(cls)}
            onDelete={() => onDelete(cls)}
            onRegenerateCode={() => onRegenerateCode(cls._id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ClassGrid;
