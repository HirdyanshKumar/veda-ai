import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, BookOpen, Users, ChevronRight } from 'lucide-react';
import { IDashboardStats } from '../../types';

interface QuickActionsProps {
  stats: IDashboardStats;
}

const ActionCard: React.FC<{
  iconBg: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  prominent?: boolean;
}> = ({ iconBg, icon, title, subtitle, onClick, prominent }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '16px',
        border: prominent ? '1.5px solid #1A1A1A' : '1px solid #F3F4F6',
        cursor: 'pointer',
        transition: 'all 200ms',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: hovered ? '0px 4px 16px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A' }}>{title}</div>
        <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{subtitle}</div>
      </div>
      <ChevronRight size={16} color="#DADADA" style={{ flexShrink: 0 }} />
    </div>
  );
};

const QuickActions: React.FC<QuickActionsProps> = ({ stats }) => {
  const router = useRouter();
  const { subjectBreakdown } = stats;
  const maxCount = subjectBreakdown.length > 0 ? Math.max(...subjectBreakdown.map((s) => s.count)) : 1;

  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div
        style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#1A1A1A',
          fontFamily: "'Bricolage Grotesque', sans-serif",
          marginBottom: '4px',
        }}
      >
        Quick Actions
      </div>

      <ActionCard
        iconBg="#1A1A1A"
        icon={<Plus size={22} color="#FFFFFF" />}
        title="Create Assignment"
        subtitle="Generate a new question paper"
        onClick={() => router.push('/create')}
        prominent
      />
      <ActionCard
        iconBg="#FFF7ED"
        icon={<BookOpen size={22} color="#E8572A" />}
        title="View Library"
        subtitle="Browse all generated papers"
        onClick={() => router.push('/library')}
      />
      <ActionCard
        iconBg="#F0FDF4"
        icon={<Users size={22} color="#22C55E" />}
        title="Manage Classes"
        subtitle="View students and join codes"
        onClick={() => router.push('/classes')}
      />

      {subjectBreakdown.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px' }}>
            Top Subjects
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {subjectBreakdown.slice(0, 4).map((item, i) => (
              <div key={item.subject}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#303030' }}>{item.subject}</span>
                  <span
                    style={{
                      background: '#F3F4F6',
                      borderRadius: '100px',
                      padding: '2px 8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#6B7280',
                    }}
                  >
                    {item.count} paper{item.count !== 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ width: '100%', height: '3px', background: '#F3F4F6', borderRadius: '100px', overflow: 'hidden' }}>
                  <div
                    ref={(el) => { barRefs.current[i] = el; }}
                    style={{
                      height: '100%',
                      background: '#E8572A',
                      borderRadius: '100px',
                      width: animated ? `${(item.count / maxCount) * 100}%` : '0%',
                      transition: 'width 600ms ease-out',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
