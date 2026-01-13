import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { commonStyles } from './AppComponents';
import { database, updateTransaction } from '../services/database';

export function AddExpenseModal({ visible, onClose, onSave, editingTransaction }: any) {
  const { theme } = useTheme();
  const [value, setValue] = useState('');
  const [comment, setComment] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      // Carrega categorias do banco
      const data: any = database.getAllSync('SELECT * FROM categories');
      setCategories([...data, { id: 'add', name: 'Adicionar', icon: '+' }]);

      // Se estiver editando, preenche os estados com os valores antigos
      if (editingTransaction) {
        setValue(editingTransaction.amount.toString());
        setComment(editingTransaction.comment || '');
        setSelectedCategory(editingTransaction.category_id);
      } else {
        // Se for novo, limpa tudo
        setValue('');
        setComment('');
        setSelectedCategory(null);
      }
    }
  }, [visible, editingTransaction]);

  const handleSave = () => {
    if (!value || !selectedCategory) {
      Alert.alert("Erro", "Preencha o valor e escolha uma categoria.");
      return;
    }

    const numValue = parseFloat(value.replace(',', '.'));

    if (editingTransaction) {
      // Lógica de Atualização
      updateTransaction(editingTransaction.id, numValue, comment, selectedCategory);
    } else {
      // Lógica de Inserção
      database.runSync(
        'INSERT INTO transactions (amount, comment, category_id, date) VALUES (?, ?, ?, ?)',
        [numValue, comment, selectedCategory, new Date().toISOString()]
      );
    }
    
    onSave(); 
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            {editingTransaction ? 'Editar Despesa' : 'Nova Despesa'}
          </Text>

          <Text style={[styles.label, { color: theme.text }]}>Valor R$ :</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: theme.primary, color: theme.text }]}
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
            placeholder="0,00"
            placeholderTextColor="rgba(255,255,255,0.3)"
          />

          <Text style={[styles.label, { color: theme.text }]}>Comentario :</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: theme.primary, color: theme.text }]}
            value={comment}
            onChangeText={setComment}
            placeholder="Digite o comentario aqui"
            placeholderTextColor="rgba(255,255,255,0.3)"
          />

          <Text style={[styles.label, { color: theme.text, textAlign: 'center' }]}>Escolha a categoria</Text>
          <View style={[styles.categoryContainer, { backgroundColor: theme.primary }]}>
            <FlatList 
              data={categories}
              numColumns={4}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.categoryItem, selectedCategory === item.id && styles.selectedItem]}
                  onPress={() => item.id === 'add' ? alert('Lógica de criar categoria') : setSelectedCategory(item.id)}
                >
                  <View style={[styles.iconCircle, selectedCategory === item.id && { borderColor: theme.text }]}>
                    <Text style={{fontSize: 20}}>{item.icon}</Text>
                  </View>
                  <Text style={[styles.categoryName, { color: theme.text }]}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <TouchableOpacity 
            style={[commonStyles.buttonBase, styles.saveBtn, { backgroundColor: theme.primary }]}
            onPress={handleSave}
          >
            <Text style={[commonStyles.buttonText, { color: theme.text }]}>
                {editingTransaction ? 'Salvar Alterações' : 'Adicionar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={{color: theme.text, textAlign: 'center', marginTop: 10, opacity: 0.6}}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', padding: 25, borderRadius: 25, gap: 10 },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 5 },
  input: { borderRadius: 15, padding: 12, fontSize: 16, textAlign: 'center' },
  categoryContainer: { height: 180, borderRadius: 15, padding: 10 },
  categoryItem: { flex: 1, alignItems: 'center', margin: 5, padding: 5, borderRadius: 10 },
  selectedItem: { backgroundColor: 'rgba(255,255,255,0.2)' },
  iconCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#7BC67E', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  categoryName: { fontSize: 10, marginTop: 4 },
  saveBtn: { paddingVertical: 15, marginTop: 10 },
});