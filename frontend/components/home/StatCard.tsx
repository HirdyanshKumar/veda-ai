import React, { useEffect, useState, useRef } from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number;
  sublabel: string;
  trend: 'up' | 'down' | null;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  sublabel,
  trend,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === 0) {
      setDisplayValue(0);
      return;
    }
    const duration = 800;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0px 1px 4px rgba(0,0,0,0.06)',
        border: '1px solid #F3F4F6',
        transition: 'transform 200ms, box-shadow 200ms',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0px 8px 24px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0px 1px 4px rgba(0,0,0,0.06)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={22} color={iconColor} />
        </div>

        {trend === 'up' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: '#F0FDF4', borderRadius: '100px', padding: '4px 8px' }}>
            <ArrowUpRight size={14} color="#22C55E" />
          </div>
        )}
        {trend === 'down' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: '#FEF2F2', borderRadius: '100px', padding: '4px 8px' }}>
            <ArrowDownRight size={14} color="#EF4444" />
          </div>
        )}
      </div>

      <div>
        <div
          style={{
            fontSize: '36px',
            fontWeight: 700,
            color: '#1A1A1A',
            fontFamily: "'Bricolage Grotesque', sans-serif",
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          {displayValue}
        </div>
        <div style={{ fontSize: '14px', fontWeight: 500, color: '#6B7280', marginTop: '4px' }}>{label}</div>
        <div style={{ fontSize: '12px', fontWeight: 400, color: '#9CA3AF', marginTop: '2px' }}>{sublabel}</div>
      </div>
    </div>
  );
};

export default StatCard;
