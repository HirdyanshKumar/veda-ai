import React from 'react';

interface AIMessageBarProps {
  title: string;
  subject: string;
  isSaving: boolean;
  isDownloading: boolean;
  hasUnsavedChanges: boolean;
  saveError: string | null;
  onDownload: () => void;
  onRegenerate: () => void;
  onPublish: () => void;
}

const AIMessageBar: React.FC<AIMessageBarProps> = ({
  title,
  subject,
  isSaving,
  isDownloading,
  hasUnsavedChanges,
  saveError,
  onDownload,
  onRegenerate,
  onPublish,
}) => {
  return (
    <div className="bg-[#0F0F14] border-b border-white/[0.06] px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">{title}</p>
          <p className="text-white/40 text-xs truncate">{subject}</p>
        </div>

        {isSaving && (
          <span className="ml-2 inline-flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Saving…
          </span>
        )}
        {!isSaving && hasUnsavedChanges && (
          <span className="ml-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
            Unsaved changes
          </span>
        )}
        {saveError && (
          <span className="ml-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full truncate max-w-[200px]" title={saveError}>
            {saveError}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onRegenerate}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Regenerate
        </button>

        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          {isDownloading ? 'Generating…' : 'PDF'}
        </button>

        <button
          onClick={onPublish}
          className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-500/20"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Publish
        </button>
      </div>
    </div>
  );
};

export default AIMessageBar;
