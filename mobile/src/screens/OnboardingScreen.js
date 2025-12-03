import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function OnboardingScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState([]);
  const [allergies, setAllergies] = useState([]);

  const steps = [
    {
      title: "Welcome to FoodHealth",
      subtitle: "Your personal food safety companion",
      description: "Scan any product to get instant health insights, ingredient analysis, and safety ratings.",
      icon: "restaurant"
    },
    {
      title: "Set Your Preferences",
      subtitle: "What matters most to you?",
      description: "We'll personalize your experience based on your food priorities.",
      icon: "checkmark-circle"
    },
    {
      title: "Allergies & Restrictions",
      subtitle: "Stay safe with custom alerts",
      description: "We'll warn you about ingredients that could affect your health.",
      icon: "warning"
    },
    {
      title: "You're All Set!",
      subtitle: "Start scanning products now",
      description: "Tap the scan button to analyze your first product and get detailed health insights.",
      icon: "qr-code"
    }
  ];

  const preferenceOptions = [
    "Organic Foods", "Low Sugar", "High Protein", "Low Sodium", 
    "Gluten-Free", "Vegan", "Keto-Friendly", "No Artificial Colors"
  ];

  const allergyOptions = [
    "Peanuts", "Tree Nuts", "Dairy", "Eggs", "Soy", "Wheat", "Fish", "Shellfish"
  ];

  const togglePreference = (pref) => {
    setPreferences(prev => 
      prev.includes(pref) 
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  const toggleAllergy = (allergy) => {
    setAllergies(prev => 
      prev.includes(allergy) 
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate('Main');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipToHome = () => {
    navigation.navigate('Main');
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (currentStep) {
      case 1: // Preferences
        return (
          <View style={styles.optionsContainer}>
            {preferenceOptions.map((option, index) => (
              <Pressable
                key={index}
                style={[
                  styles.optionButton,
                  preferences.includes(option) && styles.optionSelected
                ]}
                onPress={() => togglePreference(option)}
              >
                <Text style={[
                  styles.optionText,
                  preferences.includes(option) && styles.optionTextSelected
                ]}>
                  {option}
                </Text>
                {preferences.includes(option) && (
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                )}
              </Pressable>
            ))}
          </View>
        );
      
      case 2: // Allergies
        return (
          <View style={styles.optionsContainer}>
            {allergyOptions.map((option, index) => (
              <Pressable
                key={index}
                style={[
                  styles.optionButton,
                  allergies.includes(option) && styles.allergySelected
                ]}
                onPress={() => toggleAllergy(option)}
              >
                <Text style={[
                  styles.optionText,
                  allergies.includes(option) && styles.allergyTextSelected
                ]}>
                  {option}
                </Text>
                {allergies.includes(option) && (
                  <Ionicons name="warning" size={20} color="#FFFFFF" />
                )}
              </Pressable>
            ))}
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={['#10B981', '#059669']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index <= currentStep && styles.progressDotActive
                ]}
              />
            ))}
          </View>
          
          {currentStep > 0 && (
            <Pressable style={styles.backButton} onPress={prevStep}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>
          )}
          
          <Pressable style={styles.skipButton} onPress={skipToHome}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Ionicons 
                name={steps[currentStep].icon} 
                size={48} 
                color="#10B981" 
              />
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{steps[currentStep].title}</Text>
            <Text style={styles.subtitle}>{steps[currentStep].subtitle}</Text>
            <Text style={styles.description}>{steps[currentStep].description}</Text>
            
            {renderStepContent()}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable style={styles.nextButton} onPress={nextStep}>
            <Text style={styles.nextButtonText}>
              {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotActive: {
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconBackground: {
    width: 96,
    height: 96,
    backgroundColor: '#FFFFFF',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: '#FFFFFF',
  },
  allergySelected: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#FFFFFF',
  },
  optionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  allergyTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nextButtonText: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: '700',
  },
});