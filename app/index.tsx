import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Importe o router para navegar
import { useTheme } from '../context/ThemeContext';
import { LayoutBase } from '../components/LayoutBase';
import { StatBox, TopItem, commonStyles, HomeFooter } from '../components/AppComponents';


export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <LayoutBase footer={<HomeFooter />}>
      <View style={[styles.mainCard, { backgroundColor: theme.card }]}>
        <TouchableOpacity 
          onPress={() => router.push('/expenses')} // Navega para a planilha
          style={[commonStyles.buttonBase, styles.largeButton, { backgroundColor: theme.primary }]}
        >
          <Text style={[commonStyles.buttonText, { color: theme.text }]}>Planilha gastos</Text>
        </TouchableOpacity>
        
        <View style={styles.row}>
          <TouchableOpacity style={[commonStyles.buttonBase, styles.smallButton, { backgroundColor: theme.primary }]}>
            <Text style={[commonStyles.buttonText, { color: theme.text }]}>anotacoes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[commonStyles.buttonBase, styles.smallButton, { backgroundColor: theme.primary }]}>
            <Text style={[commonStyles.buttonText, { color: theme.text }]}>calendario</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
        <View style={[commonStyles.buttonBase, styles.summaryHeader, { backgroundColor: theme.primary }]}>
           <Text style={[commonStyles.buttonText, { color: theme.text, fontSize: 14 }]}>Resumo da semana</Text>
        </View>
        
        <View style={styles.statsRow}>
           <StatBox label="Despesas" value="-R$ 35,00" />
           <StatBox label="Ganhos" value="+R$ 50,00" />
           <StatBox label="Geral" value="+R$ 15,00" />
        </View>

        <Text style={[styles.topTitle, { color: theme.text }]}>Top 3 Maiores Gastos :</Text>
        
        <View style={styles.topThreeRow}>
           <TopItem label="Doces" />
           <TopItem label="Trufas" />
           <TopItem label="Pudim" />
        </View>
      </View>
    </LayoutBase> // CORRIGIDO AQUI
    
  );
}

const styles = StyleSheet.create({
  mainCard: { marginHorizontal:20, padding: 20, borderRadius: 25, gap: 15 },
  largeButton: { height: 130 },
  smallButton: { flex: 1, height: 110 },
  row: { flexDirection: 'row', gap: 15 },
  summaryCard: { marginHorizontal:20, padding: 20, borderRadius: 25, alignItems: 'center', marginTop: 30 },
  summaryHeader: { paddingHorizontal: 20, paddingVertical: 6, marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  topTitle: { fontSize: 15, marginBottom: 15, fontWeight: '500' },
  topThreeRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
});