import { Accelerometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SMS from 'expo-sms';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { AppState } from 'react-native';

/**
 * Background Gesture Detection Service
 * Monitors for emergency gestures even when app is in background
 */

class GestureDetectionService {
  constructor() {
    this.isListening = false;
    this.subscription = null;
    this.lastShakeTime = 0;
    this.shakeCount = 0;
    this.shakeThreshold = 2.5;
    this.shakeTimeWindow = 2000; // 2 seconds to complete gesture
    this.appState = AppState.currentState;
  }

  /**
   * Start listening for gestures
   */
  async start() {
    if (this.isListening) return;

    try {
      const settings = await this.loadSettings();
      if (!settings.selectedGesture) {
        console.log('No gesture configured');
        return;
      }

      this.isListening = true;

      // Set up accelerometer for shake detection
      if (settings.selectedGesture === 'shake') {
        Accelerometer.setUpdateInterval(100);
        this.subscription = Accelerometer.addListener(this.handleAccelerometerData);
      }

      // Monitor app state changes
      AppState.addEventListener('change', this.handleAppStateChange);

      console.log('Gesture detection service started');
    } catch (error) {
      console.error('Failed to start gesture detection:', error);
    }
  }

  /**
   * Stop listening for gestures
   */
  stop() {
    if (!this.isListening) return;

    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }

    this.isListening = false;
    console.log('Gesture detection service stopped');
  }

  /**
   * Handle accelerometer data for shake detection
   */
  handleAccelerometerData = (accelerometerData) => {
    const { x, y, z } = accelerometerData;
    const acceleration = Math.sqrt(x * x + y * y + z * z);
    
    if (acceleration > this.shakeThreshold) {
      const now = Date.now();
      
      // Reset count if too much time has passed
      if (now - this.lastShakeTime > this.shakeTimeWindow) {
        this.shakeCount = 0;
      }
      
      // Prevent duplicate detections within 500ms
      if (now - this.lastShakeTime > 500) {
        this.lastShakeTime = now;
        this.shakeCount++;
        
        // Haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        // Trigger alert after 3 shakes
        if (this.shakeCount >= 3) {
          this.triggerEmergencyAlert();
          this.shakeCount = 0;
        }
      }
    }
  };

  /**
   * Handle app state changes (foreground/background)
   */
  handleAppStateChange = (nextAppState) => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground');
    } else if (nextAppState === 'background') {
      console.log('App has gone to the background - gesture detection still active');
    }
    this.appState = nextAppState;
  };

  /**
   * Trigger emergency alert
   */
  async triggerEmergencyAlert() {
    try {
      console.log('🚨 EMERGENCY ALERT TRIGGERED');

      // Strong haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      // Load settings
      const settings = await this.loadSettings();
      
      // Get current location
      const location = await this.getCurrentLocation();
      
      // Send alerts to all emergency contacts
      await this.sendAlerts(settings, location);
      
      // Log the incident
      await this.logIncident(location);

      // Show decoy screen (requires native module or RN navigation)
      // This would need to be implemented in the main app
      
    } catch (error) {
      console.error('Failed to trigger emergency alert:', error);
    }
  }

  /**
   * Get current location
   */
  async getCurrentLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: address[0] || null,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to get location:', error);
      return null;
    }
  }

  /**
   * Send emergency alerts to all contacts
   */
  async sendAlerts(settings, location) {
    const { emergencyContacts, alertTemplate } = settings;

    if (!emergencyContacts || emergencyContacts.length === 0) {
      console.log('No emergency contacts configured');
      return;
    }

    // Check if SMS is available
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      console.error('SMS not available on this device');
      return;
    }

    // Prepare message with location
    let message = alertTemplate || 'Emergency! I need help at [LOCATION].';
    
    if (location) {
      const locationString = location.address
        ? `${location.address.street}, ${location.address.city}`
        : `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
      
      message = message.replace('[LOCATION]', locationString);
    }
    
    message = message.replace('[TIME]', new Date().toLocaleTimeString());
    message = message.replace('[NAME]', 'User'); // Get from profile

    // Add Google Maps link
    if (location) {
      message += `\n\nView location: https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    }

    // Send SMS to each contact
    for (const contact of emergencyContacts) {
      try {
        await SMS.sendSMSAsync([contact.phone], message);
        console.log(`Alert sent to ${contact.name}`);
      } catch (error) {
        console.error(`Failed to send alert to ${contact.name}:`, error);
      }
    }
  }

  /**
   * Log incident for records
   */
  async logIncident(location) {
    try {
      const incidents = JSON.parse(
        (await AsyncStorage.getItem('incidentLog')) || '[]'
      );

      incidents.push({
        timestamp: new Date().toISOString(),
        location: location,
        type: 'gesture_triggered',
      });

      // Keep only last 100 incidents
      if (incidents.length > 100) {
        incidents.shift();
      }

      await AsyncStorage.setItem('incidentLog', JSON.stringify(incidents));
    } catch (error) {
      console.error('Failed to log incident:', error);
    }
  }

  /**
   * Load settings from storage
   */
  async loadSettings() {
    try {
      const settingsJson = await AsyncStorage.getItem('appSettings');
      return settingsJson ? JSON.parse(settingsJson) : {};
    } catch (error) {
      console.error('Failed to load settings:', error);
      return {};
    }
  }

  /**
   * Test if gesture detection is working
   */
  async testDetection() {
    console.log('Testing gesture detection...');
    return this.isListening;
  }
}

// Export singleton instance
export default new GestureDetectionService();