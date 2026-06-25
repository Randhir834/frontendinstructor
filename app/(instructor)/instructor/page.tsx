'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen, Users, Video, Clock, ChevronRight, Zap, Target, GraduationCap
} from 'lucide-react';
import { dashboardService, DashboardData } from '@/services/dashboardService';
import { userService, UserProfile } from '@/services/userService';
import UpcomingLiveClasses from '@/components/UpcomingLiveClasses';

export default function InstructorHomePage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [dashData, profile] = await Promise.all([
          dashboardService.getDashboardData(),
          userService.getProfile().catch(() => null)
        ]);
        setDashboardData(dashData);
        setUser(profile);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();

    // Auto-refresh dashboard data every 60 seconds
    const interval = setInterval(() => {
      fetchAll();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] sm:min-h-[70vh] p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😕</span>
          </div>
          <p className="text-base text-red-600 mb-4 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-105 shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || { 
    coursesTeaching: 0, 
    totalStudents: 0, 
    upcomingClasses: 0, 
    totalHours: 0 
  };
  const courses = dashboardData?.courses || [];

  const displayName = user?.name || 'Instructor';

  return (
    <div className="flex flex-col xl:flex-row">
      {/* Center Content */}
      <main className="flex-1 p-4 sm:p-5 md:p-6 lg:p-8 min-w-0 max-w-[1600px] mx-auto w-full">
          {/* Welcome Message - Enhanced */}
          <div className="mb-6 sm:mb-8 md:mb-10 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-3xl blur-3xl opacity-30 -z-10"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-7 md:p-8 border border-gray-200 shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-gray-600">Welcome back,</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent break-words mb-3">
                    {displayName}! 👋
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
                    Your students are counting on you. Let&apos;s make today amazing! 🎓
                  </p>
                </div>
                <div className="hidden sm:block">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl transform rotate-6 hover:rotate-12 transition-transform">
                    <GraduationCap className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards - Fully Responsive Grid with Gradients */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8 md:mb-10">
            {[
              { 
                label: 'Courses Teaching', 
                value: String(stats.coursesTeaching), 
                icon: BookOpen, 
                gradient: 'from-blue-500 to-cyan-500',
                bgGradient: 'from-blue-50 to-cyan-50',
                shadowColor: 'shadow-blue-500/20'
              },
              { 
                label: 'Total Students', 
                value: String(stats.totalStudents), 
                icon: Users, 
                gradient: 'from-green-500 to-emerald-500',
                bgGradient: 'from-green-50 to-emerald-50',
                shadowColor: 'shadow-green-500/20'
              },
              { 
                label: 'Upcoming Classes', 
                value: String(stats.upcomingClasses), 
                icon: Video, 
                gradient: 'from-purple-500 to-pink-500',
                bgGradient: 'from-purple-50 to-pink-50',
                shadowColor: 'shadow-purple-500/20'
              },
              { 
                label: 'Total Hours', 
                value: String(stats.totalHours), 
                icon: Clock, 
                gradient: 'from-orange-500 to-red-500',
                bgGradient: 'from-orange-50 to-red-50',
                shadowColor: 'shadow-orange-500/20'
              },
            ].map((card, index) => (
              <div 
                key={index} 
                className={`group relative bg-gradient-to-br ${card.bgGradient} rounded-2xl border border-white shadow-lg hover:shadow-2xl ${card.shadowColor} transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative p-4 sm:p-5 md:p-6">
                  <div className="flex flex-col gap-3">
                    {/* Icon */}
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <card.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    
                    {/* Stats */}
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">{card.label}</p>
                      <p className={`text-3xl sm:text-4xl font-bold bg-gradient-to-br ${card.gradient} bg-clip-text text-transparent`}>
                        {card.value}
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative Corner */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.gradient} opacity-5 rounded-bl-full`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Live Classes */}
          {courses.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <UpcomingLiveClasses />
            </div>
          )}
        </main>
      </div>
  );
}
