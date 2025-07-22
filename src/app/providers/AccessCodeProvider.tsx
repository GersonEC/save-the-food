'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessCodeContextType {
  accessCode: string | null;
  setAccessCode: (code: string) => void;
  clearAccessCode: () => void;
  isAuthenticated: boolean;
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

  // Load access code from localStorage on mount
  useEffect(() => {
    const savedAccessCode = localStorage.getItem('saveTheFoodAccessCode');
    if (savedAccessCode) {
      setAccessCodeState(savedAccessCode);
    }
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
