import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { commonStyles } from './AppComponents';

export function TransactionDetailModal({ visible, transaction, onClose, onDelete, onEdit }: any) {
  const { theme } = useTheme();

  if (!transaction) return null;

  const formattedDate = new Date(transaction.date).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          
          <Text style={[styles.categoryTitle, { color: theme.text }]}>{transaction.categoryName}</Text>
          
          <View style={[styles.iconCircle,{ backgroundColor: theme.iconBackground}]}>
            <Text style={{ fontSize: 30 }}>{transaction.icon}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={[styles.label, { color: theme.text }]}>Valor R$ :</Text>
            <View style={[styles.infoBox, { backgroundColor: theme.primary }]}>
              <Text style={{ color: theme.text }}>- R$ {transaction.amount.toFixed(2)}</Text>
            </View>

            <Text style={[styles.label, { color: theme.text }]}>Horario :</Text>
            <View style={[styles.infoBox, { backgroundColor: theme.primary }]}>
              <Text style={{ color: theme.text }}>{formattedDate.replace(',', ' as')}</Text>
            </View>

            <Text style={[styles.label, { color: theme.text }]}>Comentario :</Text>
            <View style={[styles.commentBox, { backgroundColor: theme.primary }]}>
              <Text style={{ color: theme.text, textAlign: 'center' }}>
                {transaction.comment || "Sem comentário"}
              </Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[commonStyles.buttonBase, styles.actionBtn, { backgroundColor: theme.primary }]}
              onPress={() => { onEdit(transaction); onClose(); }}
            >
              <Text style={{ color: theme.text }}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[commonStyles.buttonBase, styles.actionBtn, { backgroundColor: theme.primary }]}
              onPress={() => { onDelete(transaction.id); onClose(); }}
            >
              <Text style={{ color: theme.text }}>Excluir</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose} style={{ marginTop: 15 }}>
            <Text style={{ color: theme.text, opacity: 0.6 }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', padding: 25, borderRadius: 25, alignItems: 'center' },
  categoryTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  iconCircle: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1 },
  infoSection: { width: '100%', gap: 8, marginBottom: 25 },
  label: { fontSize: 14, textAlign: 'center' },
  infoBox: { width: '100%', padding: 12, borderRadius: 15, alignItems: 'center' },
  commentBox: { width: '100%', padding: 20, borderRadius: 15, minHeight: 80, justifyContent: 'center' },
  buttonRow: { flexDirection: 'row', gap: 15, width: '100%' },
  actionBtn: { flex: 1, paddingVertical: 12 },
});