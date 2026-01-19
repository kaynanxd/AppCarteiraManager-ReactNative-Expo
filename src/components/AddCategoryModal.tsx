import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { commonStyles } from './AppComponents';
import { database } from '../services/database';

export function AddCategoryModal({ visible, onClose, onSave }: any) {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');

  const handleSave = () => {
    if (!name || !icon) {
      Alert.alert("Erro", "Preencha o nome e escolha um emoji para o ícone.");
      return;
    }

    try {
      database.runSync(
        'INSERT INTO categories (name, icon) VALUES (?, ?)',
        [name, icon]
      );
      setName('');
      setIcon('');
      onSave(); // Recarrega a lista de categorias no modal pai
      onClose();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a categoria.");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>Nova Categoria</Text>

          <Text style={[styles.label, { color: theme.text }]}>Nome da Categoria:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.primary, color: theme.text }]}
            value={name}
            onChangeText={setName}
            placeholder="Escreva aqui"
            placeholderTextColor="rgba(255,255,255,0.3)"
          />

          <Text style={[styles.label, { color: theme.text }]}>Ícone (Emoji):</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.primary, color: theme.text, fontSize: 24 }]}
            value={icon}
            onChangeText={(text) => setIcon(text.slice(0, 2))} 
            placeholder="🍰"
            placeholderTextColor="rgba(255,255,255,0.3)"
            textAlign="center"
          />

          <TouchableOpacity
            style={[commonStyles.buttonBase, styles.saveBtn, { backgroundColor: theme.primary }]}
            onPress={handleSave}
          >
            <Text style={[commonStyles.buttonText, { color: theme.text }]}>Salvar Categoria</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: theme.text, textAlign: 'center', marginTop: 15, opacity: 0.6 }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', padding: 25, borderRadius: 25, gap: 10 },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 5 },
  input: { borderRadius: 15, padding: 12, fontSize: 16 },
  saveBtn: { paddingVertical: 15, marginTop: 10 },
});