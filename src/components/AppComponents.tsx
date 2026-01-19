import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Moon, Sun, ArrowLeft } from 'lucide-react-native'; 
import { useTheme } from '../context/ThemeContext';
import { useRouter, usePathname } from 'expo-router'; 

export const commonStyles = StyleSheet.create({
  buttonBase: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  buttonText: { fontWeight: '600', fontSize: 15 },
});

export function Header() {
  const { theme, isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const showBackButton = pathname !== '/';

  return (
    <View style={[styles.headerContainer, { backgroundColor: theme.card }]}>
      <View style={styles.headerContent}>
        <View style={styles.logoRow}>
          
          {showBackButton && (
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color={theme.text} />
            </TouchableOpacity>
          )}

          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logoImage}
          />
          <Text style={[styles.title, { color: theme.text }]}>Carteira Manager</Text>
        </View>

        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          {isDark ? <Sun size={24} color={theme.text} /> : <Moon size={24} color={theme.text} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function HomeFooter() {
  const { theme } = useTheme();
  return <View style={[styles.footerContainer, { backgroundColor: theme.card }]} />;
}

export function Footer2({ 
  activeTab, 
  onTabChange 
}: { 
  activeTab: 'Despesas' | 'Ganhos' | 'Geral', 
  onTabChange: (tab: 'Despesas' | 'Ganhos' | 'Geral') => void 
}) {
  const { theme } = useTheme();

  return (
    <View style={[styles.footerContainer2, { backgroundColor: theme.card }]}>
      <View style={styles.tabBar}>
        <TabButton label="Despesas" active={activeTab === 'Despesas'} onPress={() => onTabChange('Despesas')} />
        <TabButton label="Ganhos" active={activeTab === 'Ganhos'} onPress={() => onTabChange('Ganhos')} />
        <TabButton label="Geral" active={activeTab === 'Geral'} onPress={() => onTabChange('Geral')} />
      </View>
    </View>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean, onPress: () => void }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        commonStyles.buttonBase,
        styles.tabBtn,
        { backgroundColor: theme.primary },
        active ? { opacity: 1, height: 50 } : { opacity: 0.5, height: 40 },
      ]}
    >
      <Text style={[commonStyles.buttonText, { color: theme.text, fontSize: active ? 14 : 12 }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

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

export function TopItem({ label, icon = "?" }: { label: string, icon?: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.topItemContainer}>
      <View style={[styles.iconCircle, { backgroundColor: theme.iconBackground }]}>
        <Text style={{ fontSize: 24 }}>{icon}</Text>
      </View>
      <Text style={[styles.topItemLabel, { color: theme.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  logoRow: { 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginRight: 10,
  },
  title: { 
    fontSize: 18, 
    fontWeight: '700',
    letterSpacing: -0.5
  },
  themeToggle: { padding: 8 },
  statBoxContainer: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 13, marginBottom: 5, opacity: 0.9 },
  statValueBox: { width: '100%', paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  statValueText: { fontSize: 13, fontWeight: 'bold' },
  topItemContainer: { alignItems: 'center', gap: 5 },
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderColor: '#000' },
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