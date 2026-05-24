import React from 'react';
import { FileText, Sparkles, BookOpen, TrendingUp } from 'lucide-react';
import { IDashboardStats } from '../../types';
import StatCard from './StatCard';

interface StatsRowProps {
  stats: IDashboardStats;
}

const StatsRow: React.FC<StatsRowProps> = ({ stats }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        width: '100%',
      }}
    >
      <StatCard
        icon={FileText}
        iconBg="#EFF6FF"
        iconColor="#3B82F6"
        label="Total Assignments"
        value={stats.totalAssignments}
        sublabel="All time"
        trend={null}
      />
      <StatCard
        icon={Sparkles}
        iconBg="#FFF7ED"
        iconColor="#E8572A"
        label="Papers Generated"
        value={stats.totalPapers}
        sublabel="Completed"
        trend={null}
      />
      <StatCard
        icon={BookOpen}
        iconBg="#F0FDF4"
        iconColor="#22C55E"
        label="Subjects Covered"
        value={stats.totalSubjects}
        sublabel="Unique subjects"
        trend={null}
      />
      <StatCard
        icon={TrendingUp}
        iconBg="#FAF5FF"
        iconColor="#A855F7"
        label="This Week"
        value={stats.assignmentsThisWeek}
        sublabel="New assignments"
        trend={stats.assignmentsThisWeek > 0 ? 'up' : null}
      />
    </div>
  );
};

export default StatsRow;
