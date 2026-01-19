import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export function TransactionCard({ item, onPress, theme }: any) {
  const isIncome = item.amount > 0;

  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View style={[styles.itemCard, { backgroundColor: theme.primary }]}>
        <View style={[styles.iconBox, { backgroundColor: theme.iconBackground }]}>
          <Text style={{ fontSize: 20 }}>{item.icon}</Text>
        </View>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ color: theme.text, fontWeight: 'bold' }}>
            {isIncome ? '+ ' : '- '} R$ {Math.abs(item.amount).toFixed(2).replace('.', ',')}
          </Text>
          <Text style={{ color: theme.text, fontSize: 12, opacity: 0.6 }}>
            {item.categoryName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemCard: { 
    flexDirection: 'row', 
    padding: 12, 
    borderRadius: 15, 
    alignItems: 'center', 
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3
  },
  iconBox: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});