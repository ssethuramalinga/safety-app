import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';

const DecoyScreenSection = ({ selectedDecoy, onDecoyChange }) => {
  const [practiceMode, setPracticeMode] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const decoyScreens = [
    {
      id: 'calculator',
      label: 'Calculator',
      icon: '🔢',
      description: 'Most neutral and common app',
    },
    {
      id: 'weather',
      label: 'Weather App',
      icon: '🌤️',
      description: 'Shows local weather forecast',
    },
    {
      id: 'notes',
      label: 'Notes / Shopping List',
      icon: '📝',
      description: 'Appears to be taking notes',
    },
    {
      id: 'browser',
      label: 'Web Browser',
      icon: '🌐',
      description: 'Shows news article',
    },
  ];

  const selectDecoy = (decoyId) => {
    onDecoyChange(decoyId);
    Alert.alert('Decoy Screen Updated', `Set to: ${decoyScreens.find(d => d.id === decoyId)?.label}`);
  };

  const startPracticeMode = () => {
    setPracticeMode(true);
    setTapCount(0);
    Alert.alert(
      'Practice Mode',
      'Your screen will now show the decoy. Tap the top-left corner 3 times to exit.',
      [{ text: 'Start', onPress: () => {} }]
    );
  };

  const handleDecoyTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    
    if (newCount >= 3) {
      setPracticeMode(false);
      setTapCount(0);
      Alert.alert('Practice Mode Ended', 'You successfully exited the decoy screen!');
    }
  };

  const renderDecoyScreen = () => {
    switch (selectedDecoy) {
      case 'calculator':
        return <CalculatorDecoy />;
      case 'weather':
        return <WeatherDecoy />;
      case 'notes':
        return <NotesDecoy />;
      case 'browser':
        return <BrowserDecoy />;
      default:
        return <CalculatorDecoy />;
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Decoy Screen</Text>
      <Text style={styles.sectionSubtitle}>
        Choose what your phone displays during an emergency alert
      </Text>

      <View style={styles.decoyList}>
        {decoyScreens.map((decoy) => (
          <TouchableOpacity
            key={decoy.id}
            style={[
              styles.decoyCard,
              selectedDecoy === decoy.id && styles.decoyCardSelected,
            ]}
            onPress={() => selectDecoy(decoy.id)}
          >
            <View style={styles.radioButton}>
              {selectedDecoy === decoy.id && <View style={styles.radioButtonSelected} />}
            </View>
            <Text style={styles.decoyIcon}>{decoy.icon}</Text>
            <View style={styles.decoyContent}>
              <Text style={styles.decoyLabel}>{decoy.label}</Text>
              <Text style={styles.decoyDescription}>{decoy.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.practiceButton} onPress={startPracticeMode}>
        <Text style={styles.practiceButtonText}>👁️ Try Decoy Screen</Text>
      </TouchableOpacity>

      <View style={styles.instructionsBox}>
        <Text style={styles.instructionsTitle}>💡 How it works:</Text>
        <Text style={styles.instructionsText}>
          When SafeSignal is triggered, your screen immediately switches to this decoy app
          while silently sending alerts to your emergency contacts.{'\n\n'}
          To exit the decoy: Tap the top-left corner 3 times rapidly.
        </Text>
      </View>

      {/* Practice Mode Modal */}
      <Modal
        visible={practiceMode}
        animationType="fade"
        onRequestClose={() => setPracticeMode(false)}
      >
        <TouchableOpacity
          style={styles.exitTapZone}
          onPress={handleDecoyTap}
          activeOpacity={1}
        >
          {tapCount > 0 && (
            <View style={styles.tapIndicator}>
              <Text style={styles.tapIndicatorText}>{tapCount}/3</Text>
            </View>
          )}
        </TouchableOpacity>
        {renderDecoyScreen()}
      </Modal>
    </View>
  );
};

// Decoy Screen Components

const CalculatorDecoy = () => (
  <View style={styles.decoyContainer}>
    <View style={styles.calculatorScreen}>
      <Text style={styles.calculatorDisplay}>0</Text>
    </View>
    <View style={styles.calculatorButtons}>
      {['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map(
        (button, index) => (
          <TouchableOpacity key={index} style={styles.calculatorButton}>
            <Text style={styles.calculatorButtonText}>{button}</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  </View>
);

const WeatherDecoy = () => (
  <ScrollView style={styles.decoyContainer}>
    <View style={styles.weatherContainer}>
      <Text style={styles.weatherCity}>West Lafayette, IN</Text>
      <Text style={styles.weatherTemp}>72°F</Text>
      <Text style={styles.weatherCondition}>⛅ Partly Cloudy</Text>
      <View style={styles.weatherDetails}>
        <Text style={styles.weatherDetailText}>High: 78° Low: 65°</Text>
        <Text style={styles.weatherDetailText}>Humidity: 45%</Text>
        <Text style={styles.weatherDetailText}>Wind: 8 mph</Text>
      </View>
      <View style={styles.weatherForecast}>
        <Text style={styles.weatherForecastTitle}>5-Day Forecast</Text>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
          <View key={index} style={styles.weatherForecastItem}>
            <Text style={styles.weatherForecastDay}>{day}</Text>
            <Text style={styles.weatherForecastIcon}>☀️</Text>
            <Text style={styles.weatherForecastTemp}>75°</Text>
          </View>
        ))}
      </View>
    </View>
  </ScrollView>
);

const NotesDecoy = () => (
  <View style={styles.decoyContainer}>
    <View style={styles.notesHeader}>
      <Text style={styles.notesTitle}>Shopping List</Text>
    </View>
    <ScrollView style={styles.notesContent}>
      <Text style={styles.notesText}>
        • Milk{'\n'}
        • Eggs{'\n'}
        • Bread{'\n'}
        • Chicken{'\n'}
        • Rice{'\n'}
        • Apples{'\n'}
        • Yogurt{'\n'}
        • Coffee
      </Text>
      <TextInput
        style={styles.notesInput}
        placeholder="Add item..."
        placeholderTextColor="#999"
      />
    </ScrollView>
  </View>
);

const BrowserDecoy = () => (
  <ScrollView style={styles.decoyContainer}>
    <View style={styles.browserHeader}>
      <Text style={styles.browserUrl}>📰 news.example.com</Text>
    </View>
    <View style={styles.browserContent}>
      <Text style={styles.browserHeadline}>
        Local News: Community Events This Weekend
      </Text>
      <Text style={styles.browserText}>
        The city is hosting several community events this weekend, including a farmers
        market downtown and a charity run in the park. Weather is expected to be pleasant
        with temperatures in the mid-70s.{'\n\n'}
        The farmers market will feature over 50 local vendors selling fresh produce,
        handmade crafts, and artisan foods. It runs from 8 AM to 2 PM on Saturday.
      </Text>
    </View>
  </ScrollView>
);

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
  decoyList: {
    marginBottom: 15,
  },
  decoyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  decoyCardSelected: {
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
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5B4FE9',
  },
  decoyIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  decoyContent: {
    flex: 1,
  },
  decoyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  decoyDescription: {
    fontSize: 13,
    color: '#666',
  },
  practiceButton: {
    backgroundColor: '#5B4FE9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  practiceButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionsBox: {
    backgroundColor: '#FFF9E6',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  exitTapZone: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    zIndex: 1000,
  },
  tapIndicator: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(91, 79, 233, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tapIndicatorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  decoyContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Calculator Styles
  calculatorScreen: {
    padding: 30,
    backgroundColor: '#f0f0f0',
    alignItems: 'flex-end',
  },
  calculatorDisplay: {
    fontSize: 48,
    fontWeight: '300',
    color: '#333',
  },
  calculatorButtons: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  calculatorButton: {
    width: '22%',
    aspectRatio: 1,
    margin: '1.5%',
    backgroundColor: '#e0e0e0',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculatorButtonText: {
    fontSize: 24,
    color: '#333',
  },
  // Weather Styles
  weatherContainer: {
    padding: 20,
  },
  weatherCity: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  weatherTemp: {
    fontSize: 64,
    fontWeight: '200',
    color: '#333',
    textAlign: 'center',
  },
  weatherCondition: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  weatherDetails: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  weatherDetailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  weatherForecast: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
  },
  weatherForecastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  weatherForecastItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  weatherForecastDay: {
    fontSize: 14,
    flex: 1,
  },
  weatherForecastIcon: {
    fontSize: 20,
    flex: 1,
    textAlign: 'center',
  },
  weatherForecastTemp: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  // Notes Styles
  notesHeader: {
    backgroundColor: '#5B4FE9',
    padding: 20,
    paddingTop: 60,
  },
  notesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  notesContent: {
    flex: 1,
    padding: 20,
  },
  notesText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 32,
    marginBottom: 20,
  },
  notesInput: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
    fontSize: 16,
    color: '#333',
  },
  // Browser Styles
  browserHeader: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  browserUrl: {
    fontSize: 14,
    color: '#666',
  },
  browserContent: {
    padding: 20,
  },
  browserHeadline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  browserText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default DecoyScreenSection;