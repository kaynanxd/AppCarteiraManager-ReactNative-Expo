import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router'; 
import { useTheme } from '../src/context/ThemeContext';
import { LayoutBase } from '../src/components/LayoutBase';
import { StatBox, TopItem, commonStyles, HomeFooter } from '../src/components/AppComponents';
import { TopExpense } from '../src/types';
import { getWeeklySummary, getTopExpenses } from '../src/services/database';


export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [stats, setStats] = useState({ expenses: 0, income: 0, balance: 0 });
  const [topItems, setTopItems] = useState<TopExpense[]>([]);

  const loadDashboardData = useCallback(() => {
    try {
      const summary: any = getWeeklySummary();
      const top = getTopExpenses() as TopExpense[];
      const expenses = summary?.totalExpenses || 0;
      const income = summary?.totalIncome || 0;

      setStats({
        expenses,
        income,
        balance: income - expenses
      });

      setTopItems(top);
    } catch (error) {
      console.warn("Erro ao carregar dados do preview:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData])
  );

  return (
    <LayoutBase footer={<HomeFooter />}>
      {/* 3 botoes principais*/}
      <View style={[styles.mainCard, { backgroundColor: theme.card }]}>
        <TouchableOpacity 
          onPress={() => router.push('/expenses')} 
          style={[commonStyles.buttonBase, styles.largeButton, { backgroundColor: theme.primary }]}
        >
          <Text style={[commonStyles.buttonText, { color: theme.text }]}>Gestor De Contas</Text>
        </TouchableOpacity>
        
        <View style={styles.row}>
          <TouchableOpacity
           onPress={() => router.push('/notes')}
           style={[commonStyles.buttonBase, styles.smallButton, { backgroundColor: theme.primary }]}>
            <Text style={[commonStyles.buttonText, { color: theme.text }]}>Anotações</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
           onPress={() => router.push('/calendar')}
          style={[commonStyles.buttonBase, styles.smallButton, { backgroundColor: theme.primary }]}>
            <Text style={[commonStyles.buttonText, { color: theme.text }]}>Calendário</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/*resumos da semana*/}
      <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
        <View style={[commonStyles.buttonBase, styles.summaryHeader, { backgroundColor: theme.primary }]}>
           <Text style={[commonStyles.buttonText, { color: theme.text, fontSize: 14 }]}>Resumo da semana</Text>
        </View>
        
        <View style={styles.statsRow}>
           <StatBox label="Despesas" value={`-R$ ${stats.expenses.toFixed(2)}`} />
           <StatBox label="Ganhos" value={`+R$ ${stats.income.toFixed(2)}`} />
           <StatBox label="Geral" value={`R$ ${stats.balance.toFixed(2)}`} />
        </View>

        <Text style={[styles.topTitle, { color: theme.text }]}>Top 3 Maiores Gastos :</Text>
        
        <View style={styles.topThreeRow}>
                  <TopItem 
                    icon={topItems[0]?.icon} 
                    label={topItems[0]?.name || "---"} 
                  />
                  <TopItem 
                    icon={topItems[1]?.icon} 
                    label={topItems[1]?.name || "---"} 
                  />
                  <TopItem 
                    icon={topItems[2]?.icon} 
                    label={topItems[2]?.name || "---"} 
                  />
                </View>
      </View>
    </LayoutBase>
  );
}

const styles = StyleSheet.create({
  mainCard: { marginHorizontal: 20, padding: 20, borderRadius: 25, gap: 15 },
  largeButton: { height: 130 },
  smallButton: { flex: 1, height: 110 },
  row: { flexDirection: 'row', gap: 15 },
  summaryCard: { marginHorizontal: 20, padding: 20, borderRadius: 25, alignItems: 'center', marginTop: 30 },
  summaryHeader: { paddingHorizontal: 20, paddingVertical: 6, marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  topTitle: { fontSize: 15, marginBottom: 15, fontWeight: '500' },
  topThreeRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
});