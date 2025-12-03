import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ navigation, route }) {
  const { product } = route.params;
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const goBack = () => {
    navigation.goBack();
  };

  // Dynamische Gradient-Farben basierend auf Produktscore
  const getGradientColors = (score) => {
    if (score >= 70) {
      return ['#00E199', '#0FA483']; // Grün für gute Produkte
    } else if (score >= 40) {
      return ['#FCBE25', '#F87617']; // Orange für mittlere Produkte
    } else {
      return ['#F65972', '#DC2728']; // Rot für schlechte Produkte
    }
  };

  const typeStyles = {
    good: { bg: '#ECFDF5', text: '#047857', border: '#D1FAE5' },
    warning: { bg: '#FFFBEB', text: '#B45309', border: '#FED7AA' },
    danger: { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* --- TOP SECTION (Dynamic Gradient) --- */}
          <LinearGradient 
            colors={getGradientColors(product.score)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroHeader}
          >
            {/* Header: Back Button - Glasmorphism */}
            <View style={styles.navigation}>
              <Pressable style={styles.navButton} onPress={goBack}>
                <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Product Image Card */}
            <View style={styles.imageContainer}>
              <View style={styles.imageBg}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
              </View>
            </View>

            {/* Product Title & Subtitle */}
            <View style={styles.textCenter}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productSubline}>
                {product.mainVerdict.subline}
              </Text>
            </View>

            {/* Slider / Meter */}
            <View style={styles.sliderContainer}>
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Ultra-processed</Text>
                <Text style={styles.sliderLabel}>Natural</Text>
              </View>
              {/* Custom Range Track */}
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: `${product.score}%` }]} />
                {/* The Thumb/Knob */}
                <View style={[
                  styles.sliderThumb, 
                  { left: `${product.score}%` }
                ]}>
                  <View style={[
                    styles.sliderThumbInner,
                    {
                      backgroundColor: product.score >= 70 ? '#00E199' : 
                                     product.score >= 40 ? '#FCBE25' : '#F65972'
                    }
                  ]} />
                </View>
              </View>
            </View>

            {/* Score Display */}
            <View style={styles.scoreDisplay}>
              <Text style={styles.scoreHeadline}>{product.mainVerdict.headline}</Text>
              <Text style={styles.scoreNumber}>{product.score}</Text>
            </View>
          </LinearGradient>

          {/* --- BOTTOM SECTION (White/Grey Content) --- */}
          <View style={styles.contentSection}>
            
            {/* Grid Stats */}
            <View style={styles.quickFactsGrid}>
              {product.quickFacts.map((fact, i) => {
                const style = typeStyles[fact.type];
                return (
                  <View 
                    key={i} 
                    style={[
                      styles.factCard,
                      { 
                        backgroundColor: '#FFFFFF',
                        borderColor: '#F4F5F7'
                      }
                    ]}
                  >
                    <Text style={styles.factIcon}>{fact.icon}</Text>
                    <Text style={styles.factLabel}>{fact.label}</Text>
                    <Text style={[styles.factValue, { color: style.text }]}>
                      {fact.value}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* DETAILED ANALYSIS SECTION */}
            <View style={styles.analysisSection}>
              <Text style={styles.analysisTitle}>Detailed Analysis</Text>

              {/* Harmful Additives Accordion */}
              <View style={styles.accordionContainer}>
                <Pressable 
                  style={styles.accordionHeader}
                  onPress={() => toggleSection('additives')}
                >
                  <View style={styles.accordionTitleContainer}>
                    <View style={[
                      styles.accordionIcon,
                      { backgroundColor: product.harmfulAdditives.length > 0 ? '#FEE2E2' : '#DEF7EC' }
                    ]}>
                      <Ionicons 
                        name={product.harmfulAdditives.length > 0 ? "warning" : "checkmark"} 
                        size={20} 
                        color={product.harmfulAdditives.length > 0 ? '#B91C1C' : '#047857'} 
                      />
                    </View>
                    <View style={styles.accordionTextContainer}>
                      <Text style={styles.accordionTitle}>Additives</Text>
                      <Text style={styles.accordionSubtitle}>
                        {product.harmfulAdditives.length === 0 
                          ? "No harmful additives" 
                          : `${product.harmfulAdditives.length} to avoid`}
                      </Text>
                    </View>
                  </View>
                  <Ionicons 
                    name="chevron-down" 
                    size={20} 
                    color="#D1D5DB"
                    style={[
                      styles.accordionChevron,
                      expandedSection === 'additives' && styles.accordionChevronRotated
                    ]}
                  />
                </Pressable>
                
                {expandedSection === 'additives' && (
                  <View style={styles.accordionContent}>
                    {product.harmfulAdditives.length === 0 ? (
                      <View style={styles.cleanLabelContainer}>
                        <Ionicons name="checkmark" size={16} color="#047857" />
                        <Text style={styles.cleanLabelText}>
                          Clean label - no harmful additives detected
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.additivesContainer}>
                        {product.harmfulAdditives.map((additive, i) => (
                          <View key={i} style={styles.additiveItem}>
                            <Text style={styles.additiveName}>{additive.name}</Text>
                            <Text style={styles.additiveReason}>{additive.reason}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Ingredients Accordion */}
              <View style={styles.accordionContainer}>
                <Pressable 
                  style={styles.accordionHeader}
                  onPress={() => toggleSection('ingredients')}
                >
                  <View style={styles.accordionTitleContainer}>
                    <View style={[styles.accordionIcon, { backgroundColor: '#F9FAFB' }]}>
                      <Text style={styles.ingredientCount}>{product.ingredients.length}</Text>
                    </View>
                    <View style={styles.accordionTextContainer}>
                      <Text style={styles.accordionTitle}>Ingredients</Text>
                      <Text style={styles.accordionSubtitle}>Full list view</Text>
                    </View>
                  </View>
                  <Ionicons 
                    name="chevron-down" 
                    size={20} 
                    color="#D1D5DB"
                    style={[
                      styles.accordionChevron,
                      expandedSection === 'ingredients' && styles.accordionChevronRotated
                    ]}
                  />
                </Pressable>
                
                {expandedSection === 'ingredients' && (
                  <View style={styles.accordionContent}>
                    {/* Expert Tip Info Box */}
                    <View style={styles.expertTipContainer}>
                      <View style={styles.expertTipContent}>
                        <Ionicons name="information-circle" size={16} color="#2563EB" style={styles.expertTipIcon} />
                        <View style={styles.expertTipText}>
                          <Text style={styles.expertTipTitle}>💡 Expert Tip</Text>
                          <Text style={styles.expertTipDescription}>
                            Ingredients are listed by weight (heaviest first). The first 3 ingredients make up ~70% of the product.
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.ingredientsContainer}>
                      {product.ingredients.map((ingredient, i) => (
                        <View 
                          key={i}
                          style={[
                            styles.ingredientItem,
                            { backgroundColor: ingredient.safe ? '#F9FAFB' : '#FEF2F2' }
                          ]}
                        >
                          <View style={styles.ingredientInfo}>
                            <View style={styles.ingredientNumberContainer}>
                              <View style={[
                                styles.ingredientDot,
                                { backgroundColor: ingredient.safe ? '#10B981' : '#EF4444' }
                              ]} />
                              <Text style={styles.ingredientNumber}>#{i + 1}</Text>
                            </View>
                            <View style={styles.ingredientText}>
                              <Text style={[
                                styles.ingredientName,
                                { color: ingredient.safe ? '#111827' : '#7F1D1D' }
                              ]}>
                                {ingredient.name}
                              </Text>
                              {ingredient.desc && (
                                <Text style={[
                                  styles.ingredientDesc,
                                  { color: ingredient.safe ? '#6B7280' : '#B91C1C' }
                                ]}>
                                  {ingredient.desc}
                                </Text>
                              )}
                            </View>
                          </View>
                          <Ionicons 
                            name={ingredient.safe ? "checkmark" : "warning"} 
                            size={16} 
                            color={ingredient.safe ? '#10B981' : '#EF4444'} 
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              {/* Scientific Evidence Accordion */}
              <View style={styles.accordionContainer}>
                <Pressable 
                  style={styles.accordionHeader}
                  onPress={() => toggleSection('evidence')}
                >
                  <View style={styles.accordionTitleContainer}>
                    <View style={[styles.accordionIcon, { backgroundColor: '#FAF5FF' }]}>
                      <Text style={styles.evidenceIcon}>📚</Text>
                    </View>
                    <View style={styles.accordionTextContainer}>
                      <Text style={styles.accordionTitle}>Scientific Evidence</Text>
                      <Text style={styles.accordionSubtitle}>Research studies & health data</Text>
                    </View>
                  </View>
                  <Ionicons 
                    name="chevron-down" 
                    size={20} 
                    color="#D1D5DB"
                    style={[
                      styles.accordionChevron,
                      expandedSection === 'evidence' && styles.accordionChevronRotated
                    ]}
                  />
                </Pressable>
                
                {expandedSection === 'evidence' && (
                  <View style={styles.accordionContent}>
                    <View style={styles.evidenceContainer}>
                      {product.scientificEvidence.map((study, i) => (
                        <View key={i} style={styles.studyItem}>
                          <Text style={styles.studyTitle}>{study.title}</Text>
                          <Text style={styles.studyOrg}>{study.org}</Text>
                        </View>
                      ))}
                      
                      {/* Data Sources */}
                      <View style={styles.dataSourcesContainer}>
                        <Text style={styles.dataSourcesTitle}>📊 Data Sources</Text>
                        <View style={styles.dataSourcesList}>
                          <Text style={styles.dataSourceItem}>• FDA GRAS Database (Generally Recognized as Safe)</Text>
                          <Text style={styles.dataSourceItem}>• EFSA Scientific Opinions (European Food Safety Authority)</Text>
                          <Text style={styles.dataSourceItem}>• WHO/FAO Joint Expert Committee evaluations</Text>
                          <Text style={styles.dataSourceItem}>• Peer-reviewed nutritional studies (PubMed indexed)</Text>
                        </View>
                      </View>
                      
                      {/* Regulatory Status */}
                      <View style={styles.regulatoryContainer}>
                        <Text style={styles.regulatoryTitle}>⚖️ Regulatory Status</Text>
                        <Text style={styles.regulatoryText}>
                          This product meets FDA standards but contains ingredients under review by EFSA for potential health impacts.
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>

              {/* How we calculate this score */}
              <View style={styles.methodologySection}>
                <Pressable 
                  style={styles.methodologyButton}
                  onPress={() => toggleSection('methodology')}
                >
                  <Ionicons name="information-circle-outline" size={16} color="#9CA3AF" />
                  <Text style={styles.methodologyButtonText}>How we calculate this score</Text>
                </Pressable>
                
                {expandedSection === 'methodology' && (
                  <View style={styles.methodologyContent}>
                    <Text style={styles.methodologyTitle}>🧮 Scoring Methodology</Text>
                    
                    <View style={[styles.methodologyItem, { backgroundColor: '#EFF6FF' }]}>
                      <Text style={[styles.methodologyItemTitle, { color: '#1E3A8A' }]}>NOVA Classification (40% weight)</Text>
                      <Text style={[styles.methodologyItemText, { color: '#1D4ED8' }]}>
                        • NOVA 1 (Unprocessed): 90-100 points{"\n"}
                        • NOVA 2 (Processed culinary): 70-89 points{"\n"}
                        • NOVA 3 (Processed foods): 40-69 points{"\n"}
                        • NOVA 4 (Ultra-processed): 0-39 points
                      </Text>
                    </View>
                    
                    <View style={[styles.methodologyItem, { backgroundColor: '#ECFDF5' }]}>
                      <Text style={[styles.methodologyItemTitle, { color: '#065F46' }]}>Additives Assessment (35% weight)</Text>
                      <Text style={[styles.methodologyItemText, { color: '#047857' }]}>
                        Deductions based on: Artificial colors (-10), Preservatives (-5), Flavor enhancers (-8), Banned substances (-25)
                      </Text>
                    </View>
                    
                    <View style={[styles.methodologyItem, { backgroundColor: '#FFF7ED' }]}>
                      <Text style={[styles.methodologyItemTitle, { color: '#9A3412' }]}>Nutritional Profile (25% weight)</Text>
                      <Text style={[styles.methodologyItemText, { color: '#C2410C' }]}>
                        Sugar, sodium, saturated fat content vs WHO daily recommendations
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  safeArea: {
    flex: 1,
  },
  heroHeader: {
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingBottom: 24,
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 16,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageBg: {
    width: 192,
    height: 192,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: 128,
    height: 128,
    resizeMode: 'contain',
  },
  textCenter: {
    alignItems: 'center',
    marginBottom: 32,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  productSubline: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    maxWidth: 300,
    textAlign: 'center',
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  sliderTrack: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sliderFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 24,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F4F5F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ translateX: -12 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderThumbInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  scoreDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreHeadline: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scoreNumber: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contentSection: {
    paddingHorizontal: 20,
    marginTop: -24,
    paddingBottom: 40,
  },
  quickFactsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
    zIndex: 10,
  },
  factCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 88,
    width: '48%',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  factIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  factLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  factValue: {
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 2,
  },
  analysisSection: {
    gap: 12,
  },
  analysisTitle: {
    fontWeight: 'bold',
    color: '#111827',
    fontSize: 16,
    marginBottom: 12,
  },
  accordionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F4F5F7',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 10,
  },
  accordionHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accordionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  accordionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accordionTextContainer: {
    flex: 1,
  },
  accordionTitle: {
    fontWeight: 'bold',
    color: '#111827',
    fontSize: 14,
  },
  accordionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  accordionChevron: {
    transform: [{ rotate: '0deg' }],
  },
  accordionChevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  accordionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  cleanLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#DEF7EC',
    padding: 12,
    borderRadius: 12,
  },
  cleanLabelText: {
    fontSize: 14,
    color: '#047857',
  },
  additivesContainer: {
    gap: 8,
  },
  additiveItem: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 12,
  },
  additiveName: {
    fontWeight: 'bold',
    color: '#7F1D1D',
    fontSize: 14,
  },
  additiveReason: {
    fontSize: 12,
    color: '#B91C1C',
    marginTop: 2,
  },
  ingredientCount: {
    color: '#6B7280',
    fontWeight: 'bold',
    fontSize: 14,
  },
  ingredientsContainer: {
    gap: 8,
  },
  ingredientItem: {
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ingredientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ingredientText: {
    flex: 1,
  },
  ingredientName: {
    fontWeight: '500',
    fontSize: 14,
  },
  ingredientDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  // Scientific Evidence Styles
  evidenceIcon: {
    fontSize: 18,
  },
  evidenceContainer: {
    gap: 12,
  },
  studyItem: {
    backgroundColor: '#FAF5FF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  studyTitle: {
    fontWeight: 'bold',
    color: '#581C87',
    fontSize: 14,
  },
  studyOrg: {
    fontSize: 12,
    color: '#7C3AED',
    marginTop: 4,
  },
  dataSourcesContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F4F5F7',
  },
  dataSourcesTitle: {
    fontWeight: 'bold',
    color: '#111827',
    fontSize: 14,
    marginBottom: 8,
  },
  dataSourcesList: {
    gap: 4,
  },
  dataSourceItem: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  regulatoryContainer: {
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  regulatoryTitle: {
    fontWeight: 'bold',
    color: '#92400E',
    fontSize: 14,
    marginBottom: 4,
  },
  regulatoryText: {
    fontSize: 12,
    color: '#B45309',
    lineHeight: 16,
  },
  // Expert Tip Styles
  expertTipContainer: {
    backgroundColor: '#DBEAFE',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#93C5FD',
    marginBottom: 12,
  },
  expertTipContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  expertTipIcon: {
    marginTop: 2,
  },
  expertTipText: {
    flex: 1,
  },
  expertTipTitle: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#1E40AF',
    marginBottom: 4,
  },
  expertTipDescription: {
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 16,
  },
  // Ingredient Number Styles
  ingredientNumberContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  ingredientNumber: {
    fontSize: 10,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  // Methodology Section Styles
  methodologySection: {
    paddingTop: 16,
    alignItems: 'center',
  },
  methodologyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  methodologyButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  methodologyContent: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F4F5F7',
    padding: 16,
    width: '100%',
  },
  methodologyTitle: {
    fontWeight: 'bold',
    color: '#111827',
    fontSize: 14,
    marginBottom: 12,
  },
  methodologyItem: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  methodologyItemTitle: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4,
  },
  methodologyItemText: {
    fontSize: 12,
    lineHeight: 16,
  },
});