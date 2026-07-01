'use client';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  // No loading state - instant navigation
  return <>{children}</>;
}
