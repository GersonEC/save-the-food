'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LoadingStatus } from '../page';

interface AccessCodeContextType {
  accessCode: string | null;
  setAccessCode: (code: string) => void;
  clearAccessCode: () => void;
  isAuthenticated: boolean;
  loading: LoadingStatus;
}

const AccessCodeContext = createContext<AccessCodeContextType | undefined>(
  undefined
);

export function AccessCodeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [accessCode, setAccessCodeState] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingStatus>('idle');

  // Load access code from localStorage on mount
  useEffect(() => {
    setLoading('pending');
    const savedAccessCode = localStorage.getItem('saveTheFoodAccessCode');
    if (savedAccessCode) {
      setAccessCodeState(savedAccessCode);
    }
    setLoading('completed');
  }, []);

  const setAccessCode = (code: string) => {
    setAccessCodeState(code);
    localStorage.setItem('saveTheFoodAccessCode', code);
  };

  const clearAccessCode = () => {
    setAccessCodeState(null);
    localStorage.removeItem('saveTheFoodAccessCode');
  };

  const isAuthenticated = !!accessCode;

  return (
    <AccessCodeContext.Provider
      value={{
        accessCode,
        setAccessCode,
        clearAccessCode,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AccessCodeContext.Provider>
  );
}

export function useAccessCode() {
  const context = useContext(AccessCodeContext);
  if (context === undefined) {
    throw new Error('useAccessCode must be used within an AccessCodeProvider');
  }
  return context;
}
