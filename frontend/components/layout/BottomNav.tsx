import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, Calendar, BookOpen, Sparkles } from 'lucide-react';

const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: 'Home', icon: LayoutGrid, href: '/home' },
    { label: 'Assignments', icon: Calendar, href: '/assignments' },
    { label: 'Library', icon: BookOpen, href: '/library' },
    { label: 'AI Toolkit', icon: Sparkles, href: '/toolkit' },
  ];

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 h-[76px] bg-[#1A1A1A] rounded-[28px] flex justify-around items-center px-4 md:hidden z-40 select-none shadow-[0px_12px_32px_rgba(0,0,0,0.25)] border border-neutral-800/10"
    >
      {navItems.map((item) => {
        const isAssignments = item.href === '/assignments';
        const isActive = isAssignments
          ? (pathname === '/assignments' || pathname?.startsWith('/assignments/') || pathname === '/')
          : pathname === item.href;
        const Icon = item.icon;

        return (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            className="flex flex-col items-center gap-[5px] transition-all py-1 px-3 active:scale-95 cursor-pointer"
          >
            <Icon 
              size={22} 
              className={`transition-colors duration-200 ${
                isActive ? 'text-[#FFFFFF] stroke-[2.2]' : 'text-[#6E6E6E] stroke-[2]'
              }`} 
            />
            <span 
              className={`text-[11px] tracking-wide transition-colors duration-200 leading-none ${
                isActive ? 'text-[#FFFFFF] font-semibold' : 'text-[#6E6E6E] font-medium'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
