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
    <div className="flex-1 flex items-center justify-center h-[calc(100vh-73px)]">
      <div className="text-center">
        <Loader2 className="size-8 animate-spin text-[#1E88E5] mx-auto mb-4" />
        <p className="text-[#78909C]">Redirecting to courses...</p>
      </div>
    </div>
  );
}
