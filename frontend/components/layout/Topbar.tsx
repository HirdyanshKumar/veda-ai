'use client';

import React from 'react';
import { ChevronLeft, LayoutGrid, Bell, ChevronDown, Menu } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';

const Topbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const isOutputPage = pathname?.startsWith('/assignments/') && pathname !== '/assignments/create' && pathname !== '/assignments';
  return (
    <header 
      className="absolute top-[16px] left-4 right-4 h-[76px] bg-white rounded-[28px] shadow-[0px_8px_30px_rgba(0,0,0,0.06)] border border-white/40 flex items-center justify-between select-none px-[18px] z-30
                 md:absolute md:top-[12px] md:left-[327px] md:right-auto md:w-[1100px] md:h-14 md:bg-[rgba(255,255,255,0.75)] md:backdrop-blur-[12px] md:pl-6 md:pr-3 md:rounded-[16px] md:border md:border-[rgba(255,255,255,0.2)] md:shadow-sm md:px-0 print:hidden"
    >
      <div className="flex md:hidden items-center gap-3">
        <div className="select-none flex items-center justify-center shadow-md shadow-black/5 rounded-[10px] overflow-hidden">
          <svg width="42" height="42" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="7" fill="#303030"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M15.9089 19.8507C15.9089 19.8507 16.4181 21.2101 16.8848 21.2952H10.9878C9.79981 21.2952 8.73946 20.6155 8.39977 19.3409L4.96347 9.14449C4.96347 9.14449 4.66663 7.9124 4.19995 7.70001H10.2243C11.4122 7.74255 12.2183 8.16732 12.685 9.73942L15.9089 19.8507Z" fill="white"/>
            <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M15.9089 19.8507C15.9089 19.8507 16.4181 21.2101 16.8848 21.2952H10.9878C9.79981 21.2952 8.73946 20.6155 8.39977 19.3409L4.96347 9.14449C4.96347 9.14449 4.66663 7.9124 4.19995 7.70001H10.2243C11.4122 7.74255 12.2183 8.16732 12.685 9.73942L15.9089 19.8507Z" fill="url(#paint0_linear_19_382)"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M12.1335 19.8509C12.1335 19.8509 11.6243 21.2103 11.1576 21.2954H17.0546C18.2426 21.2954 19.3029 20.6157 19.6426 19.3411L23.0367 9.14497C23.0367 9.14497 23.3335 7.91289 23.8002 7.7005H17.8181C16.6301 7.7005 15.8666 8.12527 15.3999 9.69737L12.1335 19.8509Z" fill="white"/>
            <defs>
              <linearGradient id="paint0_linear_19_382" x1="10.5424" y1="6.54428" x2="10.5424" y2="22.4936" gradientUnits="userSpaceOnUse">
                <stop stopColor="white" stopOpacity="0"/>
                <stop offset="0.33" stopColor="white" stopOpacity="0"/>
                <stop offset="0.76" stopColor="#0E1513"/>
                <stop offset="1" stopColor="#0E1513"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="text-[22px] font-bold text-[#1A1A1A] tracking-tight font-sans">VedaAI</span>
      </div>
 
      <div className="flex md:hidden items-center gap-3">
        <button 
          className="relative w-11 h-11 rounded-full flex items-center justify-center bg-[#F2F2F3] text-[#1A1A1A] hover:bg-[#E4E4E7] active:scale-95 transition-all duration-200"
          aria-label="Notifications"
        >
          <Bell size={21} className="text-[#1A1A1A] stroke-[2.2]" />
          <span className="absolute top-[2px] right-[2px] w-[10px] h-[10px] bg-[#FF4D2D] rounded-full border-[2px] border-white"></span>
        </button>
 
        <div className="w-11 h-11 rounded-full flex items-center justify-center select-none">
          {!isLoaded ? (
            <div className="w-11 h-11 rounded-full bg-neutral-200 animate-pulse" />
          ) : (
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-11 h-11",
                  userButtonPopoverCard: "rounded-[16px]"
                }
              }}
            />
          )}
        </div>
 
        <button 
          className="w-11 h-11 flex flex-col items-center justify-center gap-[5px] text-[#1A1A1A] hover:bg-neutral-100 rounded-full transition-colors active:scale-95"
          aria-label="Toggle menu"
        >
          <span className="w-6 h-[2.5px] bg-[#1A1A1A] rounded-full transition-all"></span>
          <span className="w-6 h-[2.5px] bg-[#1A1A1A] rounded-full transition-all"></span>
          <span className="w-6 h-[2.5px] bg-[#1A1A1A] rounded-full transition-all"></span>
        </button>
      </div>
 
      <div className="hidden md:flex items-center">
        {isOutputPage ? (
          <button 
            onClick={() => router.push('/assignments/create')}
            className="flex items-center gap-1 text-[15px] font-semibold text-[#9CA3AF] hover:text-[#1A1A1A] transition-colors"
          >
            <ChevronLeft size={20} className="text-[#9CA3AF]" />
            <span>✦ Create New</span>
          </button>
        ) : (
          <>
            <button 
              onClick={() => router.back()}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1A1A1A] transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft size={20} />
            </button>
 
            <div className="w-[1px] h-4 bg-[#E5E7EB] mx-2"></div>
 
            <LayoutGrid size={20} className="text-[#6B7280] ml-1" />
 
            <span className="text-[15px] font-medium text-[#6B7280] ml-2">
              Assignment
            </span>
          </>
        )}
      </div>
 
      <div className="hidden md:flex items-center gap-4">
        <button 
          className="relative w-8 h-8 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1A1A1A] transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {/* 8px red circle at top-right */}
          <span className="absolute top-[6px] right-[6px] w-[8px] h-[8px] bg-[#EF4444] rounded-full border border-white"></span>
        </button>
 
        <div className="w-[1px] h-6 bg-[#E5E7EB]"></div>
 
        {!isLoaded ? (
          <div className="w-[120px] h-8 bg-neutral-200 animate-pulse rounded-full" />
        ) : (
          <div className="flex items-center gap-2 hover:bg-[#F3F4F6] p-1.5 rounded-lg transition-colors active:scale-[0.98]">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonPopoverCard: "rounded-[16px]",
                  userButtonPopoverActionButton: "font-sans font-medium"
                }
              }}
            />
            <span className="text-sm font-medium text-[#1A1A1A]">
              {user?.fullName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.emailAddresses[0]?.emailAddress)}
            </span>
            <ChevronDown size={16} className="text-[#6B7280]" />
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
