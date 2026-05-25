'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import { Plus } from 'lucide-react';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useAssignmentStore } from '@/store/assignmentStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();
  const resetStore = useAssignmentStore((state) => state.resetStore);
  
  const isOutputPage = pathname?.startsWith('/assignments/') && pathname !== '/assignments/create' && pathname !== '/assignments';

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      resetStore();
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, resetStore, router]);

  const handleCreateAssignment = () => {
    router.push('/assignments/create');
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#EEEEEE] to-[#DADADA] font-sans antialiased">
        <div className="bg-white rounded-3xl p-10 max-w-[320px] w-full text-center flex flex-col items-center gap-4 shadow-xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-full border-4 border-neutral-100 border-t-[#FF5623] animate-spin" />
          <h3 className="text-[18px] font-bold text-[#303030]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Loading VedaAI...
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#EEEEEE] to-[#DADADA] md:p-4 overflow-x-hidden md:overflow-auto font-sans antialiased print:bg-white print:p-0 print:min-h-0 print:h-auto print:block">
      {/* Responsive Canvas Dashboard (100vw on mobile, 1440px x 780px on desktop) */}
      <div 
        className="w-full md:w-[1440px] h-screen md:h-[780px] relative overflow-hidden flex-shrink-0 print:h-auto print:w-full print:overflow-visible print:block"
      >
        {/* Sidebar (left: 12px, top: 12px, width: 304px, height: 756px) - Hidden on Mobile */}
        <Sidebar />

        {/* Topbar (adapts to full-width mobile header or desktop layout) */}
        <Topbar />

        {/* Main Content Area (removes desktop offsets and centers on mobile) */}
         <main 
          className={`absolute top-[104px] left-1/2 transform -translate-x-1/2 w-[calc(100vw-20px)] h-[calc(100vh-104px)] flex items-center justify-center bg-transparent ${isOutputPage ? 'pb-4' : 'pb-[120px]'}
                     md:top-[90px] md:left-[327px] md:transform-none md:pb-0 z-10
                     ${(pathname === '/home' || pathname === '/library' || pathname === '/classes')
                       ? 'md:w-[calc(100vw-339px)] md:h-[calc(100vh-90px)] overflow-y-auto'
                       : 'md:w-[1100px] md:h-[678px] overflow-hidden'}
                     print:static print:w-full print:h-auto print:block print:transform-none print:p-0 print:m-0`}
          style={pathname === '/home' || pathname === '/library' || pathname === '/classes' ? { padding: '24px' } : undefined}
        >
          {children}
        </main>

        {/* Floating Action Button (Mobile Only) */}
        {!isOutputPage && (
          <button 
            onClick={handleCreateAssignment}
            className="fixed bottom-[100px] right-[20px] w-12 h-12 rounded-full bg-[#FFFFFF] flex items-center justify-center shadow-[0px_16px_48px_rgba(0,0,0,0.12),0px_32px_48px_rgba(0,0,0,0.2)] md:hidden active:scale-95 transition-all z-50 hover:bg-neutral-50 print:hidden"
            aria-label="Create Assignment"
          >
            <Plus size={20} className="text-[#FF5623] stroke-[3]" />
          </button>
        )}

        {/* Bottom Navigation (Mobile Only) */}
        {!isOutputPage && <BottomNav />}
      </div>
    </div>
  );
};

export default MainLayout;
