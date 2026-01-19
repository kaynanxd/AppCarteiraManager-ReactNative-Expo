import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from "react-native-gifted-charts";

export function ExpenseChart({ chartData, totalAmount, activeMode, theme }: any) {
  return (
    <View style={styles.chartContainer}>
      <PieChart
        data={chartData}
        donut
        radius={96}
        innerRadius={60}
        innerCircleColor={theme.primary}
        innerCircleBorderWidth={2}
        innerCircleBorderColor={"#000"}
        strokeWidth={2}
        strokeColor="#000"
      />

      <View style={[StyleSheet.absoluteFill, styles.overlayCenter]} pointerEvents="none">
        <PieChart
          data={chartData.map((item: any) => ({ ...item, color: 'transparent' }))}
          donut
          radius={80}
          innerRadius={0}
          showText
          textColor={theme.text}
          textSize={18}
          labelsPosition="onBorder"
        />
      </View>

      <View style={styles.centerLabel}>
        <Text style={[styles.totalAmount, { color: theme.text }]}>
          {activeMode === 'Geral' ? (totalAmount >= 0 ? '+ ' : '- ') : (activeMode === 'Ganhos' ? '+ ' : '- ')} 
          R$ {Math.abs(totalAmount).toFixed(2).replace('.', ',')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalAmount: { 
    fontSize: 18,
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
});