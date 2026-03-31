'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface DarkModeContextType {
  dark: boolean;
  toggleDark: () => void;
}

const DarkModeContext = createContext<DarkModeContextType>({
  dark: false,
  toggleDark: () => {},
});

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') setDark(true);
  }, []);

  const toggleDark = () => {
    setDark((v) => {
      localStorage.setItem('theme', !v ? 'dark' : 'light');
      return !v;
    });
  };

  return (
    <DarkModeContext.Provider value={{ dark, toggleDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => useContext(DarkModeContext);
