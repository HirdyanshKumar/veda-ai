import React from 'react';

interface OnboardingShellProps {
  children: React.ReactNode;
}

const OnboardingShell: React.FC<OnboardingShellProps> = ({ children }) => {
  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #EEEEEE 0%, #DADADA 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '40px 20px 60px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Bricolage Grotesque', sans-serif",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700&display=swap');` }} />

      <div
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(232,87,42,0.08) 0%, transparent 70%)',
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(26,26,26,0.05) 0%, transparent 70%)',
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '560px', display: 'flex', justifyContent: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              background: '#E8572A',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A1A', letterSpacing: '-0.03em' }}>
            QuestAI
          </span>
        </div>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: '#FFFFFF',
          borderRadius: '32px',
          padding: '40px',
          boxShadow: '0px 32px 64px rgba(0,0,0,0.10), 0px 8px 24px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default OnboardingShell;
