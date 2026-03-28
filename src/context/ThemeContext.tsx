import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeColors = {
  primary50: string;
  primary100: string;
  primary200: string;
  primary300: string;
  primary400: string;
  primary500: string;
  primary600: string;
  primary700: string;
  primary800: string;
  primary900: string;
  secondary: string;
};

type ThemeName = 'blue' | 'green' | 'purple' | 'rose' | 'teal';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  availableThemes: { name: ThemeName; label: string; color: string }[];
}

export const THEMES: Record<ThemeName, ThemeColors> = {
  blue: {
    primary50: '#f0f9ff',
    primary100: '#e0f2fe',
    primary200: '#bae6fd',
    primary300: '#7dd3fc',
    primary400: '#38bdf8',
    primary500: '#0ea5e9', // Deep Sky Blue (Improved)
    primary600: '#0284c7',
    primary700: '#0369a1',
    primary800: '#075985',
    primary900: '#0c4a6e',
    secondary: '#38bdf8',
  },
  green: {
    primary50: '#f0fdf4',
    primary100: '#dcfce7',
    primary200: '#bbf7d0',
    primary300: '#86efac',
    primary400: '#4ade80',
    primary500: '#16a34a', // More vibrant Green-600
    primary600: '#15803d', // Deeper Green-700
    primary700: '#14532d', // Very deep Green-800 for Header
    primary800: '#064e3b',
    primary900: '#022c22',
    secondary: '#22c55e',
  },
  purple: {
    primary50: '#faf5ff',
    primary100: '#f3e8ff',
    primary200: '#e9d5ff',
    primary300: '#d8b4fe',
    primary400: '#c084fc',
    primary500: '#a855f7',
    primary600: '#9333ea',
    primary700: '#7e22ce',
    primary800: '#6b21a8',
    primary900: '#581c87',
    secondary: '#c084fc',
  },
  rose: {
    primary50: '#fff1f2',
    primary100: '#ffe4e6',
    primary200: '#fecdd3',
    primary300: '#fda4af',
    primary400: '#fb7185',
    primary500: '#e11d48',
    primary600: '#be123c',
    primary700: '#9f1239',
    primary800: '#881337',
    primary900: '#4c0519',
    secondary: '#fb7185',
  },
  teal: {
    primary50: '#f0fdfa',
    primary100: '#ccfbf1',
    primary200: '#99f6e4',
    primary300: '#5eead4',
    primary400: '#2dd4bf',
    primary500: '#0d9488',
    primary600: '#0f766e',
    primary700: '#115e59',
    primary800: '#134e4a',
    primary900: '#042f2e',
    secondary: '#2dd4bf',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    return (localStorage.getItem('theme') as ThemeName) || 'teal';
  });

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    root.setAttribute('data-theme', theme);
    body.setAttribute('data-theme', theme);
    
    const colors = THEMES[theme];
    const targetElements = [root, body];
    
    targetElements.forEach(el => {
      el.style.setProperty('--color-primary-50', colors.primary50);
      el.style.setProperty('--color-primary-100', colors.primary100);
      el.style.setProperty('--color-primary-200', colors.primary200);
      el.style.setProperty('--color-primary-300', colors.primary300);
      el.style.setProperty('--color-primary-400', colors.primary400);
      el.style.setProperty('--color-primary-500', colors.primary500);
      el.style.setProperty('--color-primary-600', colors.primary600);
      el.style.setProperty('--color-primary-700', colors.primary700);
      el.style.setProperty('--color-primary-800', colors.primary800);
      el.style.setProperty('--color-primary-900', colors.primary900);
      el.style.setProperty('--color-secondary', colors.secondary);
    });
  }, [theme]);

  const availableThemes: { name: ThemeName; label: string; color: string }[] = [
    { name: 'blue', label: 'Sky Blue', color: '#0ea5e9' },
    { name: 'green', label: 'Fresh Green', color: '#22c55e' },
    { name: 'purple', label: 'Modern Purple', color: '#8b5cf6' },
    { name: 'rose', label: 'Soft Rose', color: '#f43f5e' },
    { name: 'teal', label: 'Cool Teal', color: '#14b8a6' },
  ];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes }}>
      <div 
        style={{
          // @ts-ignore
          '--color-primary-50': THEMES[theme].primary50,
          '--color-primary-100': THEMES[theme].primary100,
          '--color-primary-200': THEMES[theme].primary200,
          '--color-primary-300': THEMES[theme].primary300,
          '--color-primary-400': THEMES[theme].primary400,
          '--color-primary-500': THEMES[theme].primary500,
          '--color-primary-600': THEMES[theme].primary600,
          '--color-primary-700': THEMES[theme].primary700,
          '--color-primary-800': THEMES[theme].primary800,
          '--color-primary-900': THEMES[theme].primary900,
          '--color-secondary': THEMES[theme].secondary,
          display: 'contents'
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
