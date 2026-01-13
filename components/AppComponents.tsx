import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

// --- ESTILOS COMPARTILHADOS (Botões e Sombras) ---
export const commonStyles = StyleSheet.create({
  buttonBase: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: { fontWeight: '600', fontSize: 15 },
});

// --- COMPONENTE: HEADER ---
export function Header() {
  const { theme, isDark, toggleTheme } = useTheme();
  return (
    <View style={[styles.headerContainer, { backgroundColor: theme.card }]}>
      <View style={styles.headerContent}>
        <View style={styles.logoRow}>
          <View style={[styles.logoPlaceholder, { backgroundColor: theme.primary }]}>
            <Text style={{ fontSize: 20 }}>🍔</Text>
          </View>
          <Text style={[styles.title, { color: theme.text }]}>Dinheiro Manager</Text>
        </View>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          {isDark ? <Sun size={24} color={theme.text} /> : <Moon size={24} color={theme.text} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- COMPONENTE: FOOTER ---
// --- FOOTER ORIGINAL (Para a Home - Apenas decorativo) ---
export function HomeFooter() {
  const { theme } = useTheme();
  return <View style={[styles.footerContainer, { backgroundColor: theme.card }]} />;
}

// --- FOOTER 2 (Para Expenses - Com os botões do Figma) ---
export function Footer2({ activeTab }: { activeTab: 'Despesas' | 'Ganhos' | 'Geral' }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.footerContainer2, { backgroundColor: theme.card }]}>
      <View style={styles.tabBar}>
        <TabButton label="Despesas" active={activeTab === 'Despesas'} />
        <TabButton label="Ganhos" active={activeTab === 'Ganhos'} />
        <TabButton label="Geral" active={activeTab === 'Geral'} />
      </View>
    </View>
  );
}

// Botão interno das abas
function TabButton({ label, active }: { label: string; active: boolean }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[
        commonStyles.buttonBase,
        styles.tabBtn,
        { backgroundColor: theme.primary },
        // Destaque: Ativo é opaco (mais escuro) e maior. Inativo é transparente e menor.
        active ? { opacity: 1, height: 50 } : { opacity: 0.5, height: 40 },
      ]}
    >
      <Text style={[commonStyles.buttonText, { color: theme.text, fontSize: active ? 14 : 12 }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// --- COMPONENTE: STATBOX ---
export function StatBox({ label, value }: { label: string, value: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.statBoxContainer}>
      <Text style={[styles.statLabel, { color: theme.text }]}>{label}</Text>
      <View style={[styles.statValueBox, { backgroundColor: theme.primary }]}>
        <Text style={[styles.statValueText, { color: theme.text }]}>{value}</Text>
      </View>
    </View>
  );
}

// --- COMPONENTE: TOPITEM ---
export function TopItem({ label, icon = "🍬" }: { label: string, icon?: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.topItemContainer}>
      <View style={[styles.iconCircle, { backgroundColor: '#F9E79F' }]}>
        <Text style={{ fontSize: 24 }}>{icon}</Text>
      </View>
      <Text style={[styles.topItemLabel, { color: theme.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoPlaceholder: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '600' },
  themeToggle: { padding: 8 },
  statBoxContainer: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 13, marginBottom: 5, opacity: 0.9 },
  statValueBox: { width: '100%', paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  statValueText: { fontSize: 13, fontWeight: 'bold' },
  topItemContainer: { alignItems: 'center', gap: 5 },
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#000' },
  topItemLabel: { fontSize: 12 },
  footerContainer: {
    height: 60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
    footerContainer2: {
    height: 100,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10
  },
  tabBtn: { flex: 1 },
});