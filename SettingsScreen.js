import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmergencyContactsSection from './components/EmergencyContactsSection';
import SafeSignalGestureSection from './components/SafeSignalGestureSection';
import AlertTemplatesSection from './components/AlertTemplatesSection';
import VoiceSettingsSection from './components/VoiceSettingsSection';
import DecoyScreenSection from './components/DecoyScreenSection';
import PrivacySection from './components/PrivacySection';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    emergencyContacts: [],
    selectedGesture: 'shake',
    alertTemplate: 'Emergency at [LOCATION]. Please check on me immediately.',
    voiceType: 'female',
    voiceTone: 'concerned',
    decoyScreen: 'calculator',
    autoDelete: '24hours',
    locationSharing: 'contacts',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem('appSettings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Configure your safety preferences</Text>
      </View>

      <EmergencyContactsSection
        contacts={settings.emergencyContacts}
        onUpdateContacts={(contacts) => saveSettings({ emergencyContacts: contacts })}
      />

      <SafeSignalGestureSection
        selectedGesture={settings.selectedGesture}
        onGestureChange={(gesture) => saveSettings({ selectedGesture: gesture })}
      />

      <AlertTemplatesSection
        alertTemplate={settings.alertTemplate}
        contacts={settings.emergencyContacts}
        onTemplateChange={(template) => saveSettings({ alertTemplate: template })}
      />

      <VoiceSettingsSection
        voiceType={settings.voiceType}
        voiceTone={settings.voiceTone}
        onVoiceChange={(type, tone) =>
          saveSettings({ voiceType: type, voiceTone: tone })
        }
      />

      <DecoyScreenSection
        selectedDecoy={settings.decoyScreen}
        onDecoyChange={(decoy) => saveSettings({ decoyScreen: decoy })}
      />

      <PrivacySection
        autoDelete={settings.autoDelete}
        locationSharing={settings.locationSharing}
        onPrivacyChange={(privacy) => saveSettings(privacy)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#5B4FE9',
    padding: 20,
    paddingTop: 60, // iOS status bar
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0DFFF',
  },
});

export default SettingsScreen;