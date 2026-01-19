import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

export function DateNavigator({ label, onPrev, onNext, color }: any) {
  return (
    <View style={styles.dateNavRow}>
      <TouchableOpacity onPress={onPrev}>
        <ChevronLeft size={24} color={color} />
      </TouchableOpacity>
      
      <Text style={[styles.dateLabel, { color }]}>{label}</Text>
      
      <TouchableOpacity onPress={onNext}>
        <ChevronRight size={24} color={color} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  dateNavRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: -10, 
    paddingHorizontal: 100 
  },
  dateLabel: { 
    fontSize: 14, 
    fontWeight: '500', 
    textAlign: 'center'
  },
});