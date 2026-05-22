'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import { Plus } from 'lucide-react';

import { useRouter } from 'next/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const handleCreateAssignment = () => {
    router.push('/assignments/create');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#EEEEEE] to-[#DADADA] md:p-4 overflow-x-hidden md:overflow-auto font-sans antialiased">
      {/* Responsive Canvas Dashboard (100vw on mobile, 1440px x 780px on desktop) */}
      <div 
        className="w-full md:w-[1440px] h-screen md:h-[780px] relative overflow-hidden flex-shrink-0"
      >
        {/* Sidebar (left: 12px, top: 12px, width: 304px, height: 756px) - Hidden on Mobile */}
        <Sidebar />

        {/* Topbar (adapts to full-width mobile header or desktop layout) */}
        <Topbar />

        {/* Main Content Area (removes desktop offsets and centers on mobile) */}
        <main 
          className="absolute top-[104px] left-1/2 transform -translate-x-1/2 w-[calc(100vw-20px)] h-[calc(100vh-104px)] flex items-center justify-center bg-transparent pb-[120px]
                     md:top-[90px] md:left-[327px] md:w-[1100px] md:h-[678px] md:transform-none md:pb-0 z-10"
        >
          {children}
        </main>

        {/* Floating Action Button (Mobile Only) */}
        <button 
          onClick={handleCreateAssignment}
          className="fixed bottom-[100px] right-[20px] w-12 h-12 rounded-full bg-[#FFFFFF] flex items-center justify-center shadow-[0px_16px_48px_rgba(0,0,0,0.12),0px_32px_48px_rgba(0,0,0,0.2)] md:hidden active:scale-95 transition-all z-50 hover:bg-neutral-50"
          aria-label="Create Assignment"
        >
          <Plus size={20} className="text-[#FF5623] stroke-[3]" />
        </button>

        {/* Bottom Navigation (Mobile Only) */}
        <BottomNav />
      </div>
    </div>
  );
};

export default MainLayout;
