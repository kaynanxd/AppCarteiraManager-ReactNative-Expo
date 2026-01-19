import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { useTheme } from '../src/context/ThemeContext';
import { LayoutBase } from '../src/components/LayoutBase';
import { commonStyles, HomeFooter } from '../src/components/AppComponents';
import { getNotes, addNote, deleteNote, updateNote, database } from '../src/services/database'; 
import { useFocusEffect } from 'expo-router';

export default function NotesScreen() {
  const { theme,isDark } = useTheme();
  const [notes, setNotes] = useState<any[]>([]);
  
  const [addVisible, setAddVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  const loadNotes = useCallback(() => {
    const data = getNotes();
    setNotes(data);
  }, []);

  useFocusEffect(useCallback(() => { loadNotes(); }, [loadNotes]));

  const handleOpenAdd = () => {
    setNewTitle('');
    setNewContent('');
    setEditingNoteId(null);
    setAddVisible(true);
  };

  const handleEdit = () => {
    if (selectedNote) {
      setNewTitle(selectedNote.title);
      setNewContent(selectedNote.content);
      setEditingNoteId(selectedNote.id);
      setDetailVisible(false); 
      setAddVisible(true);    
    }
  };

  const handleSave = () => {
    if (!newTitle || !newContent) {
      Alert.alert("Erro", "Título e descrição são obrigatórios.");
      return;
    }

    if (editingNoteId) {
      updateNote(editingNoteId, newTitle, newContent);
    } else {
      addNote(newTitle, newContent);
    }

    setNewTitle('');
    setNewContent('');
    setEditingNoteId(null);
    setAddVisible(false);
    loadNotes();
  };

  const handleDelete = (id: number) => {
    Alert.alert("Apagar Nota", "Deseja realmente excluir esta anotação?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Apagar", 
        style: "destructive", 
        onPress: () => {
          deleteNote(id);
          setDetailVisible(false);
          loadNotes();
        }
      }
    ]);
  };

  const openNote = (note: any) => {
    setSelectedNote(note);
    setDetailVisible(true);
  };

  return (
    <LayoutBase noScroll={true} footer={<HomeFooter />}>
      <Text style={[styles.screenTitle, { color: theme.text }]}>Minhas Anotações</Text>

      <View style={[styles.listContainer, { backgroundColor: theme.card }]}>
        <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.scrollContent}>
          {notes.length === 0 ? (
            <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20, opacity: 0.6 }}>
                Nenhuma anotação criada.
            </Text>
          ) : (
            notes.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.noteCard, { backgroundColor: theme.primary }]} 
                onPress={() => openNote(item)}
              >
                <View style={styles.cardInfo}>
                  <Text style={[styles.noteTitle, { color: theme.text }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.noteDate, { color: theme.text }]}>
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      <TouchableOpacity 
        style={[commonStyles.buttonBase, styles.addBtn, { backgroundColor: isDark ? theme.primary : theme.card }]}
        onPress={handleOpenAdd}
      >
        <Text style={[commonStyles.buttonText, { color: theme.text }]}>Adicionar Anotação</Text>
      </TouchableOpacity>

      {/* Modal de Adicionar/Editar */}
      <Modal visible={addVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
                {editingNoteId ? 'Editar Anotação' : 'Nova Anotação'}
            </Text>
            <TextInput 
              placeholder="Título" 
              placeholderTextColor="rgb(141, 141, 141)"
              style={[styles.input, { backgroundColor: theme.primary, color: theme.text }]}
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput 
              placeholder="Escreva Aqui" 
              placeholderTextColor="rgb(141, 141, 141)"
              multiline
              style={[styles.textArea, { backgroundColor: theme.primary, color: theme.text }]}
              value={newContent}
              onChangeText={setNewContent}
            />
            <TouchableOpacity 
              style={[commonStyles.buttonBase, styles.saveBtn, { backgroundColor: theme.primary }]} 
              onPress={handleSave}
            >
              <Text style={[commonStyles.buttonText, { color: theme.text }]}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAddVisible(false)}>
              <Text style={{ color: theme.text, textAlign: 'center', marginTop: 15, opacity: 0.6 }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Detalhes */}
      <Modal visible={detailVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{selectedNote?.title}</Text>
            
            <ScrollView style={styles.contentScroll}>
              <Text style={[styles.detailContent, { color: theme.text }]}>{selectedNote?.content}</Text>
            </ScrollView>

            <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[commonStyles.buttonBase, styles.actionBtn, { backgroundColor: theme.primary }]} 
                  onPress={handleEdit}
                >
                  <Text style={{ color: theme.text, fontWeight: 'bold' }}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[commonStyles.buttonBase, styles.actionBtn, { backgroundColor: theme.primary }]} // Vermelho suave
                  onPress={() => handleDelete(selectedNote?.id)}
                >
                  <Text style={{ color: theme.text, fontWeight: 'bold' }}>Apagar</Text>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={() => setDetailVisible(false)}>
              <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20, opacity: 0.6 }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LayoutBase>
  );
}

const styles = StyleSheet.create({
  screenTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 20, textAlign: 'center' },
  listContainer: { flex: 1, borderRadius: 25, padding: 15, marginHorizontal: 20, marginBottom: 20, elevation: 3 },
  scrollContent: { paddingBottom: 10 },
  noteCard: { flexDirection: 'row', padding: 18, borderRadius: 15, marginBottom: 10, elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  cardInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  noteTitle: { fontSize: 16, fontWeight: 'bold', flex: 1, marginRight: 10 },
  noteDate: { fontSize: 11, opacity: 0.6 },
  addBtn: { paddingVertical: 15, borderRadius: 20, marginBottom: 20, marginHorizontal: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', padding: 25, borderRadius: 25 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderRadius: 12, padding: 12, marginBottom: 10, fontSize: 16 },
  textArea: { borderRadius: 12, padding: 12, height: 300, textAlignVertical: 'top', fontSize: 16 },
  saveBtn: { marginTop: 10, height: 50 },
  contentScroll: { maxHeight: 400, marginVertical: 15 },
  detailContent: { fontSize: 16, lineHeight: 22 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  actionBtn: { flex: 1, height: 50 }
});