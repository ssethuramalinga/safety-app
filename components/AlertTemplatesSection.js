import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';

const AlertTemplatesSection = ({ alertTemplate, contacts, onTemplateChange }) => {
  const [defaultMessage, setDefaultMessage] = useState(alertTemplate);
  const [customMessages, setCustomMessages] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContactId, setEditingContactId] = useState(null);
  const [tempMessage, setTempMessage] = useState('');

  const dynamicVariables = [
    { tag: '[LOCATION]', description: 'Your current GPS coordinates and address' },
    { tag: '[TIME]', description: 'Current time when alert is sent' },
    { tag: '[NAME]', description: 'Your name from profile' },
  ];

  const saveDefaultMessage = () => {
    if (!defaultMessage.trim()) {
      Alert.alert('Error', 'Message cannot be empty');
      return;
    }
    onTemplateChange(defaultMessage);
    Alert.alert('Success', 'Default message updated');
  };

  const openCustomMessageEditor = (contact, index) => {
    setEditingContactId(index);
    setTempMessage(customMessages[index] || defaultMessage);
    setModalVisible(true);
  };

  const saveCustomMessage = () => {
    if (!tempMessage.trim()) {
      Alert.alert('Error', 'Message cannot be empty');
      return;
    }

    const updated = { ...customMessages };
    updated[editingContactId] = tempMessage;
    setCustomMessages(updated);
    setModalVisible(false);
    Alert.alert('Success', 'Custom message saved');
  };

  const deleteCustomMessage = (index) => {
    Alert.alert(
      'Delete Custom Message',
      'This contact will receive the default message instead.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updated = { ...customMessages };
            delete updated[index];
            setCustomMessages(updated);
          },
        },
      ]
    );
  };

  const insertVariable = (variable) => {
    setTempMessage(tempMessage + ' ' + variable);
  };

  const getPreviewMessage = (message) => {
    let preview = message;
    preview = preview.replace('[LOCATION]', '123 Main St, City, State');
    preview = preview.replace('[TIME]', new Date().toLocaleTimeString());
    preview = preview.replace('[NAME]', 'Your Name');
    return preview;
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Alert Message Templates</Text>
      <Text style={styles.sectionSubtitle}>
        Customize what gets sent when SafeSignal is triggered
      </Text>

      {/* Default Message */}
      <View style={styles.messageContainer}>
        <Text style={styles.messageLabel}>Default message for all contacts:</Text>
        <TextInput
          style={styles.messageInput}
          multiline
          numberOfLines={4}
          value={defaultMessage}
          onChangeText={setDefaultMessage}
          placeholder="Enter your emergency message..."
        />
        
        <View style={styles.variablesContainer}>
          <Text style={styles.variablesTitle}>Available variables:</Text>
          {dynamicVariables.map((variable, index) => (
            <View key={index} style={styles.variableItem}>
              <Text style={styles.variableTag}>{variable.tag}</Text>
              <Text style={styles.variableDescription}>{variable.description}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveDefaultMessage}>
          <Text style={styles.saveButtonText}>Save Default Message</Text>
        </TouchableOpacity>

        {/* Preview */}
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Preview:</Text>
          <Text style={styles.previewText}>{getPreviewMessage(defaultMessage)}</Text>
        </View>
      </View>

      {/* Custom Messages Per Contact */}
      {contacts && contacts.length > 0 && (
        <View style={styles.customMessagesContainer}>
          <Text style={styles.customMessagesTitle}>Custom messages per contact:</Text>
          <Text style={styles.customMessagesSubtitle}>
            Optional: Set different messages for specific contacts
          </Text>

          {contacts.map((contact, index) => (
            <View key={index} style={styles.contactMessageCard}>
              <View style={styles.contactMessageHeader}>
                <Text style={styles.contactMessageName}>{contact.name}</Text>
                {customMessages[index] && (
                  <TouchableOpacity onPress={() => deleteCustomMessage(index)}>
                    <Text style={styles.deleteCustomMessage}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              {customMessages[index] ? (
                <View style={styles.customMessagePreview}>
                  <Text style={styles.customMessageText} numberOfLines={2}>
                    {customMessages[index]}
                  </Text>
                  <TouchableOpacity onPress={() => openCustomMessageEditor(contact, index)}>
                    <Text style={styles.editCustomMessage}>Edit</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addCustomMessageButton}
                  onPress={() => openCustomMessageEditor(contact, index)}
                >
                  <Text style={styles.addCustomMessageText}>
                    + Add custom message for {contact.name}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Custom Message Editor Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                Custom Message for{' '}
                {contacts && editingContactId !== null
                  ? contacts[editingContactId]?.name
                  : ''}
              </Text>

              <TextInput
                style={styles.modalInput}
                multiline
                numberOfLines={6}
                value={tempMessage}
                onChangeText={setTempMessage}
                placeholder="Enter custom message..."
              />

              <Text style={styles.insertVariableLabel}>Insert variable:</Text>
              <View style={styles.variableButtons}>
                {dynamicVariables.map((variable, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.variableButton}
                    onPress={() => insertVariable(variable.tag)}
                  >
                    <Text style={styles.variableButtonText}>{variable.tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalPreview}>
                <Text style={styles.previewLabel}>Preview:</Text>
                <Text style={styles.previewText}>{getPreviewMessage(tempMessage)}</Text>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={saveCustomMessage}
                >
                  <Text style={styles.modalSaveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  messageContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
  },
  messageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  messageInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  variablesContainer: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  variablesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  variableItem: {
    marginBottom: 8,
  },
  variableTag: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#5B4FE9',
  },
  variableDescription: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#5B4FE9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  previewContainer: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  previewLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 5,
  },
  previewText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  customMessagesContainer: {
    marginTop: 25,
  },
  customMessagesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  customMessagesSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 15,
  },
  contactMessageCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  contactMessageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactMessageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deleteCustomMessage: {
    fontSize: 20,
    color: '#ff4444',
    fontWeight: 'bold',
  },
  customMessagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customMessageText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  editCustomMessage: {
    fontSize: 14,
    color: '#5B4FE9',
    fontWeight: '600',
    marginLeft: 10,
  },
  addCustomMessageButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5B4FE9',
    borderStyle: 'dashed',
  },
  addCustomMessageText: {
    fontSize: 14,
    color: '#5B4FE9',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  insertVariableLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
  },
  variableButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  variableButton: {
    backgroundColor: '#E0DFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  variableButtonText: {
    fontSize: 13,
    color: '#5B4FE9',
    fontWeight: '600',
  },
  modalPreview: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalCancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  modalSaveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#5B4FE9',
    alignItems: 'center',
  },
  modalSaveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default AlertTemplatesSection;