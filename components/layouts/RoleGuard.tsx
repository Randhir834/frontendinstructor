'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RoleGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: Array<'admin' | 'instructor' | 'student'>;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check if logout was initiated - redirect to homepage instead of login
    const logoutInitiated = sessionStorage.getItem('logout_initiated');
    if (logoutInitiated === 'true') {
      sessionStorage.removeItem('logout_initiated');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('sessionToken');
      sessionStorage.removeItem('auth_session');
      // Redirect to homepage, not login
      window.location.replace('/');
      return;
    }
    
    const rawUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!rawUser || !token) {
      router.replace('/login');
      return;
    }

    try {
      const user = JSON.parse(rawUser) as { role?: string };
      
      if (!user?.role || !allowedRoles.includes(user.role as 'admin' | 'instructor' | 'student')) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('sessionToken');
        router.replace('/login');
      }
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('sessionToken');
      router.replace('/login');
    }
  }, [allowedRoles, router]);

  return <>{children}</>;
}
