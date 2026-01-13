import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Header, HomeFooter, Footer2 } from './AppComponents';

interface LayoutBaseProps {
  children: React.ReactNode;
  noScroll?: boolean; 
  footer: React.ReactNode;// Útil para telas com listas longas (FlatList)
}

export function LayoutBase({ children, noScroll = false, footer }: LayoutBaseProps) {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header />
      <View style={{ flex: 1 }}>
        {noScroll ? (
          <View style={{ flex: 1, paddingHorizontal: 20 }}>{children}</View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 25 }}>
            {children}
          </ScrollView>
        )}
      </View>
      {footer} 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  // Estilo para telas comuns com Scroll
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 80, // Espaço para não bater no Header
    paddingBottom: 25,
    gap: 25,
  },
  // Estilo para telas sem Scroll (como a Planilha que terá lista própria)
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  }
});