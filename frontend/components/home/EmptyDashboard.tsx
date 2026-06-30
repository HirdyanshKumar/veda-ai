import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Sparkles, Download } from 'lucide-react';

const EmptyDashboard: React.FC = () => {
  const router = useRouter();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '32px',
      }}
    >
      <div
        style={{
          width: '280px',
          height: '200px',
          background: '#FFFFFF',
          borderRadius: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 8px 32px rgba(0,0,0,0.06)',
          position: 'relative',
        }}
      >
        <div style={{ position: 'relative', width: '180px', height: '120px' }}>
          <div
            style={{
              width: '180px',
              height: '120px',
              background: '#F3F4F6',
              borderRadius: '16px',
              position: 'absolute',
              transform: 'rotate(-6deg)',
            }}
          />
          <div
            style={{
              width: '180px',
              height: '120px',
              background: '#E5E7EB',
              borderRadius: '16px',
              position: 'absolute',
              transform: 'rotate(-3deg)',
            }}
          />
          <div
            style={{
              width: '180px',
              height: '120px',
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #E5E7EB',
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '16px',
            }}
          >
            <div style={{ height: '8px', borderRadius: '4px', background: '#F3F4F6', width: '80%' }} />
            <div style={{ height: '8px', borderRadius: '4px', background: '#F3F4F6', width: '65%' }} />
            <div style={{ height: '8px', borderRadius: '4px', background: '#F3F4F6', width: '45%' }} />
          </div>
        </div>

        <div
          style={{
            width: '36px',
            height: '36px',
            background: '#E8572A',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '24px',
            right: '36px',
          }}
        >
          <Sparkles size={18} color="#FFFFFF" />
        </div>
      </div>

      <div style={{ textAlign: 'center', maxWidth: '360px' }}>
        <div
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#1A1A1A',
            fontFamily: "'Bricolage Grotesque', sans-serif",
            marginBottom: '8px',
          }}
        >
          Welcome to QuestAI!
        </div>
        <div style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.6 }}>
          Create your first AI-powered question paper in minutes. No more manual paper setting.
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        {[
          { num: '1', icon: <Plus size={24} color="#9CA3AF" />, label: 'Create Assignment' },
          { num: null, arrow: true },
          { num: '2', icon: <Sparkles size={24} color="#9CA3AF" />, label: 'AI Generates' },
          { num: null, arrow: true },
          { num: '3', icon: <Download size={24} color="#9CA3AF" />, label: 'Download PDF' },
        ].map((step, i) => {
          if (step.arrow) {
            return (
              <span key={i} style={{ fontSize: '20px', color: '#DADADA', alignSelf: 'center', marginTop: '-8px' }}>
                →
              </span>
            );
          }
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                {step.num}
              </div>
              {step.icon}
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280' }}>{step.label}</span>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => router.push('/create')}
        style={{
          background: '#1A1A1A',
          color: '#FFFFFF',
          borderRadius: '100px',
          padding: '16px 40px',
          fontSize: '16px',
          fontWeight: 600,
          fontFamily: "'Bricolage Grotesque', sans-serif",
          border: '2px solid #E8572A',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          transition: 'background 200ms',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '#333')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '#1A1A1A')}
      >
        ✦ Create Your First Assignment
      </button>
    </div>
  );
};

export default EmptyDashboard;
