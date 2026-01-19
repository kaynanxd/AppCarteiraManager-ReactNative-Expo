import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../src/context/ThemeContext';
import { LayoutBase } from '../src/components/LayoutBase';
import { commonStyles,Footer2 } from '../src/components/AppComponents';
import { AddExpenseModal } from '../src/components/AddExpenseModal';
import { TransactionDetailModal } from '../src/components/TransactionDetailModal'; 
import { database, deleteTransaction } from '../src/services/database'; 
import { SummaryCards } from '@/src/components/SummaryCards';
import { DateNavigator } from '@/src/components/DateNavigator';
import { getRangeDates, formatDateRangeLabel, FilterType } from '@/src/utils/dateUtils';
import { PeriodSelector } from '../src/components/PeriodSelector';
import { ExpenseChart } from '../src/components/ExpenseChart';
import { TransactionCard } from '../src/components/TransactionCard';

export default function ExpensesScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [activeMode, setActiveMode] = useState<'Despesas' | 'Ganhos' | 'Geral'>('Despesas');

  const [chartData, setChartData] = useState<any[]>([]);
  const getCategoryColor = (index: number) => {
    if (!theme.chart || theme.chart.length === 0) return '#ccc'; 
    return theme.chart[index % theme.chart.length];
  };

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const [filterType, setFilterType] = useState<FilterType>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateRangeLabel, setDateRangeLabel] = useState('');

  const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });

  const changeDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const step = direction === 'next' ? 1 : -1;
    if (filterType === 'day') newDate.setDate(newDate.getDate() + step);
    else if (filterType === 'week') newDate.setDate(newDate.getDate() + step * 7);
    else if (filterType === 'month') newDate.setMonth(newDate.getMonth() + step);
    else if (filterType === 'year') newDate.setFullYear(newDate.getFullYear() + step);
    setCurrentDate(newDate);
  };

const loadData = useCallback(() => {
    const { start, end } = getRangeDates(filterType, currentDate);
    let label = '';
    if (filterType === 'day') {
      label = formatDate(start);
    } else if (filterType === 'month') {
      const monthName = start.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      label = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    } else if (filterType === 'year') {
      label = start.getFullYear().toString();
    } else {
      label = `${formatDate(start)} - ${formatDate(end)}`;
    }

    setDateRangeLabel(label);

    const startIso = start.toISOString();
    const endIso = end.toISOString();

    let queryFilter = '';
    if (activeMode === 'Despesas') queryFilter = 'AND t.amount < 0';
    else if (activeMode === 'Ganhos') queryFilter = 'AND t.amount > 0';

    const data: any = database.getAllSync(`
          SELECT t.*, c.name as categoryName, c.icon 
          FROM transactions t 
          LEFT JOIN categories c ON t.category_id = c.id 
          WHERE t.date >= ? AND t.date <= ? ${queryFilter}
          ORDER BY t.date DESC
        `, [startIso, endIso]);

    setTransactions(data);
    const total = data.reduce((sum: number, item: any) => sum + item.amount, 0);
    setTotalAmount(total);
  }, [filterType, currentDate, activeMode]);

useEffect(() => {
  loadData();
}, [loadData]); 

useEffect(() => {
    if (transactions.length > 0) {
      const grouped = transactions.reduce((acc: any, curr: any) => {
        const catId = curr.category_id;
        if (!acc[catId]) {
          acc[catId] = {
            value: 0,
            color: getCategoryColor(Object.keys(acc).length),
            text: curr.icon,
          };
        }
        acc[catId].value += Math.abs(curr.amount);
        return acc;
      }, {});
      setChartData(Object.values(grouped));
    } else {
      setChartData([{ value: 1, color: theme.card }]);
    }
  }, [transactions, theme.card]);

    const handleOpenDetail = (transaction: any) => {
    setSelectedTransaction(transaction);
    setDetailVisible(true);
    };

    const handleDelete = (id: number) => {
    deleteTransaction(id);
    loadData();
    };

    const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    setDetailVisible(false);             
    setAddModalVisible(true);            
    };

  return (
    <LayoutBase noScroll={true} footer={<Footer2 activeTab={activeMode} onTabChange={setActiveMode} />}>
      
      <PeriodSelector 
        filterType={filterType} 
        onSelect={setFilterType} 
        theme={theme} 
      />

      <DateNavigator 
        label={dateRangeLabel} 
        onPrev={() => changeDate('prev')} 
        onNext={() => changeDate('next')} 
        color={theme.text} 
      />
      {/* Grafico em Rodela */}
      <ExpenseChart 
        chartData={chartData} 
        totalAmount={totalAmount} 
        activeMode={activeMode} 
        theme={theme} 
      />


        
        {/* Lista de Cards */}
      <View style={[styles.listContainer, { backgroundColor: theme.card }]}>
          {activeMode === 'Geral' && (
            <SummaryCards 
              expenses={transactions.filter(t => t.amount < 0).reduce((s, i) => s + i.amount, 0)}
              income={transactions.filter(t => t.amount > 0).reduce((s, i) => s + i.amount, 0)}
              balance={totalAmount}
              theme={theme}
            />
          )}
          <ScrollView 
              showsVerticalScrollIndicator={true}
              indicatorStyle={theme.background ? 'white' : 'black'}
              contentContainerStyle={{ paddingRight: 15, paddingLeft: 5, paddingBottom: 20 }}
          >
              {transactions.length === 0 ? (
                  <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20, opacity: 0.6 }}>
                      Nenhuma despesa neste período.
                  </Text>
              ) : (
                  transactions.map((item) => (
                      <TransactionCard 
                          key={item.id} 
                          item={item} 
                          onPress={handleOpenDetail} 
                          theme={theme} 
                      />
                  ))
              )}
          </ScrollView>
        </View>

        {/* Botão Adicionar*/}
        {activeMode !== 'Geral' && (
          <TouchableOpacity 
            style={[
              commonStyles.buttonBase, 
              styles.addBtn, 
              { 
                backgroundColor: isDark ? theme.primary : theme.card
              }
            ]}
            onPress={() => setAddModalVisible(true)}
          >
            <Text style={[commonStyles.buttonText, { color: theme.text }]}>
              {activeMode === 'Ganhos' ? 'Adicionar Ganho' : 'Adicionar Despesa'}
            </Text>
          </TouchableOpacity>
        )}

        <AddExpenseModal 
          visible={addModalVisible} 
          onClose={() => setAddModalVisible(false)} 
          onSave={loadData} 
          editingTransaction={editingTransaction}
          activeMode={activeMode} 
        />

        <TransactionDetailModal 
        visible={detailVisible}
        transaction={selectedTransaction}
        onClose={() => setDetailVisible(false)}
        onDelete={handleDelete}
        onEdit={handleEdit} 
        />
      
    </LayoutBase>
  );
}

const styles = StyleSheet.create({
   filterRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 15,
        marginTop:20,
        marginHorizontal:20,
        padding: 5,        
        borderRadius: 15,     
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
  filterBtn: { 
    flex: 1,             
    paddingVertical: 8,
    marginHorizontal: 5,
    marginVertical: 5,   
    borderRadius: 10,    
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNavRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: -10, paddingHorizontal: 100 },
  dateLabel: { fontSize: 14, fontWeight: '500' },
  
  chartContainer: {
    width: 240,           
    height: 240,         
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', 
  },
  overlayCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  centerLabel: {
    position: 'absolute',
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
        marginBottom: 15,
        gap: 10,
    },
statCard: {
    flex: 1,
    paddingVertical: 10,   
    paddingHorizontal: 5,  
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center', 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
},
    
  donutInner: { width: 160, height: 160, borderRadius: 80, borderWidth: 15, justifyContent: 'center', alignItems: 'center' },
  totalAmount: { fontSize: 24, fontWeight: 'bold' },
  listContainer: { flex: 1, borderRadius: 25, padding: 15, paddingHorizontal:20, marginBottom: 15, marginHorizontal:20 },
  itemCard: { flexDirection: 'row', padding: 12, borderRadius: 15, alignItems: 'center', marginBottom: 10,shadowColor: "#000",shadowOffset: { width: 0, height: 3 },shadowOpacity: 0.25,shadowRadius: 3.84,elevation: 5, },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(161, 194, 184, 0.51)', justifyContent: 'center', alignItems: 'center' },
  addBtn: { paddingVertical: 15, borderRadius: 20, marginBottom: 15, marginHorizontal:20 },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around' },
  tabItem: { paddingVertical: 10, paddingHorizontal: 20 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#FFF' },
});