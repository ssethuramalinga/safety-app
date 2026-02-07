import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PrivacySection = ({ autoDelete, locationSharing, onPrivacyChange }) => {
  const [clearing, setClearing] = useState(false);

  const autoDeleteOptions = [
    {
      id: '24hours',
      label: '24 hours',
      description: 'Delete location history after 1 day',
    },
    {
      id: '7days',
      label: '7 days',
      description: 'Keep location history for a week',
    },
    {
      id: 'never',
      label: 'Never delete',
      description: 'Manually manage location data',
    },
  ];

  const locationSharingOptions = [
    {
      id: 'contacts',
      label: 'Emergency contacts only',
      icon: '👥',
      description: 'Only your saved contacts can see your location',
    },
    {
      id: 'anonymous',
      label: 'Anonymous safety network',
      icon: '🌐',
      description: 'Share anonymously with nearby app users (coming soon)',
      disabled: true,
    },
    {
      id: 'campus',
      label: 'Campus security only',
      icon: '🏫',
      description: 'Only campus police can track your location',
    },
  ];

  const selectAutoDelete = (option) => {
    onPrivacyChange({ autoDelete: option });
    Alert.alert('Setting Updated', `Location history will be deleted after: ${autoDeleteOptions.find(o => o.id === option)?.label}`);
  };

  const selectLocationSharing = (option) => {
    if (locationSharingOptions.find(o => o.id === option)?.disabled) {
      Alert.alert('Coming Soon', 'This feature will be available in a future update');
      return;
    }
    
    onPrivacyChange({ locationSharing: option });
    Alert.alert('Setting Updated', `Location sharing set to: ${locationSharingOptions.find(o => o.id === option)?.label}`);
  };

  const clearAllLocationData = async () => {
    Alert.alert(
      'Clear All Location Data',
      'This will permanently delete all saved location history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setClearing(true);
              // In production, this would call your backend to delete location data
              await AsyncStorage.removeItem('locationHistory');
              
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              Alert.alert('Success', 'All location data has been deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete location data');
            } finally {
              setClearing(false);
            }
          },
        },
      ]
    );
  };

  const exportLocationData = async () => {
    Alert.alert(
      'Export Data',
      'Download a copy of your location history',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            // In production, this would generate and download a file
            Alert.alert('Coming Soon', 'Data export feature will be available in a future update');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🔒 Privacy Settings</Text>
      <Text style={styles.sectionSubtitle}>
        Control how your location data is stored and shared
      </Text>

      {/* Auto-Delete Location History */}
      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Location History</Text>
        {autoDeleteOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              autoDelete === option.id && styles.optionCardSelected,
            ]}
            onPress={() => selectAutoDelete(option.id)}
          >
            <View style={styles.radioButton}>
              {autoDelete === option.id && <View style={styles.radioButtonSelected} />}
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Clear All Data Button */}
      <TouchableOpacity
        style={[styles.dangerButton, clearing && styles.dangerButtonDisabled]}
        onPress={clearAllLocationData}
        disabled={clearing}
      >
        <Text style={styles.dangerButtonText}>
          {clearing ? 'Deleting...' : '🗑️ Clear All Location Data Now'}
        </Text>
      </TouchableOpacity>

      {/* Location Sharing Settings */}
      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Walking Mode Visibility</Text>
        <Text style={styles.subsectionDescription}>
          Who can see your location when Walking Mode is active
        </Text>
        {locationSharingOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.sharingCard,
              locationSharing === option.id && styles.sharingCardSelected,
              option.disabled && styles.sharingCardDisabled,
            ]}
            onPress={() => selectLocationSharing(option.id)}
            disabled={option.disabled}
          >
            <View style={styles.sharingHeader}>
              <View style={styles.radioButton}>
                {locationSharing === option.id && <View style={styles.radioButtonSelected} />}
              </View>
              <Text style={styles.sharingIcon}>{option.icon}</Text>
              <View style={styles.sharingContent}>
                <View style={styles.sharingLabelContainer}>
                  <Text style={styles.sharingLabel}>{option.label}</Text>
                  {option.disabled && (
                    <Text style={styles.comingSoonBadge}>Coming Soon</Text>
                  )}
                </View>
                <Text style={styles.sharingDescription}>{option.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Data Export */}
      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Your Data</Text>
        <TouchableOpacity style={styles.exportButton} onPress={exportLocationData}>
          <Text style={styles.exportButtonText}>📥 Export Location History</Text>
        </TouchableOpacity>
      </View>

      {/* Privacy Information */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>🛡️ Your Privacy Matters</Text>
        <Text style={styles.infoText}>
          • Location data is encrypted end-to-end{'\n'}
          • Only you control who sees your location{'\n'}
          • No location tracking when app is closed{'\n'}
          • Data is never sold to third parties{'\n'}
          • You can delete all data at any time
        </Text>
      </View>

      {/* GDPR/Privacy Compliance */}
      <View style={styles.complianceSection}>
        <Text style={styles.complianceTitle}>Data Protection</Text>
        <Text style={styles.complianceText}>
          We comply with GDPR, CCPA, and other privacy regulations. Your location data is
          processed only for safety purposes and is never shared without your explicit
          consent.
        </Text>
        <TouchableOpacity>
          <Text style={styles.privacyPolicyLink}>Read full Privacy Policy →</Text>
        </TouchableOpacity>
      </View>

      {/* Last Location Update Info */}
      <View style={styles.statusBox}>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Location Services:</Text>
          <Text style={styles.statusValue}>✅ Active</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Last Update:</Text>
          <Text style={styles.statusValue}>{new Date().toLocaleTimeString()}</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Storage Used:</Text>
          <Text style={styles.statusValue}>2.3 MB</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 1,
    marginBottom: 40,
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
  subsection: {
    marginBottom: 25,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  subsectionDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  optionCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: '#5B4FE9',
    backgroundColor: '#F0EEFF',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#5B4FE9',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5B4FE9',
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  optionDescription: {
    fontSize: 13,
    color: '#666',
  },
  dangerButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 25,
  },
  dangerButtonDisabled: {
    backgroundColor: '#ffaaaa',
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  sharingCard: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sharingCardSelected: {
    borderColor: '#5B4FE9',
    backgroundColor: '#F0EEFF',
  },
  sharingCardDisabled: {
    opacity: 0.5,
  },
  sharingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sharingIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  sharingContent: {
    flex: 1,
  },
  sharingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  sharingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  comingSoonBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FF9800',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  sharingDescription: {
    fontSize: 13,
    color: '#666',
  },
  exportButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  exportButtonText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 22,
  },
  complianceSection: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  complianceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  complianceText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 10,
  },
  privacyPolicyLink: {
    fontSize: 13,
    color: '#5B4FE9',
    fontWeight: '600',
  },
  statusBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

export default PrivacySection;