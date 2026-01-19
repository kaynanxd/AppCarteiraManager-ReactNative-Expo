import { View, Text, StyleSheet } from 'react-native';

export function SummaryCards({ expenses, income, balance, theme }: any) {
  const format = (val: number) => Math.abs(val).toFixed(2).replace('.', ',');

  return (
    <View style={styles.row}>
      <View style={[styles.card, { backgroundColor: theme.preview[0] }]}>
        <Text style={[styles.title, { color: theme.text }]}>Ganhos</Text>
        <Text 
          numberOfLines={1} 
          adjustsFontSizeToFit 
          minimumFontScale={0.8}
          style={[styles.value, { color: theme.text }]}
        >
          + R$ {format(income)}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.preview[1] }]}>
        <Text style={[styles.title, { color: theme.text }]}>Despesas</Text>
        <Text 
          numberOfLines={1} 
          adjustsFontSizeToFit 
          minimumFontScale={0.8}
          style={[styles.value, { color: theme.text }]}
        >
          - R$ {format(expenses)}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.preview[2] }]}>
        <Text style={[styles.title, { color: theme.text }]}>Saldo</Text>
        <Text 
          numberOfLines={1} 
          adjustsFontSizeToFit 
          minimumFontScale={0.8}
          style={[styles.value, { color: theme.text }]}
        >
          {balance >= 0 ? '+ ' : '- '} R$ {format(balance)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { 
    flexDirection: 'row', 
    gap: 8, 
    marginHorizontal: 20, 
    marginBottom: 15 
  },
  card: { 
    flex: 1, 
    paddingVertical: 12, 
    paddingHorizontal: 4, 
    borderRadius: 15, 
    alignItems: 'center', 
    elevation: 3 
  },
  title: { fontSize: 13, fontWeight: 'bold', opacity: 0.8 }, 
  value: { fontSize: 12, fontWeight: 'bold', marginTop: 4 } 
});