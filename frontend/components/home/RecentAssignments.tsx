import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { IAssignment } from '../../types';
import RecentAssignmentCard from './RecentAssignmentCard';

interface RecentAssignmentsProps {
  assignments: IAssignment[];
}

const RecentAssignments: React.FC<RecentAssignmentsProps> = ({ assignments }) => {
  const router = useRouter();
  const count = assignments.length;

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        flex: 1,
        border: '1px solid #F3F4F6',
        boxShadow: '0px 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#1A1A1A',
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }}
          >
            Recent Assignments
          </div>
          <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '2px' }}>
            {count} assignment{count !== 1 ? 's' : ''}
          </div>
        </div>
        <button
          onClick={() => router.push('/assignments')}
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: '#E8572A',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.textDecoration = 'underline')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.textDecoration = 'none')}
        >
          View all →
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {count === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '24px 0',
              gap: '8px',
            }}
          >
            <FileText size={32} color="#DADADA" />
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#9CA3AF' }}>No assignments yet</span>
          </div>
        ) : (
          assignments.slice(0, 5).map((a) => (
            <RecentAssignmentCard key={a._id} assignment={a} />
          ))
        )}
      </div>
    </div>
  );
};

export default RecentAssignments;
