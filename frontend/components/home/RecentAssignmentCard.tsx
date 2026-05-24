import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, Clock, AlertCircle } from 'lucide-react';
import { IAssignment } from '../../types';
import { formatRelativeTime } from '../../lib/utils';

interface RecentAssignmentCardProps {
  assignment: IAssignment;
}

const statusConfig = {
  completed: {
    bg: '#F0FDF4',
    icon: CheckCircle2,
    iconColor: '#22C55E',
    badgeBg: '#F0FDF4',
    badgeText: '#22C55E',
    label: 'Completed',
    spin: false,
  },
  processing: {
    bg: '#FFF7ED',
    icon: Loader2,
    iconColor: '#E8572A',
    badgeBg: '#FFF7ED',
    badgeText: '#E8572A',
    label: 'Generating',
    spin: true,
  },
  pending: {
    bg: '#F9FAFB',
    icon: Clock,
    iconColor: '#9CA3AF',
    badgeBg: '#F9FAFB',
    badgeText: '#9CA3AF',
    label: 'Pending',
    spin: false,
  },
  failed: {
    bg: '#FEF2F2',
    icon: AlertCircle,
    iconColor: '#EF4444',
    badgeBg: '#FEF2F2',
    badgeText: '#EF4444',
    label: 'Failed',
    spin: false,
  },
};

const RecentAssignmentCard: React.FC<RecentAssignmentCardProps> = ({ assignment }) => {
  const router = useRouter();
  const config = statusConfig[assignment.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  const handleClick = () => {
    if (assignment.status === 'completed') {
      router.push(`/paper/${assignment._id}`);
    } else {
      router.push('/assignments');
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '16px',
        background: '#FAFAFA',
        border: '1px solid #F3F4F6',
        cursor: 'pointer',
        transition: 'background 150ms, border-color 150ms',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = '#F3F4F6';
        (e.currentTarget as HTMLDivElement).style.borderColor = '#E5E7EB';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = '#FAFAFA';
        (e.currentTarget as HTMLDivElement).style.borderColor = '#F3F4F6';
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: config.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <StatusIcon
          size={20}
          color={config.iconColor}
          style={config.spin ? { animation: 'spin 1s linear infinite' } : undefined}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#1A1A1A',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '260px',
          }}
        >
          {assignment.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
          <span
            style={{
              background: '#F3F4F6',
              borderRadius: '100px',
              padding: '2px 8px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#6B7280',
            }}
          >
            {assignment.subject}
          </span>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
            {formatRelativeTime(assignment.createdAt)}
          </span>
        </div>
      </div>

      <span
        style={{
          borderRadius: '100px',
          padding: '4px 10px',
          fontSize: '12px',
          fontWeight: 600,
          background: config.badgeBg,
          color: config.badgeText,
          fontFamily: "'Bricolage Grotesque', sans-serif",
          flexShrink: 0,
        }}
      >
        {config.label}
      </span>
    </div>
  );
};

export default RecentAssignmentCard;
