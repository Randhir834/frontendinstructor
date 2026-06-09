'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function InstructorRootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to My Courses page by default
    router.replace('/instructor/courses');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5]">
      <div className="text-center">
        <Loader2 className="size-12 animate-spin text-[#1E88E5] mx-auto mb-4" />
        <p className="text-[#78909C] text-lg">Loading your courses...</p>
      </div>
    </div>
  );
}