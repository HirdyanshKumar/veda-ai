'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { api } from '../../lib/api';
import { IDashboardStats } from '../../types';
import MainLayout from '../../components/layout/MainLayout';
import WelcomeBanner from '../../components/home/WelcomeBanner';
import StatsRow from '../../components/home/StatsRow';
import RecentAssignments from '../../components/home/RecentAssignments';
import QuickActions from '../../components/home/QuickActions';
import EmptyDashboard from '../../components/home/EmptyDashboard';
import DashboardSkeleton from '../../components/home/DashboardSkeleton';

export default function HomePage() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const data = await api.getDashboardStats(token || undefined);
        if (active) {
          setStats(data);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Failed to load dashboard');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    load();
    return () => { active = false; };
  }, [getToken]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <MainLayout>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: '16px',
          }}
        >
          <div style={{ fontSize: '16px', color: '#6B7280' }}>{error}</div>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#1A1A1A',
              color: '#fff',
              borderRadius: '100px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </MainLayout>
    );
  }

  if (!stats || stats.totalAssignments === 0) {
    return (
      <MainLayout>
        <EmptyDashboard />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          paddingBottom: '32px',
        }}
      >
        <WelcomeBanner user={user} stats={stats} />
        <StatsRow stats={stats} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: '24px',
            alignItems: 'flex-start',
          }}
        >
          <RecentAssignments assignments={stats.recentAssignments} />
          <QuickActions stats={stats} />
        </div>
      </div>
    </MainLayout>
  );
}
