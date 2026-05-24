import React from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, TrendingUp } from 'lucide-react';
import { IDashboardStats } from '../../types';

interface ClerkUser {
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
}

interface WelcomeBannerProps {
  user: ClerkUser | null | undefined;
  stats: IDashboardStats;
}


const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ user, stats }) => {
  const router = useRouter();
  const greeting = getGreeting();
  const firstName = user?.firstName || user?.fullName?.split(' ')[0] || '';
  const lastName = user?.lastName || '';
  const fullName = firstName ? `${firstName} ${lastName}`.trim() : user?.fullName || '';

  return (
    <div
      style={{
        width: '100%',
        background: '#1A1A1A',
        borderRadius: '24px',
        padding: '32px 40px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '300px',
          height: '300px',
          background: 'rgba(232,87,42,0.15)',
          borderRadius: '50%',
          position: 'absolute',
          right: '-60px',
          top: '-80px',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          width: '200px',
          height: '200px',
          background: 'rgba(232,87,42,0.08)',
          borderRadius: '50%',
          position: 'absolute',
          right: '200px',
          bottom: '-60px',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.6)',
            fontFamily: "'Bricolage Grotesque', sans-serif",
            marginBottom: '4px',
          }}
        >
          {greeting},
        </div>

        {fullName ? (
          <div
            style={{
              fontSize: '36px',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: "'Bricolage Grotesque', sans-serif",
              letterSpacing: '-0.04em',
              lineHeight: 1.2,
            }}
          >
            {fullName}
          </div>
        ) : (
          <div style={{ width: '200px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '4px' }} />
        )}

        <div
          style={{
            fontSize: '14px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.5)',
            marginTop: '8px',
            maxWidth: '400px',
          }}
        >
          {stats.assignmentsThisWeek > 0
            ? `You've created ${stats.assignmentsThisWeek} assignment${stats.assignmentsThisWeek !== 1 ? 's' : ''} this week. Keep it up!`
            : "Ready to create your next assignment?"}
        </div>

        <button
          onClick={() => router.push('/create')}
          style={{
            marginTop: '24px',
            background: '#E8572A',
            color: '#FFFFFF',
            borderRadius: '100px',
            padding: '12px 28px',
            fontSize: '15px',
            fontWeight: 600,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0px 4px 16px rgba(232,87,42,0.4)',
            transition: 'background 200ms',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '#D4481E')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '#E8572A')}
        >
          ✦ Create Assignment
        </button>
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '12px' }}>
        {[
          { icon: BookOpen, value: stats.totalPapers, label: 'Papers Generated' },
          { icon: TrendingUp, value: stats.assignmentsThisWeek, label: 'This Week' },
        ].map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '16px',
              padding: '16px 20px',
              backdropFilter: 'blur(10px)',
              minWidth: '140px',
            }}
          >
            <Icon size={20} color="#E8572A" />
            <div
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#FFFFFF',
                marginTop: '8px',
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeBanner;
