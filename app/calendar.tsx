import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native'; // Adicionado Alert
import { useTheme } from '../src/context/ThemeContext';
import { LayoutBase } from '../src/components/LayoutBase';
import { commonStyles, HomeFooter } from '../src/components/AppComponents';
import { getTransactionsByMonth, getTransactionsBySpecificDay, deleteTransaction } from '../src/services/database';
import { useFocusEffect } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { getDaysInMonth } from '../src/utils/formatters';
import { TransactionCard } from '../src/components/TransactionCard';
import { AddExpenseModal } from '../src/components/AddExpenseModal';
import { TransactionDetailModal } from '../src/components/TransactionDetailModal';

export default function CalendarScreen() {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [dayTransactions, setDayTransactions] = useState<any[]>([]);
  
  const [dayModalVisible, setDayModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);

  const [selectedDayStr, setSelectedDayStr] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [activeMode, setActiveMode] = useState<'Despesas' | 'Ganhos'>('Despesas');

  const loadData = useCallback(() => {
    const data = getTransactionsByMonth(currentDate.getFullYear(), currentDate.getMonth());
    setMonthlyData(data);
    
    if (selectedDayStr) {
      const dayData = getTransactionsBySpecificDay(selectedDayStr);
      setDayTransactions(dayData);
    }
  }, [currentDate, selectedDayStr]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const daysInMonth = useMemo(() => {
      return getDaysInMonth(currentDate);
    }, [currentDate]);

  const handleDayPress = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const data = getTransactionsBySpecificDay(dateStr);
    setDayTransactions(data);
    setSelectedDayStr(dateStr);
    setDayModalVisible(true);
  };

  const handleOpenDetail = (transaction: any) => {
    setSelectedTransaction(transaction);
    setDetailVisible(true);
  };

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    setDetailVisible(false);
    setAddModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja apagar esta transação?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: () => {
            deleteTransaction(id);
            loadData();
            setDetailVisible(false);
          } 
        }
      ]
    );
  };

  const hasActivity = (day: number) => {
    if (!day) return false;
    const dayStr = String(day).padStart(2, '0');
    return monthlyData.some(t => t.date.includes(`-${dayStr}T`) || t.date.split(' ')[0].endsWith(`-${dayStr}`));
  };

  const changeMonth = (step: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + step);
    setCurrentDate(newDate);
  };

  const openAddModal = (mode: 'Despesas' | 'Ganhos') => {
    setActiveMode(mode);
    setEditingTransaction(null);
    setDayModalVisible(false);
    setAddModalVisible(true);
  };

  return (
    <LayoutBase noScroll={true} footer={<HomeFooter />}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth(-1)}><ChevronLeft color={theme.text} /></TouchableOpacity>
        <Text style={[styles.monthLabel, { color: theme.text }]}>
          {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)}><ChevronRight color={theme.text} /></TouchableOpacity>
      </View>

      <View style={[styles.calendarGrid, { backgroundColor: theme.card }]}>
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
          <Text key={i} style={[styles.weekDay, { color: theme.text }]}>{d}</Text>
        ))}
        {daysInMonth.map((day, index) => (
          <TouchableOpacity 
            key={index}
            disabled={!day}
            onPress={() => day && handleDayPress(day)}
            style={[
              styles.daySquare,
              day ? { backgroundColor: theme.primary } : null,
              (day && hasActivity(day)) ? { backgroundColor: theme.accent || '#8e8cd8' } : null
            ]}
          >
            <Text style={[styles.dayText, { color: theme.text }]}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal de Detalhes do Dia */}
      <Modal visible={dayModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Dia {selectedDayStr.split('-')[2]}</Text>
            
            <ScrollView style={{ maxHeight: 300 }}>
              {dayTransactions.map((item) => (
                <TransactionCard 
                    key={item.id} 
                    item={item} 
                    onPress={handleOpenDetail} 
                    theme={theme} 
                />
              ))}
            </ScrollView>

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[commonStyles.buttonBase, styles.splitBtn, { backgroundColor: theme.primary }]}
                onPress={() => openAddModal('Despesas')}
              >
                <Text style={[styles.btnText, { color: theme.text }]}>Adicionar</Text>
                <Text style={[styles.btnText, { color: theme.text }]}>Despesa</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[commonStyles.buttonBase, styles.splitBtn, { backgroundColor: theme.primary }]}
                onPress={() => openAddModal('Ganhos')}
              >
                <Text style={[styles.btnText, { color: theme.text }]}>Adicionar</Text>
                <Text style={[styles.btnText, { color: theme.text }]}>Ganho</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={() => setDayModalVisible(false)}>
              <Text style={{ color: theme.text, textAlign: 'center', marginTop: 15, opacity: 0.6 }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TransactionDetailModal 
        visible={detailVisible}
        transaction={selectedTransaction}
        onClose={() => setDetailVisible(false)}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <AddExpenseModal 
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={loadData}
        editingTransaction={editingTransaction}
        activeMode={activeMode} 
      />
    </LayoutBase>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 120 },
  monthLabel: { fontSize: 18, fontWeight: 'bold' },
calendarGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginHorizontal: 20, 
    padding: 15, 
    borderRadius: 25,
    justifyContent: 'flex-start',
    columnGap: 4, 
    rowGap: 8 
  },
  weekDay: { 
    width: '13%', 
    textAlign: 'center', 
    fontWeight: 'bold', 
    marginBottom: 5, 
    fontSize: 12 
  },
  daySquare: { 
    width: '13%', 
    height: 45, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 10 
  },
  dayText: { fontSize: 14, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', padding: 25, borderRadius: 25 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  itemCard: { flexDirection: 'row', padding: 12, borderRadius: 15, alignItems: 'center', marginBottom: 8 },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  splitBtn: { flex: 1, paddingVertical: 12 },
  btnText: { fontWeight: 'bold', fontSize: 13 }
});