'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function InstructorHomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to courses page
    router.replace('/instructor/courses');
  }, [router]);

  return (
    <div className="flex-1 flex items-center justify-center h-[calc(100vh-73px)] bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
          <Loader2 className="absolute inset-0 m-auto size-10 animate-spin text-white" />
        </div>
        <p className="text-gray-600 font-medium">Redirecting to courses...</p>
      </div>
    </div>
  );
}
