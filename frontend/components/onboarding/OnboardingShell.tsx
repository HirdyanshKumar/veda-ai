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
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 4C3 3.44772 3.44772 3 4 3H9.5C9.9122 3 10.2763 3.25248 10.4226 3.6393L12 7.82088L13.5774 3.6393C13.7237 3.25248 14.0878 3 14.5 3H20C20.5523 3 21 3.44772 21 4C21 4.22383 20.925 4.44062 20.7874 4.61718L13.7874 19.6172C13.4831 20.1979 12.8767 20.5524 12.2126 20.5524H11.7874C11.1233 20.5524 10.5169 20.1979 10.2126 19.6172L3.2126 4.61718C3.07502 4.44062 3 4.22383 3 4Z"
                fill="white"
              />
            </svg>
          </div>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A1A', letterSpacing: '-0.03em' }}>
            VedaAI
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
