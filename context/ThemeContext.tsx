// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';

type ThemeContextType = {
  isDark: boolean;
  theme: typeof Colors.dark;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceTheme = useColorScheme(); // Pega o tema do sistema (Android/iOS)
  const [isDark, setIsDark] = useState(deviceTheme === 'dark');

  useEffect(() => {
    // Carrega a preferência salva pelo usuário
    AsyncStorage.getItem('user_theme').then((savedTheme) => {
      if (savedTheme) setIsDark(savedTheme === 'dark');
    });
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    await AsyncStorage.setItem('user_theme', newTheme ? 'dark' : 'light');
  };

  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personalizado para usar o tema facilmente
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  return context;
};