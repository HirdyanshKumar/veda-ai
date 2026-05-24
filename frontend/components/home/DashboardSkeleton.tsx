import React from 'react';

const shimmer = `
  @keyframes shimmer {
    0% { background-position: -800px 0; }
    100% { background-position: 800px 0; }
  }
  .shimmer {
    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 37%, #f0f0f0 63%);
    background-size: 800px 100%;
    animation: shimmer 1.4s ease infinite;
  }
`;

const SkeletonBox: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <div className={`shimmer rounded-2xl ${className}`} style={style} />
);

const DashboardSkeleton: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        left: '327px',
        top: '78px',
        width: 'calc(100vw - 339px)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        minHeight: 'calc(100vh - 90px)',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: shimmer }} />

      <SkeletonBox style={{ width: '100%', height: '180px', borderRadius: '24px' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[0, 1, 2, 3].map((i) => (
          <SkeletonBox key={i} style={{ height: '140px', borderRadius: '20px' }} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'flex-start' }}>
        <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <SkeletonBox style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <SkeletonBox style={{ height: '14px', width: '60%', borderRadius: '6px' }} />
                <SkeletonBox style={{ height: '12px', width: '40%', borderRadius: '6px' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[0, 1, 2].map((i) => (
            <SkeletonBox key={i} style={{ height: '80px', borderRadius: '20px' }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
