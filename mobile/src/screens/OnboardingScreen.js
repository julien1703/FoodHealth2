import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Animated,
  Easing,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function OnboardingScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [selectedHabits, setSelectedHabits] = useState([]);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [expandedAllergy, setExpandedAllergy] = useState(null);
  const [userSession, setUserSession] = useState(null);
  
  // Session-Monitoring für Debugging
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = await import('../supabaseClient').then(mod => mod.default);
        const { data } = await supabase.auth.getSession();
        setUserSession(data?.session?.user?.id || null);
        console.log('Onboarding session status:', data?.session?.user?.id || 'No session');
      } catch (error) {
        console.error('Onboarding session check error:', error);
      }
    };
    
    checkSession();
    const interval = setInterval(checkSession, 2000); // Check every 2 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const steps = [
    {
      title: "Let's make food shopping safe",
      subtitle: "Personalize your results to get safer, quicker choices in store.",
      type: "welcome"
    },
    {
      title: "What do you usually look for when buying food?",
      subtitle: "*Select all that apply",
      type: "preferences"
    },
    {
      title: "What do you check in food before buying it?", 
      subtitle: "*Select the ones that feels most like you:",
      type: "habits"
    },
    {
      title: "Do you have any food allergies?",
      subtitle: "*Select all that apply",
      type: "allergies"
    },
    {
      title: "You're all set!",
      subtitle: "Scan - Learn - Choose Better",
      type: "complete"
    }
  ];

  const preferences = [
    "More Protein", "Less Sugar", "No artificial stuff", 
    "Organic", "Good for kids/family"
  ];

  const habits = [
    "I review nutritional information (sugar, protein, calories)",
    "I avoid specific ingredients (preservatives, artificial sweeteners)", 
    "I carefully read ingredient lists",
    "I typically don't check nutritional details"
  ];

  const allergies = [
    "Milk / Dairy", "Wheat / Gluten", "Sesame / Seeds", "Tree nuts",
    "Eggs", "Peanuts", "Shellfish", "Soy", "Fish", "No allergies"
  ];

  const allergySubOptions = {
    "Milk / Dairy": ["Lactose intolerance", "Milk allergy", "Whey allergy", "Casein allergy"],
    "Wheat / Gluten": ["Celiac disease", "Gluten sensitivity", "Wheat allergy"]
  };

  const toggleSelection = (item, type) => {
    let setter, current;
    
    if (type === 'preferences') {
      setter = setSelectedPreferences;
      current = selectedPreferences;
    } else if (type === 'habits') {
      setter = setSelectedHabits;
      current = selectedHabits;
    } else if (type === 'allergies') {
      setter = setSelectedAllergies;
      current = selectedAllergies;
      
      if (item === "No allergies") {
        setter(current.includes(item) ? [] : ["No allergies"]);
        setExpandedAllergy(null);
        return;
      } else if (current.includes("No allergies")) {
        setter([item]);
        return;
      }
    }
    
    setter(current.includes(item) 
      ? current.filter(i => i !== item)
      : [...current, item]
    );
  };

  const handleAllergyPress = (allergy) => {
    if (allergySubOptions[allergy]) {
      // Wenn es Sub-Optionen gibt, expandiere/kollabiere
      setExpandedAllergy(expandedAllergy === allergy ? null : allergy);
    } else {
      // Normale Allergie-Auswahl
      toggleSelection(allergy, 'allergies');
    }
  };

  const toggleSubAllergy = (mainAllergy, subAllergy) => {
    const fullAllergyName = `${mainAllergy} - ${subAllergy}`;
    toggleSelection(fullAllergyName, 'allergies');
  };

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      const nextStepValue = currentStep + 1;
      setCurrentStep(nextStepValue);
      
      // Trigger animation for complete screen
      if (nextStepValue === steps.length - 1) {
        startCompleteAnimation();
      }
    } else {
      // Onboarding abgeschlossen - markiere als complete
      try {
        const { markOnboardingComplete } = await import('../services/profileService');
        const supabase = await import('../supabaseClient').then(mod => mod.default);
        const { data } = await supabase.auth.getUser();
        
        if (data?.user?.id) {
          await markOnboardingComplete(data.user.id);
          console.log('Onboarding completed and marked');
        }
      } catch (error) {
        console.error('Error completing onboarding:', error);
      }
      
      navigation.replace('Main');
    }
  };

  const startCompleteAnimation = () => {
    // Reset all animations
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.3);
    bounceAnim.setValue(0);
    rotateAnim.setValue(0);

    // Sequence of animations
    Animated.sequence([
      // Fade in and scale up the container
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Bounce animation for thumbs up
      Animated.spring(bounceAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      // Rotation animation
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipToMain = async () => {
    // Auch beim Skip als completed markieren
    try {
      const { markOnboardingComplete } = await import('../services/profileService');
      const supabase = await import('../supabaseClient').then(mod => mod.default);
      const { data } = await supabase.auth.getUser();
      
      if (data?.user?.id) {
        await markOnboardingComplete(data.user.id);
        console.log('Onboarding skipped and marked as completed');
      }
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    }
    
    navigation.replace('Main');
  };

  const preferenceOptions = [
    "Organic & Natural Products", "Low Sugar Content", "High Protein Foods", "Low Sodium Options", 
    "Gluten-Free Products", "Plant-Based & Vegan", "Keto-Friendly Items", "No Artificial Additives"
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
    
    if (step.type === 'welcome') {
      return (
        <View style={styles.welcomeContainer}>
          <View style={styles.categoriesGrid}>
            <View style={styles.categoriesRow}>
              <View style={[styles.categoryCard, styles.categoryCardLarge]}>
                <View style={styles.categoryIconContainer}>
                  <Text style={styles.categoryIcon}>🥤</Text>
                </View>
                <Text style={styles.categoryTitle}>Drinks</Text>
                <Text style={styles.categorySubtitle}>Energy & Beverages</Text>
              </View>
              
              <View style={styles.categoryCard}>
                <View style={styles.categoryIconContainer}>
                  <Text style={styles.categoryIcon}>🍫</Text>
                </View>
                <Text style={styles.categoryTitle}>Snacks</Text>
                <Text style={styles.categorySubtitle}>Sweet & Savory</Text>
              </View>
            </View>
            
            <View style={styles.categoriesRow}>
              <View style={styles.categoryCard}>
                <View style={styles.categoryIconContainer}>
                  <Text style={styles.categoryIcon}>🥛</Text>
                </View>
                <Text style={styles.categoryTitle}>Dairy</Text>
                <Text style={styles.categorySubtitle}>Milk & Cheese</Text>
              </View>
              
              <View style={styles.categoryCard}>
                <View style={styles.categoryIconContainer}>
                  <Text style={styles.categoryIcon}>📦</Text>
                </View>
                <Text style={styles.categoryTitle}>Packaged</Text>
                <Text style={styles.categorySubtitle}>Ready Meals</Text>
              </View>
            </View>
          </View>
        </View>
      );
    }

    if (step.type === 'preferences') {
      return (
        <View style={styles.optionsContainer}>
          {preferences.map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.optionButton,
                selectedPreferences.includes(item) && styles.selectedOption
              ]}
              onPress={() => toggleSelection(item, 'preferences')}
            >
              <Text style={[
                styles.optionText,
                selectedPreferences.includes(item) && styles.selectedOptionText
              ]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      );
    }

    if (step.type === 'habits') {
      return (
        <View style={styles.optionsContainer}>
          {habits.map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.optionButton,
                styles.habitButton,
                selectedHabits.includes(item) && styles.selectedOption
              ]}
              onPress={() => toggleSelection(item, 'habits')}
            >
              <Text style={[
                styles.optionText,
                selectedHabits.includes(item) && styles.selectedOptionText
              ]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      );
    }

    if (step.type === 'allergies') {
      return (
        <ScrollView 
          style={styles.optionsContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.allergyGrid}>
            {allergies.map((item, index) => {
              const isExpanded = expandedAllergy === item && allergySubOptions[item];
              
              if (isExpanded) {
                return (
                  <View key={index} style={styles.expandedAllergyContainer}>
                    <Pressable
                      style={[
                        styles.mainAllergyInExpanded,
                        (selectedAllergies.includes(item) || 
                         selectedAllergies.some(selected => selected.startsWith(item + " - "))) && styles.selectedOption
                      ]}
                      onPress={() => handleAllergyPress(item)}
                    >
                      <Text style={[
                        styles.mainAllergyTextExpanded,
                        (selectedAllergies.includes(item) || 
                         selectedAllergies.some(selected => selected.startsWith(item + " - "))) && styles.selectedOptionText
                      ]}>
                        {item}
                      </Text>
                    </Pressable>
                    
                    <View style={styles.subAllergyContainer}>
                      {allergySubOptions[item].map((subItem, subIndex) => (
                        <Pressable
                          key={subIndex}
                          style={[
                            styles.subAllergyButton,
                            selectedAllergies.includes(`${item} - ${subItem}`) && styles.selectedOption
                          ]}
                          onPress={() => toggleSubAllergy(item, subItem)}
                        >
                          <Text style={[
                            styles.subAllergyText,
                            selectedAllergies.includes(`${item} - ${subItem}`) && styles.selectedOptionText
                          ]}>
                            {subItem}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                );
              }
              
              return (
                <View key={index} style={styles.allergyContainer}>
                  <Pressable
                    style={[
                      styles.allergyButton,
                      item === "No allergies" && styles.noAllergiesButton,
                      (selectedAllergies.includes(item) || 
                       selectedAllergies.some(selected => selected.startsWith(item + " - "))) && styles.selectedOption
                    ]}
                    onPress={() => handleAllergyPress(item)}
                  >
                    <Text style={[
                      styles.allergyText,
                      (selectedAllergies.includes(item) || 
                       selectedAllergies.some(selected => selected.startsWith(item + " - "))) && styles.selectedOptionText
                    ]}>
                      {item}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="List any additional dietary restrictions..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </ScrollView>
      );
    }

    if (step.type === 'complete') {
      const bounceInterpolation = bounceAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 20],
      });

      const rotateInterpolation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      });

      return (
        <Animated.View 
          style={[
            styles.completeContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Animated.View 
            style={[
              styles.thumbsUpContainer,
              {
                transform: [
                  { translateY: bounceInterpolation },
                  { rotate: rotateInterpolation }
                ]
              }
            ]}
          >
            <Text style={styles.thumbsUp}>🎉</Text>
          </Animated.View>
          
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.completeTitle}>Setup Complete!</Text>
            <Text style={styles.completeSubtitle}>
              Your dietary profile has been configured successfully.{'\n'}
              Ready to start making informed food choices!
            </Text>
          </Animated.View>
          
          {/* Floating particles effect */}
          <Animated.View 
            style={[
              styles.particle1,
              {
                opacity: fadeAnim,
                transform: [{ translateY: bounceInterpolation }]
              }
            ]}
          >
            <Text style={styles.particleText}>✨</Text>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.particle2,
              {
                opacity: fadeAnim,
                transform: [{ translateY: bounceInterpolation.interpolate({
                  inputRange: [0, 20],
                  outputRange: [0, -15]
                })}]
              }
            ]}
          >
            <Text style={styles.particleText}>🎊</Text>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.particle3,
              {
                opacity: fadeAnim,
                transform: [{ translateY: bounceInterpolation.interpolate({
                  inputRange: [0, 20],
                  outputRange: [0, 25]
                })}]
              }
            ]}
          >
            <Text style={styles.particleText}>⭐</Text>
          </Animated.View>
        </Animated.View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        {currentStep === 0 && (
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={[styles.logo, { color: '#000' }]}>chec</Text>
              <Text style={[styles.logo, { color: '#10B981' }]}>k</Text>
              <Text style={[styles.logo, { color: '#000' }]}> it</Text>
            </View>
          </View>
        )}



        {/* Content */}
        <View style={styles.content}>
          {currentStep > 0 && (
            <>
              <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
              {steps[currentStep].subtitle && (
                <Text style={styles.stepSubtitle}>{steps[currentStep].subtitle}</Text>
              )}
            </>
          )}
          
          {currentStep === 0 && (
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeTitle}>{steps[0].title}</Text>
              <Text style={styles.welcomeSubtitle}>{steps[0].subtitle}</Text>
            </View>
          )}
          
          {renderStepContent()}
        </View>

        {/* Progress Dots */}
        {currentStep > 0 && (
          <View style={styles.progressContainer}>
            {steps.slice(1).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index < currentStep - 1 && styles.progressDotActive,
                  index === currentStep - 1 && styles.progressDotCurrent
                ]}
              />
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          {currentStep === 0 ? (
            <>
              <Pressable style={styles.secondaryButton} onPress={skipToMain}>
                <Text style={styles.secondaryButtonText}>Skip Setup</Text>
              </Pressable>
              
              <Pressable style={styles.primaryButton} onPress={nextStep}>
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.navigationFooter}>
              {currentStep > 1 && (
                <Pressable style={styles.backButton} onPress={previousStep}>
                  <Text style={styles.backButtonText}>Back</Text>
                </Pressable>
              )}
              
              <Pressable 
                style={[styles.primaryButton, currentStep > 1 && styles.primaryButtonWithBack]} 
                onPress={currentStep === steps.length - 1 ? skipToMain : nextStep}
              >
                <Text style={styles.primaryButtonText}>
                  {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  welcomeTextContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  categoriesGrid: {
    marginVertical: 20,
  },
  categoriesRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  categoryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryCardLarge: {
    minHeight: 180,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  categorySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 12,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  progressDotActive: {
    backgroundColor: '#10B981',
  },
  progressDotCurrent: {
    backgroundColor: '#10B981',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
    lineHeight: 32,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 100,
    backgroundColor: '#FFFFFF',
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  habitButton: {
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  selectedOption: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  allergyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  allergyButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  noAllergiesButton: {
    width: '100%',
  },
  allergyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  allergyContainer: {
    minWidth: '45%',
    marginBottom: 12,
  },
  expandedAllergyContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  mainAllergyInExpanded: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 16,
    alignItems: 'center',
  },
  mainAllergyTextExpanded: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  subAllergyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  subAllergyButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  subAllergyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: 20,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#1F2937',
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    position: 'relative',
  },
  thumbsUpContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#10B981',
  },
  thumbsUp: {
    fontSize: 80,
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  completeSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 40,
  },
  // Floating particles
  particle1: {
    position: 'absolute',
    top: '20%',
    left: '15%',
  },
  particle2: {
    position: 'absolute',
    top: '25%',
    right: '20%',
  },
  particle3: {
    position: 'absolute',
    bottom: '30%',
    left: '20%',
  },
  particleText: {
    fontSize: 24,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  navigationFooter: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    flex: 1,
  },
  // Secondary Button (Skip)
  secondaryButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  // Primary Button (Get Started, Weiter, Fertig)
  primaryButton: {
    flex: 2,
    backgroundColor: '#10B981',
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonWithBack: {
    flex: 1,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Back Button (same style as Skip)
  backButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },

});

export default OnboardingScreen;