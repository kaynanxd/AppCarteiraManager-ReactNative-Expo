import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { commonStyles } from './AppComponents';
import { database, updateTransaction } from '../services/database';
import { AddCategoryModal} from './AddCategoryModal';
import { AlertButton } from 'react-native';

export function AddExpenseModal({ visible, onClose, onSave, editingTransaction, activeMode }: any) {
  const { theme } = useTheme();
  const [value, setValue] = useState('0,00'); 
  const [comment, setComment] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const handleDeleteCategory = (categoryId: number, categoryName: string) => {
    Alert.alert(
      "Excluir Categoria",
      `Deseja realmente excluir a categoria "${categoryName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: () => {
            try {
              const usage: any = database.getFirstSync(
                'SELECT COUNT(*) as count FROM transactions WHERE category_id = ?', 
                [categoryId]
              );

              if (usage.count > 0) {
                Alert.alert("Erro", "Não é possível excluir uma categoria que possui gastos registrados.");
                return;
              }

              database.runSync('DELETE FROM categories WHERE id = ?', [categoryId]);
              fetchCategories(); 
            } catch (error) {
              Alert.alert("Erro", "Ocorreu um problema ao tentar excluir.");
            }
          } 
        }
      ]
    );
  };

  const fetchCategories = () => {
    const data: any = database.getAllSync('SELECT * FROM categories');
    setCategories([...data, { id: 'add', name: 'Adicionar', icon: '+' }]);
  };

  const formatInputValue = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const numberValue = parseInt(cleaned || '0', 10) / 100;
    
    return numberValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    if (visible) {
      fetchCategories();
      const data: any = database.getAllSync('SELECT * FROM categories');
      setCategories([...data, { id: 'add', name: 'Adicionar', icon: '+' }]);

      if (editingTransaction) {
        const absValue = Math.abs(editingTransaction.amount);
        setValue(absValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
        setComment(editingTransaction.comment || '');
        setSelectedCategory(editingTransaction.category_id);
      } else {
        setValue('0,00');
        setComment('');
        setSelectedCategory(null);
      }
    }
  }, [visible, editingTransaction]);

  const handleSave = () => {
    const numericString = value.replace(/\./g, '').replace(',', '.');
    let numValue = parseFloat(numericString);

    if (isNaN(numValue) || numValue === 0 || !selectedCategory) {
      Alert.alert("Erro", "Preencha um valor válido e escolha uma categoria.");
      return;
    }

    if (activeMode === 'Despesas') {
      numValue = -Math.abs(numValue);
    } else {
      numValue = Math.abs(numValue);
    }

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, numValue, comment, selectedCategory);
    } else {
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
            {editingTransaction ? 'Editar' : 'Novo'} {activeMode}
          </Text>

          <Text style={[styles.label, { color: theme.text }]}>Valor R$ :</Text>
          
          <View style={[styles.inputContainer, { backgroundColor: theme.primary }]}>
            <Text style={[styles.currencyPrefix, { color: activeMode === 'Ganhos' ? '#5d965f' : '#c47e79' }]}>
              {activeMode === 'Ganhos' ? '+' : '-'} R$
            </Text>
            <TextInput 
              style={[styles.maskedInput, { color: theme.text }]}
              keyboardType="numeric"
              value={value}
              onChangeText={(text) => setValue(formatInputValue(text))}
              placeholder="0,00"
              placeholderTextColor="rgba(255,255,255,0.3)"
            />
          </View>

          <Text style={[styles.label, { color: theme.text }]}>Comentário :</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: theme.primary, color: theme.text }]}
            value={comment}
            onChangeText={setComment}
            placeholder="Digite aqui"
            placeholderTextColor="rgba(0, 0, 0, 0.54)"
          />

          <Text style={[styles.label, { color: theme.text, textAlign: 'center' }]}>Categoria</Text>
                    <View style={[styles.categoryContainer, { backgroundColor: theme.primary }]}>
                      <FlatList
                        data={categories}
                        numColumns={4}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={[styles.categoryItem, selectedCategory === item.id && styles.selectedItem]}
                            onPress={() => {
                              if (item.id === 'add') {
                                setCategoryModalVisible(true);
                              } else {
                                setSelectedCategory(item.id);
                              }
                            }}
                            onLongPress={() => {
                    if (item.id !== 'add') {
                      handleDeleteCategory(item.id, item.name);
                    }
                  }}
                  delayLongPress={500}            
                          >
                            <View style={[styles.iconCircle,{ backgroundColor: theme.iconBackground }, selectedCategory === item.id && { borderColor: theme.text, borderWidth: 2 }]}>
                              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
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
                {editingTransaction ? 'Salvar Alterações' : 'Confirmar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={{color: theme.text, textAlign: 'center', marginTop: 10, opacity: 0.6}}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AddCategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onSave={fetchCategories} 
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', padding: 25, borderRadius: 25, gap: 10 },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 5 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 15, 
    paddingHorizontal: 12 
  },
  currencyPrefix: { fontSize: 16, fontWeight: 'bold', marginRight: 5 },
  maskedInput: { flex: 1, paddingVertical: 12, fontSize: 18, fontWeight: 'bold' },
  input: { borderRadius: 15, padding: 12, fontSize: 16 },
  categoryContainer: { height: 180, borderRadius: 15, padding: 10 },
  categoryItem: { flex: 1, alignItems: 'center', margin: 5, padding: 5, borderRadius: 10 },
  selectedItem: { backgroundColor: 'rgba(255,255,255,0.1)' },
  iconCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(123, 198, 126, 0.3)', justifyContent: 'center', alignItems: 'center' },
  categoryName: { fontSize: 10, marginTop: 4, textAlign: 'center' },
  saveBtn: { paddingVertical: 15, marginTop: 10 },
});