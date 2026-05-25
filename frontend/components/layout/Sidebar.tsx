'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutGrid, 
  Users, 
  FileText, 
  Smartphone, 
  BookOpen, 
  Settings,
  Sparkles 
} from 'lucide-react';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useUser, useAuth } from '@clerk/nextjs';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const assignments = useAssignmentStore((state) => state.assignments);
  const fetchAssignments = useAssignmentStore((state) => state.fetchAssignments);
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  React.useEffect(() => {
    const syncAssignments = async () => {
      const token = await getToken();
      fetchAssignments(token || undefined);
    };
    syncAssignments();
  }, [fetchAssignments, getToken]);

  const completedCount = assignments.filter(a => a.status === 'completed').length;

  const navItems = [
    { label: 'Home', icon: LayoutGrid, href: '/home' },
    { label: 'My Groups', icon: Users, href: '/groups' },
    { label: 'Assignments', icon: FileText, href: '/assignments', badge: assignments.length > 0 ? assignments.length : undefined },
    { label: "AI Teacher's Toolkit", icon: Smartphone, href: '/toolkit' },
    { label: 'My Library', icon: BookOpen, href: '/library', badge: completedCount > 0 ? completedCount : undefined },
  ];

  return (
    <aside 
      className="absolute top-[12px] left-[12px] w-[304px] h-[756px] rounded-[32px] bg-[#FFFFFF] p-6 hidden md:flex flex-col justify-between select-none border border-neutral-100/50 shadow-[0_16px_48px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.01)] print:hidden"
    >
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9800] via-[#FF5722] to-[#E64A19] flex items-center justify-center shadow-md shadow-[#E64A19]/25 select-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M3 4C3 3.44772 3.44772 3 4 3H9.5C9.9122 3 10.2763 3.25248 10.4226 3.6393L12 7.82088L13.5774 3.6393C13.7237 3.25248 14.0878 3 14.5 3H20C20.5523 3 21 3.44772 21 4C21 4.22383 20.925 4.44062 20.7874 4.61718L13.7874 19.6172C13.4831 20.1979 12.8767 20.5524 12.2126 20.5524H11.7874C11.1233 20.5524 10.5169 20.1979 10.2126 19.6172L3.2126 4.61718C3.07502 4.44062 3 4.22383 3 4Z" 
                fill="white"
              />
            </svg>
          </div>
          <span className="text-[22px] font-bold text-[#1A1A1A] tracking-tight font-sans">VedaAI</span>
        </div>

        <Link 
          href="/create"
          className="mt-6 w-full h-12 bg-[#1A1A1A] border-[3px] border-[#E8572A] rounded-full flex items-center justify-center gap-2 text-[#FFFFFF] text-[15px] font-semibold hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-md shadow-black/10 cursor-pointer"
        >
          <Sparkles size={16} className="text-white fill-white/10" />
          <span>Create Assignment</span>
        </Link>

        <nav className="mt-8 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === '/home' && pathname === '/') ||
              (item.href === '/assignments' && (pathname.startsWith('/loading') || pathname.startsWith('/paper'))) ||
              (item.href === '/library' && pathname.startsWith('/library'));
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`h-12 rounded-[14px] px-3.5 flex items-center gap-[12px] text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-[#F3F4F6] text-[#1A1A1A]' 
                    : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#1A1A1A]'
                }`}
              >
                <Icon size={21} className={isActive ? 'text-[#1A1A1A] stroke-[2.2]' : 'text-[#6B7280] stroke-[2]'} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-[#FF5A2B] text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center leading-none min-w-[20px] h-[18px] shadow-sm shadow-[#FF5A2B]/15">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <Link
          href="/settings"
          className="h-12 rounded-[14px] px-3.5 flex items-center gap-[12px] text-sm font-medium text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#1A1A1A] transition-all"
        >
          <Settings size={21} className="text-[#6B7280] stroke-[2]" />
          <span>Settings</span>
        </Link>

        {!isLoaded ? (
          <div className="bg-[#F3F4F6] rounded-[20px] p-3 flex items-center gap-3 border border-neutral-100/50 shadow-sm animate-pulse h-[68px]" />
        ) : (
          <div className="bg-[#F3F4F6] rounded-[20px] p-3 flex items-center gap-3 border border-neutral-100/50 shadow-sm">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E2E8F0] shadow-sm select-none bg-orange-100 flex-shrink-0">
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-neutral-300" />
              )}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-bold text-sm text-[#1A1A1A] truncate leading-snug">
                {user?.organizationMemberships?.[0]?.organization?.name || 
                 (user?.publicMetadata?.school as string) || 
                 user?.emailAddresses[0]?.emailAddress || 
                 "VedaAI Teacher"}
              </span>
              <span className="text-[12px] font-medium text-[#6B7280] truncate leading-tight mt-0.5">
                {(user?.publicMetadata?.location as string) || "Teacher"}
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
