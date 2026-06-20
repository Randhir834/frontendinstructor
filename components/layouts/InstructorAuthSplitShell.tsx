import type { ReactNode } from 'react';

interface InstructorAuthSplitShellProps {
  leftTitle: ReactNode;
  leftSubtitle: string;
  centered?: boolean;
  children: ReactNode;
}

export default function InstructorAuthSplitShell({ leftTitle, leftSubtitle, centered = true, children }: InstructorAuthSplitShellProps) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen overflow-hidden">
      {/* Mobile-only branding */}
      <div className="md:hidden bg-primary-500 px-6 py-6 text-center flex-shrink-0">
        <img
          src="/images/playfit-logo.jpg"
          alt="PlayFit"
          className="h-10 w-auto mx-auto mb-2"
        />
        <p className="text-sm text-white/90 font-medium">Instructor Portal</p>
      </div>

      {/* Left side - Image and Content (Desktop Only) */}
      <div className="relative w-full md:w-[55%] hidden md:flex flex-col bg-[#C5C5C5] min-h-screen overflow-y-auto">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img 
            src="/images/logininstructureimage.png" 
            alt="Instructor Dashboard" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/20" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-12 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="max-w-xl w-full">
            {/* Title and Subtitle */}
            <div className="mb-8 lg:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-3 lg:mb-4 drop-shadow-2xl">
                {leftTitle}
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-white font-bold drop-shadow-lg leading-relaxed max-w-lg">
                {leftSubtitle}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 max-w-2xl">
              <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3.5 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-primary-100 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </div>
                <span className="text-sm font-semibold text-dark-900 leading-tight">Manage Courses</span>
              </div>
              <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3.5 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-violet-50 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#AB47BC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <span className="text-sm font-semibold text-dark-900 leading-tight">Manage Students</span>
              </div>
              <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3.5 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-orange-50 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFA726" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                </div>
                <span className="text-sm font-semibold text-dark-900 leading-tight">Live Classes</span>
              </div>
              <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3.5 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <span className="text-sm font-semibold text-dark-900 leading-tight">Upload Materials</span>
              </div>
              <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3.5 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <span className="text-sm font-semibold text-dark-900 leading-tight">View Earnings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className={`w-full md:w-[45%] flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 overflow-y-auto bg-white ${centered ? 'justify-center py-8' : 'justify-start pt-8 sm:pt-12 md:pt-16 pb-8'}`}>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
