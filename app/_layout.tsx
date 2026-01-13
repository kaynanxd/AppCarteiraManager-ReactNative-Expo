import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '../context/ThemeContext';
import { setupDatabase } from '../services/database';

// Impede que a tela de abertura (splash) suma automaticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initializeApp() {
      try {
        // 1. Inicializa o banco de dados e cria as tabelas
        setupDatabase();
        
        // Pequeno delay opcional para garantir que tudo foi processado
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn("Erro ao carregar o banco de dados:", e);
      } finally {
        // 2. Avisa que o app está pronto e esconde a splash screen
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    initializeApp();
  }, []);

  // Enquanto o banco não estiver pronto, não renderizamos as rotas
  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="expenses" />
      </Stack>
    </ThemeProvider>
  );
}