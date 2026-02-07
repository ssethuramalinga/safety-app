import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Slider,
  Alert,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';

const VoiceSettingsSection = ({ voiceType, voiceTone, onVoiceChange }) => {
  const [volume, setVolume] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);

  const voiceTypes = [
    { id: 'female', label: 'Female Voice', icon: '👩' },
    { id: 'male', label: 'Male Voice', icon: '👨' },
    { id: 'neutral', label: 'Neutral Voice', icon: '🗣️' },
  ];

  const voiceTones = [
    {
      id: 'casual',
      label: 'Casual Friend',
      description: 'Relaxed, everyday conversation',
      example: "Yo, I see you on the map, all good?",
    },
    {
      id: 'concerned',
      label: 'Concerned Partner',
      description: 'Caring and attentive',
      example: "Hey, are you okay? I'm tracking your location.",
    },
    {
      id: 'professional',
      label: 'Professional',
      description: 'Formal and direct',
      example: "This is a safety check. Please confirm your status.",
    },
  ];

  // Sample phrases for each combination
  const samplePhrases = {
    female: {
      casual: [
        "Hey! I can see you're near 5th Street, almost there?",
        "I'm tracking your location, just two minutes away!",
        "Got your location, should I meet you at the corner?",
      ],
      concerned: [
        "Hey sweetie, I see where you are. Are you safe?",
        "I'm watching your location, just let me know if you need anything.",
        "I can see you're moving, is everything okay?",
      ],
      professional: [
        "Location confirmed. Estimated arrival time: 3 minutes.",
        "This is a safety check-in. Please confirm your status.",
        "Your location has been logged. Standing by for update.",
      ],
    },
    male: {
      casual: [
        "Yo, I've got your location. Be there in like 2 minutes.",
        "Just saw you on Find My Friends, heading your way!",
        "I can see the pin, stay right there, I'm close.",
      ],
      concerned: [
        "Hey, I'm tracking you right now. Everything okay?",
        "I see where you are. Just stay on the line with me.",
        "Got your location locked in, I'm keeping an eye on you.",
      ],
      professional: [
        "Location confirmed at your coordinates. ETA 2 minutes.",
        "This is a status check. Please respond at your convenience.",
        "Monitoring your position. Will arrive shortly.",
      ],
    },
    neutral: {
      casual: [
        "I see you on the map, looks like you're almost there!",
        "Got your location, I'm heading over now.",
        "Just checked, you're close! See you in a sec.",
      ],
      concerned: [
        "I'm watching your location right now. Are you alright?",
        "I can see where you are. Just checking in on you.",
        "Location received. Let me know if you need help.",
      ],
      professional: [
        "Position confirmed. Approximate arrival: 3 minutes.",
        "Location acknowledged. Awaiting status confirmation.",
        "Coordinates received. Monitoring your movement.",
      ],
    },
  };

  const playPreview = async () => {
    try {
      setIsPlaying(true);

      // In production, this would play actual ElevenLabs audio
      // For now, we'll simulate with a text-to-speech alert
      const phrases = samplePhrases[voiceType][voiceTone];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

      Alert.alert(
        '🔊 Preview',
        `Playing: "${randomPhrase}"\n\nVoice: ${voiceType}\nTone: ${voiceTone}`,
        [{ text: 'OK', onPress: () => setIsPlaying(false) }]
      );

      // Simulate audio playback duration
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);

      // In production, you would use:
      /*
      const { sound } = await Audio.Sound.createAsync(
        { uri: `path/to/${voiceType}_${voiceTone}_sample.mp3` },
        { volume: volume }
      );
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          sound.unloadAsync();
        }
      });
      */
    } catch (error) {
      console.error('Error playing preview:', error);
      Alert.alert('Error', 'Failed to play preview');
      setIsPlaying(false);
    }
  };

  const selectVoiceType = (type) => {
    onVoiceChange(type, voiceTone);
  };

  const selectVoiceTone = (tone) => {
    onVoiceChange(voiceType, tone);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Voice Settings</Text>
      <Text style={styles.sectionSubtitle}>
        Choose how the AI companion voice sounds
      </Text>

      {/* Voice Type Selection */}
      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Voice Type:</Text>
        <View style={styles.optionGrid}>
          {voiceTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.voiceTypeCard,
                voiceType === type.id && styles.voiceTypeCardSelected,
              ]}
              onPress={() => selectVoiceType(type.id)}
            >
              <Text style={styles.voiceTypeIcon}>{type.icon}</Text>
              <Text
                style={[
                  styles.voiceTypeLabel,
                  voiceType === type.id && styles.voiceTypeLabelSelected,
                ]}
              >
                {type.label}
              </Text>
              {voiceType === type.id && <View style={styles.selectedBadge} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Voice Tone Selection */}
      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Voice Tone:</Text>
        {voiceTones.map((tone) => (
          <TouchableOpacity
            key={tone.id}
            style={[
              styles.toneCard,
              voiceTone === tone.id && styles.toneCardSelected,
            ]}
            onPress={() => selectVoiceTone(tone.id)}
          >
            <View style={styles.radioButton}>
              {voiceTone === tone.id && <View style={styles.radioButtonSelected} />}
            </View>
            <View style={styles.toneContent}>
              <Text style={styles.toneLabel}>{tone.label}</Text>
              <Text style={styles.toneDescription}>{tone.description}</Text>
              <Text style={styles.toneExample}>"{tone.example}"</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Volume Control */}
      <View style={styles.subsection}>
        <View style={styles.volumeHeader}>
          <Text style={styles.subsectionTitle}>Volume:</Text>
          <Text style={styles.volumeValue}>{Math.round(volume * 100)}%</Text>
        </View>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>🔉</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={setVolume}
            minimumTrackTintColor="#5B4FE9"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#5B4FE9"
          />
          <Text style={styles.sliderLabel}>🔊</Text>
        </View>
      </View>

      {/* Preview Button */}
      <TouchableOpacity
        style={[styles.previewButton, isPlaying && styles.previewButtonPlaying]}
        onPress={playPreview}
        disabled={isPlaying}
      >
        <Text style={styles.previewButtonText}>
          {isPlaying ? '🔊 Playing...' : '▶️ Preview Voice'}
        </Text>
      </TouchableOpacity>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ About Voice Generation</Text>
        <Text style={styles.infoText}>
          Voices are powered by ElevenLabs AI for realistic, natural-sounding speech.
          These pre-recorded phrases activate instantly when you need them.
        </Text>
      </View>

      {/* Sample Phrases */}
      <View style={styles.phrasesSection}>
        <Text style={styles.phrasesTitle}>Sample Phrases:</Text>
        {samplePhrases[voiceType][voiceTone].map((phrase, index) => (
          <View key={index} style={styles.phraseItem}>
            <Text style={styles.phraseNumber}>{index + 1}.</Text>
            <Text style={styles.phraseText}>"{phrase}"</Text>
          </View>
        ))}
      </View>

      {/* Future Feature Notice */}
      <View style={styles.futureFeature}>
        <Text style={styles.futureFeatureTitle}>🚀 Coming Soon</Text>
        <Text style={styles.futureFeatureText}>
          Add your own custom phrases and recordings
        </Text>
      </View>
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
  subsection: {
    marginBottom: 25,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  optionGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  voiceTypeCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  voiceTypeCardSelected: {
    borderColor: '#5B4FE9',
    backgroundColor: '#F0EEFF',
  },
  voiceTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  voiceTypeLabel: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  voiceTypeLabelSelected: {
    fontWeight: '600',
    color: '#5B4FE9',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#5B4FE9',
  },
  toneCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  toneCardSelected: {
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
  toneContent: {
    flex: 1,
  },
  toneLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  toneDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  toneExample: {
    fontSize: 13,
    color: '#5B4FE9',
    fontStyle: 'italic',
  },
  volumeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  volumeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B4FE9',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sliderLabel: {
    fontSize: 20,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  previewButton: {
    backgroundColor: '#5B4FE9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  previewButtonPlaying: {
    backgroundColor: '#9B8FE9',
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  phrasesSection: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  phrasesTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  phraseItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  phraseNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B4FE9',
    marginRight: 8,
    minWidth: 20,
  },
  phraseText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  futureFeature: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFB74D',
    borderStyle: 'dashed',
  },
  futureFeatureTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  futureFeatureText: {
    fontSize: 12,
    color: '#666',
  },
});

export default VoiceSettingsSection;