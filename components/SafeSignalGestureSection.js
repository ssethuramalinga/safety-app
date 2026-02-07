import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';

const SafeSignalGestureSection = ({ selectedGesture, onGestureChange }) => {
  const [practiceMode, setPracticeMode] = useState(false);
  const [gestureDetected, setGestureDetected] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  
  const accelerometerSubscription = useRef(null);
  const lastShakeTime = useRef(0);
  const volumePressCount = useRef(0);
  const volumePressTimer = useRef(null);

  const gestures = [
    {
      id: 'shake',
      label: 'Shake phone rapidly (3 times)',
      icon: '📳',
      description: 'Quick back-and-forth motion',
    },
    {
      id: 'volume',
      label: 'Volume Down × 5',
      icon: '🔉',
      description: 'Press volume down button 5 times quickly',
    },
    {
      id: 'power',
      label: 'Power button (hold 3 sec)',
      icon: '⚡',
      description: 'Press and hold power button',
    },
    {
      id: 'custom',
      label: 'Custom combination',
      icon: '⚙️',
      description: 'Set your own gesture sequence',
    },
  ];

  useEffect(() => {
    if (practiceMode && selectedGesture === 'shake') {
      startShakeDetection();
    }

    return () => {
      stopShakeDetection();
    };
  }, [practiceMode, selectedGesture]);

  const startShakeDetection = () => {
    Accelerometer.setUpdateInterval(100);
    
    accelerometerSubscription.current = Accelerometer.addListener(
      (accelerometerData) => {
        const { x, y, z } = accelerometerData;
        const acceleration = Math.sqrt(x * x + y * y + z * z);
        
        // Detect shake (acceleration threshold)
        if (acceleration > 2.5) {
          const now = Date.now();
          
          // Prevent duplicate detections within 500ms
          if (now - lastShakeTime.current > 500) {
            lastShakeTime.current = now;
            handleShakeDetected();
          }
        }
      }
    );
  };

  const stopShakeDetection = () => {
    if (accelerometerSubscription.current) {
      accelerometerSubscription.current.remove();
      accelerometerSubscription.current = null;
    }
  };

  const handleShakeDetected = () => {
    const newCount = shakeCount + 1;
    setShakeCount(newCount);
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (newCount >= 3) {
      triggerGestureSuccess();
      setShakeCount(0);
    }
  };

  const triggerGestureSuccess = () => {
    setGestureDetected(true);
    
    // Strong haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Alert.alert(
      '✅ Gesture Detected!',
      practiceMode
        ? 'In a real emergency, this would trigger your alert.'
        : 'Emergency alert would be sent now.',
      [{ text: 'OK', onPress: () => setGestureDetected(false) }]
    );

    setTimeout(() => {
      setGestureDetected(false);
    }, 3000);
  };

  const startPracticeMode = () => {
    setPracticeMode(true);
    setGestureDetected(false);
    setShakeCount(0);
    
    Alert.alert(
      'Practice Mode Active',
      `Perform your gesture (${gestures.find(g => g.id === selectedGesture)?.label}). No alerts will be sent.`,
      [
        {
          text: 'Stop Practice',
          onPress: () => setPracticeMode(false),
        },
      ]
    );
  };

  const selectGesture = (gestureId) => {
    onGestureChange(gestureId);
    Alert.alert('Gesture Updated', `Emergency gesture set to: ${gestures.find(g => g.id === gestureId)?.label}`);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>SafeSignal Gesture</Text>
      <Text style={styles.sectionSubtitle}>
        Choose how you'll trigger a silent emergency alert
      </Text>

      <View style={styles.gestureList}>
        {gestures.map((gesture) => (
          <TouchableOpacity
            key={gesture.id}
            style={[
              styles.gestureOption,
              selectedGesture === gesture.id && styles.gestureOptionSelected,
            ]}
            onPress={() => selectGesture(gesture.id)}
          >
            <View style={styles.radioButton}>
              {selectedGesture === gesture.id && <View style={styles.radioButtonSelected} />}
            </View>
            <View style={styles.gestureContent}>
              <Text style={styles.gestureIcon}>{gesture.icon}</Text>
              <View style={styles.gestureText}>
                <Text style={styles.gestureLabel}>{gesture.label}</Text>
                <Text style={styles.gestureDescription}>{gesture.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.practiceButton,
          practiceMode && styles.practiceButtonActive,
        ]}
        onPress={practiceMode ? () => setPracticeMode(false) : startPracticeMode}
      >
        <Text style={styles.practiceButtonText}>
          {practiceMode ? '⏹ Stop Practice Mode' : '▶️ Practice Gesture'}
        </Text>
      </TouchableOpacity>

      {practiceMode && (
        <View style={styles.practiceStatus}>
          <Text style={styles.practiceStatusText}>
            {gestureDetected
              ? '✅ Gesture detected successfully!'
              : selectedGesture === 'shake'
              ? `Shake detected: ${shakeCount}/3`
              : 'Waiting for gesture...'}
          </Text>
          {gestureDetected && <View style={styles.successIndicator} />}
        </View>
      )}

      {selectedGesture === 'shake' && (
        <View style={styles.tip}>
          <Text style={styles.tipTitle}>💡 Tip</Text>
          <Text style={styles.tipText}>
            This works even when your phone is in your pocket or bag. Practice to find the right intensity.
          </Text>
        </View>
      )}

      {selectedGesture === 'volume' && (
        <View style={styles.tip}>
          <Text style={styles.tipTitle}>💡 Tip</Text>
          <Text style={styles.tipText}>
            Press volume down 5 times within 2 seconds. Works reliably on iOS devices.
          </Text>
        </View>
      )}

      {selectedGesture === 'power' && (
        <View style={styles.tip}>
          <Text style={styles.tipTitle}>⚠️ Note</Text>
          <Text style={styles.tipText}>
            Power button gestures may require accessibility permissions. Consider using shake or volume gestures for more reliable detection.
          </Text>
        </View>
      )}
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
  gestureList: {
    marginBottom: 20,
  },
  gestureOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  gestureOptionSelected: {
    borderColor: '#5B4FE9',
    backgroundColor: '#F0EEFF',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#5B4FE9',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5B4FE9',
  },
  gestureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gestureIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  gestureText: {
    flex: 1,
  },
  gestureLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  gestureDescription: {
    fontSize: 13,
    color: '#666',
  },
  practiceButton: {
    backgroundColor: '#5B4FE9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  practiceButtonActive: {
    backgroundColor: '#ff4444',
  },
  practiceButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  practiceStatus: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  practiceStatusText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  successIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    marginTop: 10,
  },
  tip: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#FFF9E6',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  tipText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});

export default SafeSignalGestureSection;