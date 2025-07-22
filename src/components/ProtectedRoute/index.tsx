'use client';

import { useAccessCode } from '@/app/providers/AccessCodeProvider';
import AccessCodeLogin from '@/components/AccessCodeLogin';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAccessCode();

  if (!isAuthenticated && loading === 'completed') {
    return (
      <div className='h-[70%] flex items-center justify-center'>
        <AccessCodeLogin />
      </div>
    );
  }

  return <>{children}</>;
}
