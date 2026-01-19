import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FilterType } from '../utils/dateUtils';

interface PeriodSelectorProps {
  filterType: FilterType;
  onSelect: (type: FilterType) => void;
  theme: any;
}

export function PeriodSelector({ filterType, onSelect, theme }: PeriodSelectorProps) {
  const periods: { key: FilterType; label: string }[] = [
    { key: 'day', label: 'Dia' },
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mês' },
    { key: 'year', label: 'Ano' },
  ];

  return (
    <View style={[styles.filterRow, { backgroundColor: theme.card }]}>
      {periods.map((p) => (
        <TouchableOpacity
          key={p.key}
          style={[
            styles.filterBtn, 
            { backgroundColor: filterType === p.key ? theme.accent : theme.primary }
          ]}
          onPress={() => onSelect(p.key)}
        >
          <Text style={{ 
            color: filterType === p.key ? '#FFF' : theme.text, 
            fontSize: 12, 
            fontWeight: filterType === p.key ? 'bold' : 'normal',
            textTransform: 'capitalize' 
          }}>
            {p.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  filterRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 20,
    marginHorizontal: 20,
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
});