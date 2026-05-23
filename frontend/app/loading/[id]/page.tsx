'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import ProgressStages from '@/components/loading/ProgressStages';
import FailedState from '@/components/loading/FailedState';
import { Sparkles } from 'lucide-react';

export default function LoadingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { getToken } = useAuth();

  const [currentStage, setCurrentStage] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentStage >= 1 && currentStage < 4 && !isNavigating) {
        e.preventDefault();
        e.returnValue = 'Paper is being generated. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentStage, isNavigating]);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const fetchDetails = async () => {
      try {
        const token = await getToken();
        const assignment = await api.getAssignment(id, token || undefined);
        
        if (!active) return;

        setAssignmentTitle(assignment.title);

        if (assignment.status === 'completed') {
          setCurrentStage(4);
          setIsNavigating(true);
          router.push(`/assignments/${id}`);
          return;
        }

        if (assignment.status === 'failed') {
          setHasError(true);
          setErrorMessage('Generation failed');
          return;
        }

        setCurrentStage(1);
        const t1 = setTimeout(() => {
          if (active) {
            setCurrentStage(2);
          }
        }, 1500);
        timeoutsRef.current.push(t1);

      } catch (err: any) {
        if (active) {
          setHasError(true);
          setErrorMessage(err.message || 'Failed to load assignment details');
        }
      }
    };

    fetchDetails();

    return () => {
      active = false;
    };
  }, [id, getToken, router]);

  useSocket({
    assignmentId: hasError ? undefined : id,
    onReady: (paper) => {
      setCurrentStage(3);

      const t1 = setTimeout(() => {
        setCurrentStage(4);
      }, 800);

      const t2 = setTimeout(() => {
        setIsNavigating(true);
      }, 1400);

      const t3 = setTimeout(() => {
        router.push(`/assignments/${id}`);
      }, 1800);

      timeoutsRef.current.push(t1, t2, t3);
    },
    onFailed: (error) => {
      setHasError(true);
      setErrorMessage(error || 'AI generation failed');
    },
  });

  useEffect(() => {
    if (hasError || currentStage >= 3) return;

    const interval = setInterval(async () => {
      try {
        const token = await getToken();
        const assignment = await api.getAssignment(id, token || undefined);

        if (assignment.status === 'completed' && currentStage < 3) {
          setCurrentStage(3);

          const t1 = setTimeout(() => {
            setCurrentStage(4);
          }, 800);

          const t2 = setTimeout(() => {
            setIsNavigating(true);
          }, 1400);

          const t3 = setTimeout(() => {
            router.push(`/assignments/${id}`);
          }, 1800);

          timeoutsRef.current.push(t1, t2, t3);
        }

        if (assignment.status === 'failed') {
          setHasError(true);
          setErrorMessage('Generation failed. Please try again.');
        }
      } catch (err: any) {
        console.error('Polling error:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id, currentStage, hasError, getToken, router]);

  const handleTryAgain = async () => {
    setHasError(false);
    setCurrentStage(1);
    setErrorMessage('');

    try {
      const token = await getToken();
      await api.regenerateAssignment(id, token || undefined);

      const t1 = setTimeout(() => {
        setCurrentStage(2);
      }, 1500);
      timeoutsRef.current.push(t1);

    } catch (err: any) {
      setHasError(true);
      setErrorMessage(err.message || 'Failed to restart assignment generation');
    }
  };

  const handleBack = () => {
    router.push('/assignments');
  };

  const getStatusText = () => {
    switch (currentStage) {
      case 1:
        return 'Connecting to your assignment...';
      case 2:
        return 'AI is crafting your questions. This takes 10-30 seconds.';
      case 3:
        return 'Almost there! Verifying paper quality...';
      case 4:
        return 'Done! Taking you to your paper...';
      default:
        return 'Initializing generation...';
    }
  };

  const getProgressWidth = () => {
    switch (currentStage) {
      case 1:
        return '25%';
      case 2:
        return '55%';
      case 3:
        return '80%';
      case 4:
        return '100%';
      default:
        return '5%';
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#EEEEEE] to-[#DADADA] p-4 md:p-6 select-none font-sans antialiased">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700&display=swap');
      `}} />

      <div 
        className="w-full max-w-[90vw] md:max-w-[520px] bg-white rounded-[32px] p-6 md:p-12 flex flex-col items-center gap-8 shadow-2xl border border-neutral-100/50"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        <div className="flex flex-col items-center gap-1.5 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9800] via-[#FF5722] to-[#E64A19] flex items-center justify-center shadow-md shadow-[#E64A19]/25 select-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M3 4C3 3.44772 3.44772 3 4 3H9.5C9.9122 3 10.2763 3.25248 10.4226 3.6393L12 7.82088L13.5774 3.6393C13.7237 3.25248 14.0878 3 14.5 3H20C20.5523 3 21 3.44772 21 4C21 4.22383 20.925 4.44062 20.7874 4.61718L13.7874 19.6172C13.4831 20.1979 12.8767 20.5524 12.2126 20.5524H11.7874C11.1233 20.5524 10.5169 20.1979 10.2126 19.6172L3.2126 4.61718C3.07502 4.44062 3 4.22383 3 4Z" 
                  fill="white"
                />
              </svg>
            </div>
            <span className="text-[20px] font-bold text-[#1A1A1A] tracking-tight">VedaAI</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 text-center w-full max-w-[400px]">
          <span className="text-[11px] md:text-[12px] font-bold text-[#9CA3AF] tracking-widest uppercase leading-none">
            Generating paper for:
          </span>
          {assignmentTitle ? (
            <h2 className="text-[18px] md:text-[20px] font-bold text-[#1A1A1A] tracking-tight mt-1 leading-snug truncate w-full">
              {assignmentTitle}
            </h2>
          ) : (
            <div className="h-6 w-[200px] bg-neutral-200 animate-pulse rounded-full mt-1.5" />
          )}
        </div>

        {hasError ? (
          <FailedState
            errorMessage={errorMessage}
            onTryAgain={handleTryAgain}
            onBack={handleBack}
          />
        ) : (
          <>
            <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
              <div 
                className="absolute inset-0 rounded-full border-[3px] border-[#E8572A] opacity-100 flex items-center justify-center animate-[pulse-ring_1.5s_ease-in-out_infinite]"
              />
              <div className="w-12 h-12 md:w-[60px] md:h-[60px] rounded-full bg-[#1A1A1A] flex items-center justify-center shadow-md shadow-[#1A1A1A]/10">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white animate-[pulse-ring_1.5s_ease-in-out_infinite_alternate]" />
              </div>
            </div>

            <ProgressStages currentStage={currentStage} />

            <div className="flex flex-col items-center gap-4 w-full">
              <p className="text-[13px] md:text-[14px] font-normal text-[#6B7280] text-center min-h-[40px] leading-relaxed max-w-[360px] stage-active-animate">
                {getStatusText()}
              </p>

              <div className="w-full h-1 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#1A1A1A] to-[#E8572A] rounded-full transition-all duration-[600ms] ease-in-out"
                  style={{ width: getProgressWidth() }}
                />
              </div>

              <button
                onClick={handleBack}
                className="text-[12px] md:text-[13px] font-medium text-[#9CA3AF] hover:text-[#6B7280] hover:underline cursor-pointer transition-colors mt-2"
              >
                ← Back to assignments
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
