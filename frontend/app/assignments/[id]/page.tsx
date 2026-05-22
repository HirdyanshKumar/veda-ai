'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useSocket } from '@/hooks/useSocket';
import LoadingState from '@/components/output/LoadingState';
import PaperHeader from '@/components/output/PaperHeader';
import QuestionsList from '@/components/output/QuestionsList';
import { ChevronLeft, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { IAssignment } from '@/types';

export default function AssignmentOutputPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { 
    currentPaper, 
    paperLoading, 
    paperError, 
    fetchPaper,
    setPaper,
    setPaperError
  } = useAssignmentStore();

  const [assignment, setAssignment] = useState<IAssignment | null>(null);
  const [metaLoading, setMetaLoading] = useState(true);

  // Load assignment meta and details
  const loadDetails = async () => {
    if (!id) return;
    setMetaLoading(true);
    try {
      const meta = await api.getAssignment(id);
      setAssignment(meta);
      
      // If assignment is already completed, fetch the paper
      if (meta.status === 'completed') {
        await fetchPaper(id);
      }
    } catch (err: any) {
      setPaperError(err?.message || "Failed to load assignment details");
    } finally {
      setMetaLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  // Wire Socket listener for ready/failed events
  useSocket({
    assignmentId: id,
    onReady: (paper) => {
      setPaper(paper);
      // reload metadata so status reflects completed
      api.getAssignment(id).then(setAssignment).catch(console.error);
    },
    onFailed: (error) => {
      setPaperError(error);
      // reload metadata so status reflects failed
      api.getAssignment(id).then(setAssignment).catch(console.error);
    }
  });

  const handleDownload = () => {
    // Print window trigger with clean print layouts
    window.print();
  };

  const handleTryAgain = () => {
    loadDetails();
  };

  // Human readable date converter helper
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    if (dateStr.includes('-') && dateStr.split('-').length === 3 && dateStr.length <= 10) {
      return dateStr;
    }
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateStr;
    }
  };

  // Determine state representations
  const isFailed = paperError || (assignment && assignment.status === 'failed');
  const isLoading = 
    metaLoading || 
    paperLoading || 
    (assignment && (assignment.status === 'pending' || assignment.status === 'processing'));

  // State 1 — Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <LoadingState />
      </MainLayout>
    );
  }

  // State 2 — Failed state
  if (isFailed || !currentPaper) {
    return (
      <MainLayout>
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 gap-5 bg-transparent min-h-[440px]">
          <div className="bg-white rounded-3xl p-10 max-w-[420px] w-full text-center flex flex-col items-center gap-4 shadow-xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
            <AlertCircle size={48} className="text-[#EF4444]" />
            <h3 
              className="text-[20px] font-bold text-[#303030]"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Generation Failed
            </h3>
            <p className="text-[14px] text-[#6B7280]">
              {paperError || "An unexpected error occurred during paper customization."}
            </p>
            
            <div className="flex flex-col gap-2.5 w-full mt-4">
              <button 
                onClick={handleTryAgain}
                className="w-full px-5 py-2.5 bg-[#1A1A1A] hover:bg-neutral-800 text-white rounded-full text-sm font-semibold active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                Try Again
              </button>
              <button 
                onClick={() => router.push("/assignments")}
                className="w-full px-5 py-2.5 bg-white border border-[#DADADA] hover:bg-neutral-50 rounded-full text-sm font-semibold text-[#303030] active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                Back to Assignments
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // State 3 — completed paper card layout
  return (
    <MainLayout>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        
        @media print {
          /* Hide non-essential layout details on pdf prints */
          body * {
            visibility: hidden;
          }
          #print-paper-sheet, #print-paper-sheet * {
            visibility: visible;
          }
          #print-paper-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #FFFFFF !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}} />

      {/* Main outer scrolling layout */}
      <div className="w-full h-full overflow-hidden flex flex-col relative gap-0 select-none">
        
        {/* ======================================================== */}
        {/* DESKTOP OUTPUT SCREEN LAYOUT (md and above)              */}
        {/* ======================================================== */}
        <div className="hidden md:flex flex-col items-center gap-5 w-full max-w-[1100px] h-full max-h-[690px] overflow-y-auto bg-[#5E5E5E] rounded-[32px] p-5 shadow-inner border border-neutral-600/35 relative pr-1.5 -mr-1.5">
          
          {/* Block 1 — AI Message + Download Bar */}
          <div className="w-full max-w-[1060px] p-[24px_32px] bg-[rgba(24,24,24,0.8)] backdrop-blur-md rounded-[32px] flex flex-col gap-5 items-start justify-center shadow-lg border border-neutral-800/40">
            <p 
              className="text-[20px] font-bold text-white tracking-tight leading-[140%] max-w-[996px]"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.04em' }}
            >
              Certainly! Here is the customized Question Paper for your CBSE classes:
            </p>
            <button 
              onClick={handleDownload}
              className="h-11 px-6 bg-white hover:bg-neutral-100 rounded-full flex items-center gap-1.5 text-[16px] font-semibold text-[#303030] active:scale-95 shadow-md transition-all cursor-pointer"
            >
              <Download size={20} className="text-[#303030]" />
              <span className="tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>Download PDF</span>
            </button>
          </div>

          {/* Block 2 — White Paper Card */}
          <div 
            id="print-paper-sheet"
            className="w-full max-w-[1060px] p-8 bg-[#FFFFFF] rounded-[32px] flex flex-col gap-6 items-center shadow-2xl border border-neutral-100/50"
          >
            <PaperHeader 
              title={assignment?.title || "CBSE Assessment"}
              subject={assignment?.subject || "Science"}
              dueDate={formatDate(assignment?.dueDate?.toString())}
              totalMarks={assignment?.totalMarks || 80}
            />

            {/* Questions lists */}
            <QuestionsList sections={currentPaper.sections} />

            {/* Print endmark */}
            <div className="text-[16px] font-bold text-[#303030] mt-4 select-none print:block">
              End of Question Paper
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MOBILE OUTPUT SCREEN LAYOUT                              */}
        {/* ======================================================== */}
        <div className="flex md:hidden flex-col gap-3 w-full bg-[#FFFFFF] rounded-[40px] p-2 overflow-y-auto max-h-[calc(100vh-100px)] pb-[100px]">
          
          {/* Mobile subheader row */}
          <div className="flex items-center gap-3 h-12 px-3 mt-1">
            <button 
              onClick={() => router.push('/assignments')}
              className="w-[38px] h-[38px] rounded-full bg-neutral-50 flex items-center justify-center text-[#1A1A1A] shadow-[0_1px_4px_rgba(0,0,0,0.05)] active:scale-95 transition-all border border-neutral-200"
              aria-label="Back to Assignments"
            >
              <ChevronLeft size={20} className="stroke-[2.5]" />
            </button>
            <span className="text-base font-semibold text-[#1A1A1A]">Assessment Paper</span>
          </div>

          {/* Block 1 — AI Message Bar (mobile) */}
          <div className="mx-2 p-[24px_16px] bg-[#303030] rounded-[32px] flex items-center justify-between gap-3 shadow-2xl">
            <p 
              className="text-[14px] font-bold text-[#F0F0F0] leading-[17px] tracking-tight flex-1"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Customized Question Paper ready for your CBSE Class:
            </p>
            <button 
              onClick={handleDownload}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform shadow-sm"
              aria-label="Download PDF"
            >
              <Download size={20} className="text-white" />
            </button>
          </div>

          {/* Block 2 — Paper Card (mobile) */}
          <div className="mx-2 p-[24px_16px] bg-[#F6F6F6] rounded-[32px] flex flex-col gap-6 border border-neutral-100/50 shadow-sm">
            <PaperHeader 
              title={assignment?.title || "CBSE Assessment"}
              subject={assignment?.subject || "Science"}
              dueDate={formatDate(assignment?.dueDate?.toString())}
              totalMarks={assignment?.totalMarks || 80}
            />

            {/* Questions lists */}
            <QuestionsList sections={currentPaper.sections} />
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
