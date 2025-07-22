'use client';

import { useAccessCode } from '@/app/providers/AccessCodeProvider';
import Loader from '@/components/Loader';
import { redirect } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAccessCode();

  if (loading !== 'completed') {
    return <Loader />;
  }

  if (!isAuthenticated && loading === 'completed') {
    return redirect('/login');
  }

  return <>{children}</>;
}
