'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  User,
  Menu, X, GraduationCap, LogOut, Sparkles
} from 'lucide-react';
import { userService, UserProfile } from '@/services/userService';
import GlobalSearch from '@/components/GlobalSearch';
import { getAvatarUrlWithCacheBust } from '@/utils/avatarUtils';
import PageTransition from '@/components/PageTransition';

const menuItems = [
  { icon: BookOpen, label: 'My Courses', href: '/instructor/courses', gradient: 'from-blue-500 to-cyan-500' },
  { icon: GraduationCap, label: 'Students', href: '/instructor/students', gradient: 'from-pink-500 to-rose-500' },
  { icon: User, label: 'My Profile', href: '/instructor/profile', gradient: 'from-teal-500 to-cyan-500' },
];

interface InstructorDashboardLayoutProps {
  children: React.ReactNode;
}

export default function InstructorDashboardLayout({ children }: InstructorDashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // Check if token exists before fetching profile
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No authentication token found');
        setUserLoading(false);
        router.push('/login');
        return;
      }

      try {
        const profile = await userService.getProfile();
        setUser(profile);
      } catch (err: any) {
        console.error('Failed to fetch profile:', err);
        
        // Handle authentication errors
        if (err.response?.status === 401 || err.response?.status === 404) {
          console.warn('Authentication failed, redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
        }
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();

    // Listen for profile photo updates
    const handleProfilePhotoUpdate = (event: any) => {
      if (event.detail?.user) {
        setUser(event.detail.user);
      }
    };

    window.addEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
    
    return () => {
      window.removeEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
    };
  }, [router]);


  const displayName = user?.name || 'Instructor';
  const avatarUrl = getAvatarUrlWithCacheBust(user?.avatar_url, displayName);

  const handleLogout = () => {
    userService.logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Left Sidebar — Modernized */}
      <aside
        className={`bg-white/90 backdrop-blur-xl border-r border-gray-200 flex flex-col z-50 shadow-xl
          fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:flex
          w-72 lg:w-64
        `}
      >
        {/* Logo with gradient background */}
        <div className="relative border-b border-gray-200 lg:border-none flex items-center justify-center px-4 py-6 shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 lg:bg-none">
          <div className="relative flex items-center justify-center shrink-0 transition-all duration-300 w-full h-14 sm:h-16 lg:h-20">
            <img
              src="/logo.jpg"
              alt="PlayFit"
              className="w-full h-full object-contain max-w-full max-h-full filter lg:filter-none brightness-0 invert lg:brightness-100 lg:invert-0"
            />
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-4 lg:hidden p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-3 py-4">
          {/* Welcome Badge */}
          <div className="mb-4 px-3 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
              <Sparkles className="w-4 h-4" />
              <span>Welcome Instructor!</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {menuItems.map((item, index) => {
              const isActive = item.href === '/instructor'
                ? pathname === '/instructor'
                : pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } ${isActive ? item.gradient : ''}`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl"></div>
                  )}
                  <div className={`relative ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                    <item.icon size={20} className="shrink-0" />
                  </div>
                  <span className="relative truncate">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Image Section */}
          <div className="mt-6 px-2">
            <div className="relative rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-shadow">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-colors"></div>
              <img
                src="/images/navvbarbottomimage.png"
                alt="Instructor Success"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 lg:h-screen lg:overflow-y-auto no-scrollbar">
        {/* Top Header - Modernized */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-600 hover:text-blue-600 transition-all"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
              <div className="hidden lg:block w-4" />
              {/* Global Search */}
              <GlobalSearch className="flex-1 max-w-4xl" />
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Profile Display */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                {userLoading ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"></div>
                ) : (
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur transition-opacity"></div>
                    <img
                      key={user?.avatar_url || 'default'}
                      src={avatarUrl}
                      alt={displayName}
                      className="relative w-10 h-10 rounded-full object-cover ring-2 ring-white"
                    />
                  </div>
                )}
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{displayName}</p>
                  <p className="text-xs text-gray-500">Instructor</p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="sm:hidden p-2.5 rounded-xl border border-red-200 bg-white text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-white text-red-500 text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-all hover:scale-105"
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content with Transition */}
        <main className="flex-1 relative">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
