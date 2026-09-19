'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
};

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg'
};

export default function LoadingSpinner({ 
  size = 'md', 
  message, 
  fullScreen = false,
  className = '' 
}: LoadingSpinnerProps) {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 sm:gap-4 ${className}`}>
      <div className="relative">
        <Loader2 
          className={`${sizeClasses[size]} animate-spin text-blue-600`}
          strokeWidth={2.5}
        />
        <div className={`${sizeClasses[size]} absolute inset-0 rounded-full bg-blue-100 opacity-20 animate-pulse`} />
      </div>
      {message && (
        <p className={`${textSizeClasses[size]} text-gray-600 font-medium animate-pulse text-center px-4`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return content;
}

// Page-level loading component - SINGLE SOURCE OF TRUTH
export function PageLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4 sm:p-6">
      <div className="text-center">
        <div className="relative inline-block mb-4 sm:mb-6">
          <Loader2 
            className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 animate-spin text-blue-600"
            strokeWidth={2.5}
          />
          <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 absolute inset-0 rounded-full bg-blue-100 opacity-20 animate-pulse" />
        </div>
        <p className="text-sm sm:text-base md:text-lg font-medium text-gray-600 animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}

// Section/Card loading component
export function SectionLoading({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-8 sm:py-12 px-4">
      <div className="text-center">
        <div className="relative inline-block mb-3 sm:mb-4">
          <Loader2 
            className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-blue-600"
            strokeWidth={2.5}
          />
          <div className="h-8 w-8 sm:h-10 sm:w-10 absolute inset-0 rounded-full bg-blue-100 opacity-20 animate-pulse" />
        </div>
        {message && (
          <p className="text-xs sm:text-sm text-gray-600 animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// Inline loading component
export function InlineLoading({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
      <Loader2 className="h-4 w-4 animate-spin text-blue-600" strokeWidth={2.5} />
      {message && <span className="animate-pulse">{message}</span>}
    </div>
  );
}
