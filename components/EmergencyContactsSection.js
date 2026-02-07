import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Switch,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms';

const EmergencyContactsSection = ({ contacts, onUpdateContacts }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
    autoNotify: true,
  });

  const openAddContact = () => {
    setEditingContact(null);
    setFormData({ name: '', phone: '', relationship: '', autoNotify: true });
    setModalVisible(true);
  };

  const openEditContact = (contact, index) => {
    setEditingContact(index);
    setFormData(contact);
    setModalVisible(true);
  };

  const pickFromContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          // For simplicity, pick first contact. In production, show a picker UI
          const contact = data[0];
          const phoneNumber = contact.phoneNumbers?.[0]?.number || '';
          setFormData({
            ...formData,
            name: contact.name || '',
            phone: phoneNumber,
          });
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to access contacts');
    }
  };

  const saveContact = () => {
    if (!formData.name || !formData.phone) {
      Alert.alert('Error', 'Please fill in name and phone number');
      return;
    }

    if (contacts.length >= 5 && editingContact === null) {
      Alert.alert('Limit Reached', 'You can only add up to 5 emergency contacts');
      return;
    }

    const updatedContacts = [...contacts];
    if (editingContact !== null) {
      updatedContacts[editingContact] = formData;
    } else {
      updatedContacts.push(formData);
    }

    onUpdateContacts(updatedContacts);
    setModalVisible(false);
    Alert.alert('Success', 'Emergency contact saved');
  };

  const deleteContact = (index) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to remove this emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedContacts = contacts.filter((_, i) => i !== index);
            onUpdateContacts(updatedContacts);
          },
        },
      ]
    );
  };

  const testAlert = async (contact) => {
    try {
      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'SMS is not available on this device');
        return;
      }

      const message = `This is a test alert from your SafetyApp. Your emergency contact is set up correctly!`;
      
      const { result } = await SMS.sendSMSAsync([contact.phone], message);
      
      if (result === 'sent') {
        Alert.alert('Test Sent', `Test alert sent to ${contact.name}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send test alert: ' + error.message);
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Emergency Contacts</Text>
      <Text style={styles.sectionSubtitle}>
        Add up to 5 trusted contacts who will be notified in emergencies
      </Text>

      {contacts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No emergency contacts added yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Tap below to add your first contact
          </Text>
        </View>
      ) : (
        contacts.map((contact, index) => (
          <View key={index} style={styles.contactCard}>
            <View style={styles.contactHeader}>
              <Text style={styles.contactName}>👤 {contact.name}</Text>
              <TouchableOpacity onPress={() => deleteContact(index)}>
                <Text style={styles.deleteButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.contactPhone}>{contact.phone}</Text>
            <Text style={styles.contactRelationship}>
              Relationship: {contact.relationship || 'Not specified'}
            </Text>
            <View style={styles.contactActions}>
              <TouchableOpacity
                style={styles.testButton}
                onPress={() => testAlert(contact)}
              >
                <Text style={styles.testButtonText}>Test Alert</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => openEditContact(contact, index)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.autoNotifyContainer}>
              <Text style={styles.autoNotifyText}>Auto-notify in Walking Mode</Text>
              <Switch
                value={contact.autoNotify}
                onValueChange={(value) => {
                  const updatedContacts = [...contacts];
                  updatedContacts[index].autoNotify = value;
                  onUpdateContacts(updatedContacts);
                }}
              />
            </View>
          </View>
        ))
      )}

      {contacts.length < 5 && (
        <TouchableOpacity style={styles.addButton} onPress={openAddContact}>
          <Text style={styles.addButtonText}>+ Add Emergency Contact</Text>
        </TouchableOpacity>
      )}

      {/* Add/Edit Contact Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingContact !== null ? 'Edit Contact' : 'Add Emergency Contact'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Name *"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number *"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Relationship (e.g., Parent, Friend)"
              value={formData.relationship}
              onChangeText={(text) => setFormData({ ...formData, relationship: text })}
            />

            <TouchableOpacity style={styles.pickContactButton} onPress={pickFromContacts}>
              <Text style={styles.pickContactText}>📱 Pick from Contacts</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveContact}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
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
    marginTop: 10,
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
    marginBottom: 15,
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#bbb',
  },
  contactCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    fontSize: 24,
    color: '#ff4444',
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 16,
    color: '#5B4FE9',
    marginBottom: 5,
  },
  contactRelationship: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  testButton: {
    backgroundColor: '#5B4FE9',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  testButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  autoNotifyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  autoNotifyText: {
    fontSize: 14,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#5B4FE9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  pickContactButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  pickContactText: {
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#5B4FE9',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default EmergencyContactsSection;