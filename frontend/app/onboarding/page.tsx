'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useAuth, useSession } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api';
import OnboardingShell from '../../components/onboarding/OnboardingShell';
import RoleCard from '../../components/onboarding/RoleCard';
import SchoolForm from '../../components/onboarding/SchoolForm';

type Step = 1 | 2;

const ProgressDots: React.FC<{ currentStep: Step; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
    {Array.from({ length: totalSteps }, (_, i) => {
      const step = i + 1;
      const isActive = currentStep === step;
      const isCompleted = currentStep > step;
      return (
        <div
          key={step}
          style={{
            height: '8px',
            width: isActive ? '24px' : '8px',
            borderRadius: isActive ? '100px' : '50%',
            background: isActive || isCompleted ? '#1A1A1A' : '#DADADA',
            opacity: isCompleted ? 0.4 : 1,
            transition: 'width 300ms ease, opacity 200ms',
          }}
        />
      );
    })}
  </div>
);

const StepHeader: React.FC<{ step: string; title: string; subtitle: string }> = ({ step, title, subtitle }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
    <span
      style={{
        fontSize: '11px',
        fontWeight: 700,
        color: '#E8572A',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        background: 'rgba(232,87,42,0.08)',
        borderRadius: '100px',
        padding: '4px 10px',
        display: 'inline-flex',
      }}
    >
      Step {step}
    </span>
    <div
      style={{
        fontSize: '28px',
        fontWeight: 700,
        color: '#1A1A1A',
        fontFamily: "'Bricolage Grotesque', sans-serif",
        letterSpacing: '-0.04em',
        lineHeight: 1.2,
      }}
    >
      {title}
    </div>
    <div style={{ fontSize: '15px', fontWeight: 400, color: '#6B7280', lineHeight: 1.5 }}>
      {subtitle}
    </div>
  </div>
);

const ErrorText: React.FC<{ message: string }> = ({ message }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 14px',
      background: '#FEF2F2',
      borderRadius: '10px',
      border: '1px solid #FECACA',
      animation: 'fadeSlideIn 200ms ease forwards',
    }}
  >
    <style dangerouslySetInnerHTML={{ __html: `@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }` }} />
    <AlertCircle size={14} color="#EF4444" />
    <span style={{ fontSize: '13px', fontWeight: 500, color: '#EF4444' }}>{message}</span>
  </div>
);

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { session } = useSession();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedRole, setSelectedRole] = useState<'teacher' | null>(null);
  const [school, setSchool] = useState('');
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSuccess) return; // Don't redirect mid-success flow
    if ((user?.publicMetadata as any)?.onboarded === true) {
      window.location.href = '/home';
    }
  }, [isLoaded, user, router, isSuccess]);

  const goToStep2 = () => {
    if (!selectedRole) {
      setError('Please select your role to continue.');
      return;
    }
    setError(null);
    setCurrentStep(2);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const token = await getToken();
      await api.onboardUser(
        { role: selectedRole!, school, location, subject },
        token || undefined
      );
      // Reload both user object and session JWT so middleware sees onboarded: true
      await user?.reload();
      await session?.reload();
      setIsSuccess(true);
      // Use full page navigation (not router.replace) so the browser sends
      // the updated Clerk session token and middleware passes the onboarded check
      setTimeout(() => {
        window.location.href = '/home';
      }, 900);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };


  if (!isLoaded) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #EEEEEE 0%, #DADADA 100%)' }}>
        <Loader2 size={32} color="#E8572A" style={{ animation: 'spin 1s linear infinite' }} />
        <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }` }} />
      </div>
    );
  }

  return (
    <OnboardingShell>
      <ProgressDots currentStep={currentStep} totalSteps={2} />

      {currentStep === 1 && (
        <>
          <StepHeader
            step="01"
            title="What's your role?"
            subtitle="This helps us personalize your QuestAI experience"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <RoleCard
              role="teacher"
              title="I'm a Teacher"
              description="Create AI-powered question papers, manage classes, and track student performance"
              isSelected={selectedRole === 'teacher'}
              isDisabled={false}
              onClick={() => { setSelectedRole('teacher'); setError(null); }}
            />
            <RoleCard
              role="student"
              title="I'm a Student"
              description="View assignments, submit answers, and track your progress"
              isSelected={false}
              isDisabled={true}
              onClick={() => {}}
            />
          </div>

          {error && <ErrorText message={error} />}

          <button
            onClick={goToStep2}
            disabled={!selectedRole}
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '100px',
              border: 'none',
              background: selectedRole ? '#1A1A1A' : '#F3F4F6',
              color: selectedRole ? '#FFFFFF' : '#9CA3AF',
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              cursor: selectedRole ? 'pointer' : 'not-allowed',
              transition: 'all 200ms',
            }}
          >
            Continue →
          </button>
        </>
      )}

      {currentStep === 2 && (
        <>
          <StepHeader
            step="02"
            title="Tell us about your school"
            subtitle="Optional — helps personalize your question papers"
          />

          <SchoolForm
            school={school}
            location={location}
            subject={subject}
            onSchoolChange={setSchool}
            onLocationChange={setLocation}
            onSubjectChange={setSubject}
          />

          {error && <ErrorText message={error} />}

          {isSuccess ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '16px',
                background: '#F0FDF4',
                borderRadius: '16px',
                animation: 'scaleIn 200ms ease forwards',
              }}
            >
              <style dangerouslySetInnerHTML={{ __html: `@keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }` }} />
              <CheckCircle2 size={24} color="#22C55E" />
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                All set! Taking you to your dashboard...
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', width: '100%' }}>
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  height: '52px',
                  width: '100px',
                  flexShrink: 0,
                  background: '#FFFFFF',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#6B7280',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}
              >
                <ChevronLeft size={20} color="#6B7280" />
                Back
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  height: '52px',
                  flex: 1,
                  borderRadius: '100px',
                  border: isSubmitting ? 'none' : '2px solid #E8572A',
                  background: '#1A1A1A',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.8 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 200ms',
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} color="#FFFFFF" style={{ animation: 'spin 1s linear infinite' }} />
                    Setting up your account...
                  </>
                ) : (
                  'Get Started →'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </OnboardingShell>
  );
}
