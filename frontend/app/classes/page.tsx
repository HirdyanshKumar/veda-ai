'use client';

import React, { useState } from 'react';
import { Plus, GraduationCap } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import { useClasses } from '../../hooks/useClasses';
import ClassesSkeleton from '../../components/classes/ClassesSkeleton';
import ClassesEmptyState from '../../components/classes/ClassesEmptyState';
import ClassGrid from '../../components/classes/ClassGrid';
import CreateClassModal from '../../components/classes/CreateClassModal';
import DeleteClassModal from '../../components/classes/DeleteClassModal';
import { IClass } from '../../types';

export default function ClassesPage() {
  const {
    classes,
    isLoading,
    error,
    isCreating,
    createError,
    deletingId,
    copiedId,
    fetchClasses,
    createClass,
    deleteClass,
    updateClass,
    copyJoinCode,
    regenerateCode
  } = useClasses();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IClass | null>(null);
  const [editTarget, setEditTarget] = useState<IClass | null>(null);

  const getSubtitle = () => {
    if (classes.length === 0) return 'Create your first class to get started';
    if (classes.length === 1) return '1 active class';
    return `${classes.length} active classes`;
  };

  return (
    <MainLayout>
      <div className="w-full flex flex-col gap-6 pb-12">
        <div className="w-full flex flex-row justify-between items-end">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#4BC26D] ring-4 ring-[#4BC26D]/30" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-[#303030] font-sans tracking-tight leading-none mb-1">
                My Classes
              </h1>
              <p className="text-sm font-medium text-[#9CA3AF]">
                {getSubtitle()}
              </p>
            </div>
          </div>

          {!isLoading && classes.length > 0 && (
            <button
              onClick={() => {
                setEditTarget(null);
                setShowCreateModal(true);
              }}
              className="h-11 px-6 bg-[#1A1A1A] border-[3px] border-[#E8572A] rounded-full flex items-center justify-center gap-1.5 text-[#FFFFFF] text-[14px] font-semibold hover:bg-neutral-800 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
            >
              <Plus size={16} />
              <span>Create Class</span>
            </button>
          )}
        </div>

        {isLoading && <ClassesSkeleton />}

        {!isLoading && error && (
          <div className="w-full flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <p className="text-sm text-neutral-500 font-medium">{error}</p>
            <button
              onClick={fetchClasses}
              className="h-10 px-6 bg-[#1A1A1A] text-white rounded-full text-sm font-semibold hover:bg-neutral-800 transition-all active:scale-95"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && classes.length === 0 && (
          <ClassesEmptyState onCreateClick={() => {
            setEditTarget(null);
            setShowCreateModal(true);
          }} />
        )}

        {!isLoading && !error && classes.length > 0 && (
          <ClassGrid
            classes={classes}
            copiedId={copiedId}
            deletingId={deletingId}
            onCopyCode={copyJoinCode}
            onEdit={(cls) => setEditTarget(cls)}
            onDelete={(cls) => setDeleteTarget(cls)}
            onRegenerateCode={regenerateCode}
          />
        )}

        {showCreateModal && (
          <CreateClassModal
            isOpen={showCreateModal}
            isCreating={isCreating}
            createError={createError}
            mode="create"
            onClose={() => setShowCreateModal(false)}
            onSubmit={async (payload) => {
              const ok = await createClass(payload);
              if (ok) setShowCreateModal(false);
            }}
          />
        )}

        {editTarget && (
          <CreateClassModal
            isOpen={!!editTarget}
            isCreating={isCreating}
            createError={createError}
            mode="edit"
            initialValues={{
              name: editTarget.name,
              subject: editTarget.subject,
              grade: editTarget.grade
            }}
            onClose={() => setEditTarget(null)}
            onSubmit={async (payload) => {
              const ok = await updateClass(editTarget._id, payload);
              if (ok) setEditTarget(null);
            }}
          />
        )}

        {deleteTarget && (
          <DeleteClassModal
            isOpen={!!deleteTarget}
            className={deleteTarget.name}
            isDeleting={deletingId === deleteTarget._id}
            onClose={() => setDeleteTarget(null)}
            onConfirm={async () => {
              const ok = await deleteClass(deleteTarget._id);
              if (ok) setDeleteTarget(null);
            }}
          />
        )}
      </div>
    </MainLayout>
  );
}
