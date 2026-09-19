'use client';

import { Calendar, Clock, Video, User, CheckCircle2, PlayCircle } from 'lucide-react';
import { ScheduledClass } from '@/types';
import Card, { CardContent } from './Card';

interface ScheduledClassCardProps {
  scheduledClass: ScheduledClass;
}

export default function ScheduledClassCard({ scheduledClass }: ScheduledClassCardProps) {
  const scheduledDate = new Date(scheduledClass.scheduled_at);
  const now = new Date();
  const classEndTime = new Date(scheduledDate.getTime() + scheduledClass.duration_minutes * 60000);
  
  // Determine class status
  const isUpcoming = scheduledDate > now;
  const isLive = scheduledDate <= now && now <= classEndTime && scheduledClass.status === 'scheduled';
  const isCompleted = scheduledClass.status === 'completed' || (classEndTime < now && scheduledClass.status === 'scheduled');

  // Status badge configuration
  const getStatusConfig = () => {
    if (isLive) {
      return {
        label: 'Live Now',
        color: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200',
        icon: <PlayCircle className="size-3.5 animate-pulse" />,
      };
    }
    if (isCompleted) {
      return {
        label: 'Completed',
        color: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border-gray-300',
        icon: <CheckCircle2 className="size-3.5" />,
      };
    }
    // Upcoming
    return {
      label: 'Upcoming',
      color: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200',
      icon: <Clock className="size-3.5" />,
    };
  };

  const statusConfig = getStatusConfig();

  // Format date and time
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 h-full flex flex-col">
      <div className="relative overflow-hidden">
        {scheduledClass.thumbnail_url ? (
          <img
            src={scheduledClass.thumbnail_url}
            alt={scheduledClass.course_title}
            className="w-full h-32 sm:h-36 lg:h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-32 sm:h-36 lg:h-40 bg-gradient-to-br from-purple-100 via-blue-100 to-cyan-100 flex items-center justify-center transition-all duration-300 group-hover:from-purple-200 group-hover:via-blue-200 group-hover:to-cyan-200">
            <Video className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-400" />
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Status Badge */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <span className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold rounded-full shadow-lg backdrop-blur-sm border flex items-center gap-1 sm:gap-1.5 ${statusConfig.color}`}>
            {statusConfig.icon}
            <span className="hidden xs:inline">{statusConfig.label}</span>
          </span>
        </div>

        {/* Live Indicator */}
        {isLive && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <div className="flex items-center gap-1 sm:gap-1.5 bg-red-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg animate-pulse">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
              <span className="text-[10px] sm:text-xs font-bold">LIVE</span>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
        <div className="space-y-2 sm:space-y-3 flex-1 flex flex-col">
          {/* Class Title */}
          <div className="flex-shrink-0">
            <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-800 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all leading-tight mb-1 pb-0.5">
              {scheduledClass.title}
            </h3>
            {scheduledClass.description && (
              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {scheduledClass.description}
              </p>
            )}
          </div>

          {/* Course Name */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-purple-100 flex-shrink-0">
            <div className="p-0.5 sm:p-1 bg-gradient-to-br from-purple-100 to-blue-100 rounded-md flex-shrink-0">
              <Video className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600" />
            </div>
            <span className="truncate font-medium flex-1 min-w-0">{scheduledClass.course_title}</span>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs lg:text-sm flex-shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-blue-500 shrink-0" />
              <span className="truncate">{formatDate(scheduledDate)}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-teal-500 shrink-0" />
              <span className="truncate">{formatTime(scheduledDate)}</span>
            </div>
          </div>

          {/* Duration and Instructor */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 pt-2 border-t border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              <span className="whitespace-nowrap">{scheduledClass.duration_minutes} mins</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              <span className="truncate max-w-[100px] sm:max-w-[120px]">{scheduledClass.created_by_name || 'Instructor'}</span>
            </div>
          </div>

          {/* Meet Link Display Only */}
          {scheduledClass.meet_link && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg flex-shrink-0">
              <Video className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              <span className="truncate flex-1 min-w-0">
                {scheduledClass.meet_link}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
