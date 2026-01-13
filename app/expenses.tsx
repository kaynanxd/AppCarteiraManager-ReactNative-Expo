import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { LayoutBase } from '../components/LayoutBase';
import { commonStyles,Footer2 } from '../components/AppComponents';
import { AddExpenseModal } from '../components/AddExpenseModal';
import { TransactionDetailModal } from '../components/TransactionDetailModal'; // Importado
import { database, deleteTransaction } from '../services/database'; // Importado deleteTransaction
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { PieChart } from "react-native-gifted-charts";

type FilterType = 'day' | 'week' | 'month' | 'year';

export default function ExpensesScreen() {
  const { theme } = useTheme();

  const [chartData, setChartData] = useState<any[]>([]);
  const getCategoryColor = (index: number) => {
  const chartColors = ['#7BC67E', '#FFB347', '#FF6961', '#779ECB', '#B19CD9'];
  return chartColors[index % chartColors.length];
};

  
  // Estados de Controle de Modais
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  
  // Estados de Dados
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState(0);

  // Estados de Filtro de Data
  const [filterType, setFilterType] = useState<FilterType>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateRangeLabel, setDateRangeLabel] = useState('');

  // --- Lógica de Datas ---
  const getRangeDates = (type: FilterType, refDate: Date) => {
    const start = new Date(refDate);
    const end = new Date(refDate);

    if (type === 'day') {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (type === 'week') {
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else if (type === 'month') {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(start.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
    } else if (type === 'year') {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
    }
    return { start, end };
  };

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

  // --- Lógica de Banco de Dados ---
  const loadData = useCallback(() => {
    const { start, end } = getRangeDates(filterType, currentDate);
    setDateRangeLabel(filterType === 'day' ? formatDate(start) : `${formatDate(start)} - ${formatDate(end)}`);

    const startIso = start.toISOString();
    const endIso = end.toISOString();

    const data: any = database.getAllSync(`
      SELECT t.*, c.name as categoryName, c.icon 
      FROM transactions t 
      LEFT JOIN categories c ON t.category_id = c.id 
      WHERE t.date >= ? AND t.date <= ?
      ORDER BY t.date DESC
    `, [startIso, endIso]);

    setTransactions(data);
    const total = data.reduce((sum: number, item: any) => sum + item.amount, 0);
    setTotalAmount(total);
  }, [filterType, currentDate]);

// 1. Efeito para carregar os dados do banco
useEffect(() => {
  loadData();
}, [loadData]); // Dispara quando muda filterType ou currentDate

// 2. Efeito para processar o gráfico (Evita o loop infinito)
useEffect(() => {
  if (transactions.length > 0) {
const grouped = transactions.reduce((acc: any, curr: any) => {
  const catId = curr.category_id;

  if (!acc[catId]) {
    acc[catId] = {
      value: 0,
      color: getCategoryColor(Object.keys(acc).length),
      text: curr.icon,
      // placeholders (a lib recalcula depois)
      shiftTextX: 0,
      shiftTextY: 0,
    };
  }

  acc[catId].value += curr.amount;
  return acc;
}, {});
    
    setChartData(Object.values(grouped));
  } else {
    setChartData([{ value: 1, color: theme.card }]);
  }
}, [transactions, theme.card]);

  // --- Handlers de Ação ---
// --- Handlers de Ação ---
    const handleOpenDetail = (transaction: any) => {
    setSelectedTransaction(transaction);
    setDetailVisible(true);
    };

    const handleDelete = (id: number) => {
    deleteTransaction(id);
    loadData();
    };

    // ADICIONE ESTA FUNÇÃO
    const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction); // Guarda os dados para o modal de cadastro
    setDetailVisible(false);             // Fecha o popup de detalhes
    setAddModalVisible(true);            // Abre o popup de cadastro (modo edição)
    };

  return (
    <LayoutBase noScroll={true} footer={<Footer2 activeTab="Despesas" />}>
      {/* 1. Filtros */}
        {/* 1. Filtros envolvidos por um contêiner (quadrado/retângulo) */}
        <View style={[styles.filterRow, { backgroundColor: theme.card }]}>
        {(['day', 'week', 'month', 'year'] as FilterType[]).map((type) => (
            <TouchableOpacity
            key={type}
            style={[
            styles.filterBtn, 
            { 
                // Se estiver ativo, usa a cor primária; se não, usa uma cor de fundo (ex: theme.card ou outra)
                backgroundColor: filterType === type ? theme.accent : theme.primary
            }
            ]}
            onPress={() => setFilterType(type)}
            >
            <Text style={{ 
                color: filterType === type ? '#FFF' : theme.text, 
                fontSize: 12, 
                fontWeight: filterType === type ? 'bold' : 'normal',
                textTransform: 'capitalize' 
            }}>
                {type === 'day' ? 'Dia' : type === 'week' ? 'Semana' : type === 'month' ? 'Mês' : 'Ano'}
            </Text>
            </TouchableOpacity>
        ))}
        </View>

      {/* 2. Navegação de Datas */}
      <View style={styles.dateNavRow}>
        <TouchableOpacity onPress={() => changeDate('prev')}><ChevronLeft size={24} color={theme.text} /></TouchableOpacity>
        <Text style={[styles.dateLabel, { color: theme.text }]}>{dateRangeLabel}</Text>
        <TouchableOpacity onPress={() => changeDate('next')}><ChevronRight size={24} color={theme.text} /></TouchableOpacity>
      </View>

        {/* 3. Gráfico Dinâmico */}
        {/* 3. Gráfico Dinâmico Corrigido */}
        <View style={styles.chartContainer}>
<PieChart
    data={chartData}
    donut
    radius={90}
    innerRadius={65}
    innerCircleColor={theme.background}
    strokeWidth={2}
    strokeColor={'#000'}
    showText
    textColor={theme.text}
    textSize={20}
    labelsPosition='onBorder' // Mantemos na borda e usamos o 'shift' para entrar
    
    
    centerLabelComponent={() => (
        <View style={{ justifyContent: 'center', alignItems: 'center', width: 120 }}>
            <Text 
                numberOfLines={1}
                adjustsFontSizeToFit 
                style={[styles.totalAmount, { color: theme.text, fontSize: 22, textAlign: 'center' }]}
            >
                - R$ {totalAmount.toFixed(2).replace('.', ',')}
            </Text>
        </View>
    )}
/>
        </View>

        {/* 4. Lista de Gastos (Cards Clicáveis) */}
        <View style={[styles.listContainer, { backgroundColor: theme.card }]}>
        <ScrollView 
            showsVerticalScrollIndicator={true} // 1. Ative o indicador
            indicatorStyle={theme.background ? 'white' : 'black'} // 2. Opcional: Ajusta a cor conforme o tema
            contentContainerStyle={{ 
            paddingRight: 15, // 3. O "Pulo do gato": Espaço para a barra de scroll não sobrepor os cards
            paddingLeft: 5,   // Equilíbrio visual
            paddingBottom: 20 // Espaço extra no final da lista
            }}
        >
            {transactions.length === 0 ? (
            <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20, opacity: 0.6 }}>
                Nenhuma despesa neste período.
            </Text>
            ) : (
            transactions.map((item) => (
                <TouchableOpacity key={item.id} onPress={() => handleOpenDetail(item)}>
                <View style={[styles.itemCard, { backgroundColor: theme.primary }]}>
                    
                    <View style={styles.iconBox}>
                    <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ color: theme.text, fontWeight: 'bold', textAlign: 'center' }}>
                        - R$ {item.amount.toFixed(2).replace('.', ',')}
                    </Text>
                    <Text style={{ color: theme.text, fontSize: 12, opacity: 0.7, textAlign: 'center' }}>
                        {item.categoryName}
                    </Text>
                    </View>

                    <View style={{ width: 40 }} /> 
                </View>
                </TouchableOpacity>
            ))
            )}
        </ScrollView>
        </View>

        {/* 5. Botão Adicionar */}
        <TouchableOpacity 
        style={[commonStyles.buttonBase, styles.addBtn, { backgroundColor: theme.primary }]}
        onPress={() => {
            setEditingTransaction(null); // GARANTE que abra limpo para um novo gasto
            setAddModalVisible(true);
        }}
        >
        <Text style={[commonStyles.buttonText, { color: theme.text }]}>Adicionar Despesa</Text>
        </TouchableOpacity>

        {/* 6. Modais */}
        <AddExpenseModal 
        visible={addModalVisible} 
        onClose={() => {
            setAddModalVisible(false);
            setEditingTransaction(null); // Limpa o estado ao fechar
        }} 
        onSave={loadData} 
        editingTransaction={editingTransaction} // PASSE A PROP AQUI
        />

        <TransactionDetailModal 
        visible={detailVisible}
        transaction={selectedTransaction}
        onClose={() => setDetailVisible(false)}
        onDelete={handleDelete}
        onEdit={handleEdit} // CHAME A FUNÇÃO AQUI
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
  dateNavRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 100 },
  dateLabel: { fontSize: 14, fontWeight: '500' },
  chartContainer: { alignItems: 'center', marginBottom: 20 },
  donutInner: { width: 160, height: 160, borderRadius: 80, borderWidth: 15, justifyContent: 'center', alignItems: 'center' },
  totalAmount: { fontSize: 24, fontWeight: 'bold' },
  listContainer: { flex: 1, borderRadius: 25, padding: 15, paddingHorizontal:20, marginBottom: 15, marginHorizontal:20 },
  itemCard: { flexDirection: 'row', padding: 12, borderRadius: 15, alignItems: 'center', marginBottom: 10,shadowColor: "#000",shadowOffset: { width: 0, height: 3 },shadowOpacity: 0.25,shadowRadius: 3.84,elevation: 5, },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(161, 194, 184, 0.51)', justifyContent: 'center', alignItems: 'center' },
  addBtn: { paddingVertical: 15, borderRadius: 20, marginBottom: 15, marginHorizontal:20 },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around' },
  tabItem: { paddingVertical: 10, paddingHorizontal: 20 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#FFF' }
});