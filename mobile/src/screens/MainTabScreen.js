import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { products } from '../data/products';

const { width: screenWidth } = Dimensions.get('window');

export default function MainTabScreen({ navigation }) {
  const [currentView, setCurrentView] = useState('scan'); // Standard ist Scan
  const [searchQuery, setSearchQuery] = useState('');
  const [healthFilter, setHealthFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const openProduct = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const getHealthColor = (score) => {
    if (score >= 70) return '#10B981'; // Grün
    if (score >= 40) return '#F59E0B'; // Amber
    return '#EF4444'; // Rot
  };

  const filterProducts = (productList, includeLimit = false) => {
    const filtered = productList.filter(p => {
      // Text search filter
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Health filter
      const matchesHealthFilter = healthFilter === 'all' || 
                                (healthFilter === 'good' && p.score >= 70) ||
                                (healthFilter === 'moderate' && p.score >= 40 && p.score < 70) ||
                                (healthFilter === 'poor' && p.score < 40);
      
      return matchesSearch && matchesHealthFilter;
    });
    
    return includeLimit ? filtered.slice(0, 3) : filtered;
  };

  const renderFilterDropdown = (screenType) => {
    if (!showFilterDropdown) return null;
    
    return (
      <View style={styles.filterDropdown}>
        <Pressable
          style={[styles.filterOption, healthFilter === 'all' && styles.activeFilterOption]}
          onPress={() => {
            setHealthFilter('all');
            setShowFilterDropdown(false);
          }}
        >
          <Text style={[styles.filterText, healthFilter === 'all' && styles.activeFilterText]}>
            {screenType === 'scan' ? 'All Scans' : 'All Products'}
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.filterOption, healthFilter === 'good' && styles.activeFilterOption]}
          onPress={() => {
            setHealthFilter('good');
            setShowFilterDropdown(false);
          }}
        >
          <View style={styles.filterOptionContent}>
            <View style={[styles.filterDot, { backgroundColor: '#10B981' }]} />
            <Text style={[styles.filterText, healthFilter === 'good' && styles.activeFilterText]}>
              Good Only
            </Text>
          </View>
        </Pressable>
        
        <Pressable
          style={[styles.filterOption, healthFilter === 'moderate' && styles.activeFilterOption]}
          onPress={() => {
            setHealthFilter('moderate');
            setShowFilterDropdown(false);
          }}
        >
          <View style={styles.filterOptionContent}>
            <View style={[styles.filterDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={[styles.filterText, healthFilter === 'moderate' && styles.activeFilterText]}>
              Moderate Only
            </Text>
          </View>
        </Pressable>
        
        <Pressable
          style={[styles.filterOption, healthFilter === 'poor' && styles.activeFilterOption]}
          onPress={() => {
            setHealthFilter('poor');
            setShowFilterDropdown(false);
          }}
        >
          <View style={styles.filterOptionContent}>
            <View style={[styles.filterDot, { backgroundColor: '#EF4444' }]} />
            <Text style={[styles.filterText, healthFilter === 'poor' && styles.activeFilterText]}>
              Poor Only
            </Text>
          </View>
        </Pressable>
      </View>
    );
  };

  const getFilterButtonText = (screenType) => {
    if (healthFilter === 'all') return screenType === 'scan' ? 'All Scans' : 'All Products';
    if (healthFilter === 'good') return 'Good Only';
    if (healthFilter === 'moderate') return 'Moderate Only';
    return 'Poor Only';
  };

  // ==================== SCAN SCREEN ====================
  if (currentView === 'scan') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* White Background Section */}
          <View style={styles.scanWhiteSection}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={[styles.logo, { color: '#000' }]}>chec</Text>
                <Text style={[styles.logo, { color: '#10B981' }]}>K</Text>
                <Text style={[styles.logo, { color: '#000' }]}>it</Text>
              </View>
              <Pressable style={styles.menuButton}>
                <Text style={{ fontSize: 24, color: '#1F2937' }}>☰</Text>
              </Pressable>
            </View>

            {/* Camera/Scanner */}
            <View style={styles.scannerSection}>
              <View style={styles.cameraContainer}>
                <View style={styles.cameraFallback}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1556909114-5-brooklyn-bridge-new-york?w=800&h=600&fit=crop&auto=format' }}
                    style={styles.fallbackImage}
                  />
                </View>
                
                {/* Scan Corners */}
                <View style={[styles.scanCorner, styles.topLeft]} />
                <View style={[styles.scanCorner, styles.topRight]} />
                <View style={[styles.scanCorner, styles.bottomLeft]} />
                <View style={[styles.scanCorner, styles.bottomRight]} />
                
                {/* Live Indicator */}
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
              <Text style={styles.scanInstruction}>Scan a Barcode</Text>
            </View>
          </View>

          {/* Gray Background Section */}
          <View style={styles.scanGraySection}>
            <ScrollView showsVerticalScrollIndicator={false}>
            {/* Recent Scans */}
            <View style={[styles.sectionHeader, { paddingHorizontal: 24, marginTop: 16, marginBottom: 16 }]}>
              <Text style={styles.sectionTitle}>Recent Scans</Text>
                <View style={styles.filterContainer}>
                  <Pressable
                    style={styles.filterButton}
                    onPress={() => setShowFilterDropdown(!showFilterDropdown)}
                  >
                    <Text style={styles.filterButtonText}>{getFilterButtonText('scan')}</Text>
                    <Text style={[styles.chevron, { color: '#6B7280', fontSize: 16 }, showFilterDropdown && styles.chevronRotated]}>
                      ▼
                    </Text>
                  </Pressable>
                  {renderFilterDropdown('scan')}
                </View>
              </View>
              
              <View style={[styles.productList, { paddingHorizontal: 24 }]}>
                {filterProducts(products, true).map((product) => (
                  <Pressable
                    key={product.id}
                    style={styles.productCard}
                    onPress={() => openProduct(product)}
                  >
                    <View style={styles.productImageContainer}>
                      <Image source={{ uri: product.image }} style={styles.productImage} />
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                      <Text style={styles.productBrand}>{product.brand}</Text>
                    </View>
                    <View style={[styles.scoreCircle, { backgroundColor: getHealthColor(product.score) }]}>
                      <Text style={styles.scoreText}>{product.score}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
          </ScrollView>
        </View>
          
        {/* Bottom Navigation */}
        {renderBottomNavigation()}
      </SafeAreaView>
    </View>
    );
  }

  // ==================== SEARCH SCREEN ====================
  if (currentView === 'search') {
    const stores = [
      { name: 'Safeway', logo: '🏪', color: '#EF4444', rating: '4.3', distance: '0.2 mi' },
      { name: 'Costco', logo: '🏬', color: '#3B82F6', rating: '4.7', distance: '0.8 mi' },
      { name: 'Sprouts Farmers Market', logo: '🌿', color: '#10B981', rating: '4.6', distance: '0.4 mi' },
      { name: 'Rainbow Grocery', logo: '🌈', color: '#059669', rating: '4.8', distance: '0.3 mi' },
      { name: 'Walgreens', logo: '💊', color: '#DC2626', rating: '4.1', distance: '0.1 mi' },
      { name: 'Woodlands', logo: '🌳', color: '#10B981', rating: '4.5', distance: '0.6 mi' },
      { name: 'Mollie Stone\'s', logo: '🏪', color: '#000000', rating: '4.4', distance: '0.5 mi' },
      { name: 'Show all', logo: '→', color: '#6B7280', special: true, count: '69 stores' }
    ];

    const categories = [
      { name: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop&auto=format', color: '#10B981' },
      { name: 'Dairy & Eggs', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop&auto=format', color: '#F59E0B' },
      { name: 'Meat & Seafood', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop&auto=format', color: '#DC2626' },
      { name: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&auto=format', color: '#F59E0B' },
      { name: 'Snacks', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop&auto=format', color: '#EF4444' }
    ];

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* White Background Section */}
          <View style={{ backgroundColor: '#FFFFFF' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.searchHeader}>
                <View style={styles.logoContainer}>
                  <Text style={[styles.logo, { color: '#000' }]}>chec</Text>
                  <Text style={[styles.logo, { color: '#10B981' }]}>K</Text>
                  <Text style={[styles.logo, { color: '#000' }]}>it</Text>
                </View>
                <Pressable style={styles.menuButton}>
                  <Text style={{ fontSize: 24, color: '#1F2937' }}>☰</Text>
                </Pressable>
              </View>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Text style={[styles.searchIcon, { color: '#9CA3AF', fontSize: 20 }]}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search products and stores"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Extra spacing like Saved */}
              <View style={{ height: 25 }}></View>
            </ScrollView>
          </View>

          {/* Gray Background Section */}
          <View style={styles.searchGraySection}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Stores Section */}
              <View style={[styles.sectionHeader, { paddingHorizontal: 24, marginTop: 16, marginBottom: 16 }]}>
                <Text style={styles.sectionTitle}>Local Stores</Text>
              </View>
              <View style={[styles.storesSection, { paddingHorizontal: 24 }]}>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={stores}
                  keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <Pressable style={[styles.storeCard, item.special && styles.specialStoreCard]}>
                    <View style={styles.storeImageContainer}>
                      <Text style={[styles.storeEmoji, { fontSize: 28 }]}>{item.logo}</Text>
                      {item.special && (
                        <View style={styles.specialBadge}>
                          <Text style={styles.specialBadgeText}>✨</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.storeInfo}>
                      <Text style={styles.storeName} numberOfLines={1}>{item.name}</Text>
                      <View style={styles.storeDetails}>
                        <Text style={styles.storeRating}>⭐ {item.rating || '4.5'}</Text>
                        <Text style={styles.storeDistance}>{item.distance || '0.3 mi'}</Text>
                      </View>
                    </View>
                  </Pressable>
                )}
                contentContainerStyle={styles.storesContainer}
              />
            </View>

            {/* Browse Categories */}
            <View style={[styles.categoriesSection, { paddingHorizontal: 24, marginTop: 32 }]}>
              <Text style={styles.sectionTitle}>Browse Categories</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categories}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <Pressable style={styles.categoryCard}>
                    <View style={styles.categoryImageContainer}>
                      <Image source={{ uri: item.image }} style={styles.categoryImage} />
                    </View>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryName} numberOfLines={2}>{item.name}</Text>
                    </View>
                  </Pressable>
                )}
                contentContainerStyle={styles.categoriesContainer}
              />
            </View>

            {/* Trending Now Section */}
            <View style={[styles.trendingSection, { paddingHorizontal: 24 }]}>
              <Text style={styles.sectionTitle}>Trending Now 🔥</Text>
              <View style={styles.trendingGrid}>
                <View style={styles.trendingCard}>
                  <Text style={styles.trendingEmoji}>🥑</Text>
                  <Text style={styles.trendingText}>Plant-Based</Text>
                </View>
                <View style={styles.trendingCard}>
                  <Text style={styles.trendingEmoji}>🌿</Text>
                  <Text style={styles.trendingText}>Organic</Text>
                </View>
                <View style={styles.trendingCard}>
                  <Text style={styles.trendingEmoji}>⚡</Text>
                  <Text style={styles.trendingText}>Energy Bars</Text>
                </View>
                <View style={styles.trendingCard}>
                  <Text style={styles.trendingEmoji}>🧀</Text>
                  <Text style={styles.trendingText}>Keto</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
          
        {/* Bottom Navigation */}
        {renderBottomNavigation()}
      </SafeAreaView>
    </View>
    );
  }

  // ==================== SAVED SCREEN ====================
  if (currentView === 'saved') {
    const goodCount = products.filter(p => p.score >= 70).length;
    const moderateCount = products.filter(p => p.score >= 40 && p.score < 70).length;
    const poorCount = products.filter(p => p.score < 40).length;
    const total = products.length;

    const goodPercent = total > 0 ? (goodCount / total) * 100 : 0;
    const moderatePercent = total > 0 ? (moderateCount / total) * 100 : 0;
    const poorPercent = total > 0 ? (poorCount / total) * 100 : 0;

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.savedHeader}>
              <View style={styles.logoContainer}>
                <Text style={[styles.logo, { color: '#000' }]}>chec</Text>
                <Text style={[styles.logo, { color: '#10B981' }]}>K</Text>
                <Text style={[styles.logo, { color: '#000' }]}>it</Text>
              </View>
              <Pressable style={styles.menuButton}>
                <Text style={{ fontSize: 24, color: '#1F2937' }}>☰</Text>
              </Pressable>
            </View>

            {/* White Background Section */}
            <View style={styles.savedWhiteSection}>
              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Text style={[styles.searchIcon, { color: '#9CA3AF', fontSize: 20 }]}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search your products..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Gray Background Section */}
            <View style={styles.savedGraySection}>
              <View style={[styles.sectionHeader, { paddingHorizontal: 24, marginTop: 0, marginBottom: 8 }]}>
                <Text style={styles.sectionTitle}>Saved Products</Text>
                <View style={styles.filterContainer}>
                  <Pressable
                    style={styles.filterButton}
                    onPress={() => setShowFilterDropdown(!showFilterDropdown)}
                  >
                    <Text style={styles.filterButtonText}>{getFilterButtonText('saved')}</Text>
                    <Text style={[styles.chevron, { color: '#6B7280', fontSize: 16 }, showFilterDropdown && styles.chevronRotated]}>
                      ▼
                    </Text>
                  </Pressable>
                  {renderFilterDropdown('saved')}
                </View>
              </View>
              {/* Health Progress Bar */}
              {total > 0 && (
                <View style={[styles.healthProgress, { backgroundColor: 'transparent', borderWidth: 0, shadowOpacity: 0, elevation: 0, paddingHorizontal: 24 }]}>
                  <View style={styles.progressBar}>
                    {goodCount > 0 && (
                      <View 
                        style={[styles.progressSegment, { 
                          backgroundColor: '#10B981', 
                          flex: goodPercent 
                        }]} 
                      />
                    )}
                    {moderateCount > 0 && (
                      <View 
                        style={[styles.progressSegment, { 
                          backgroundColor: '#F59E0B', 
                          flex: moderatePercent 
                        }]} 
                      />
                    )}
                    {poorCount > 0 && (
                      <View 
                        style={[styles.progressSegment, { 
                          backgroundColor: '#EF4444', 
                          flex: poorPercent 
                        }]} 
                      />
                    )}
                  </View>
                  
                  <View style={styles.progressLabels}>
                    <Pressable
                      style={[styles.progressLabel, healthFilter === 'good' && styles.activeGoodLabel]}
                      onPress={() => setHealthFilter(healthFilter === 'good' ? 'all' : 'good')}
                    >
                      <View style={[styles.labelDot, { backgroundColor: '#10B981' }]} />
                      <Text style={[styles.labelText, healthFilter === 'good' && styles.activeGoodText]}>
                        {goodCount} Good
                      </Text>
                    </Pressable>
                    
                    <Pressable
                      style={[styles.progressLabel, healthFilter === 'moderate' && styles.activeModerateLabel]}
                      onPress={() => setHealthFilter(healthFilter === 'moderate' ? 'all' : 'moderate')}
                    >
                      <View style={[styles.labelDot, { backgroundColor: '#F59E0B' }]} />
                      <Text style={[styles.labelText, healthFilter === 'moderate' && styles.activeModerateText]}>
                        {moderateCount} Moderate
                      </Text>
                    </Pressable>
                    
                    <Pressable
                      style={[styles.progressLabel, healthFilter === 'poor' && styles.activePoorLabel]}
                      onPress={() => setHealthFilter(healthFilter === 'poor' ? 'all' : 'poor')}
                    >
                      <View style={[styles.labelDot, { backgroundColor: '#EF4444' }]} />
                      <Text style={[styles.labelText, healthFilter === 'poor' && styles.activePoorText]}>
                        {poorCount} Poor
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* Products List */}
              <View style={[styles.productList, { paddingHorizontal: 24 }]}>
                {filterProducts(products).map((product) => (
                  <Pressable
                    key={product.id}
                    style={styles.productCard}
                    onPress={() => openProduct(product)}
                  >
                    <View style={styles.productImageContainer}>
                      <Image source={{ uri: product.image }} style={styles.productImage} />
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                      <Text style={styles.productBrand}>{product.brand}</Text>
                    </View>
                    <View style={[styles.scoreCircle, { backgroundColor: getHealthColor(product.score) }]}>
                      <Text style={styles.scoreText}>{product.score}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>
          
          {/* Bottom Navigation */}
          {renderBottomNavigation()}
        </SafeAreaView>
      </View>
    );
  }

  // ==================== BOTTOM NAVIGATION ====================
  function renderBottomNavigation() {
    return (
      <View style={styles.bottomNav}>
        <View style={styles.navGroup}>
          {/* Saved Button */}
          <Pressable 
            style={[styles.navButton, currentView === 'saved' && styles.activeNavButton]}
            onPress={() => setCurrentView('saved')}
          >
            <Text style={{ 
              fontSize: 20, 
              color: currentView === 'saved' ? '#FFFFFF' : '#6B7280' 
            }}>🔖</Text>
            {currentView === 'saved' && (
              <Text style={styles.activeNavText}>Saved</Text>
            )}
          </Pressable>
          
          {/* Search Button */}
          <Pressable 
            style={[styles.navButton, currentView === 'search' && styles.activeNavButton]}
            onPress={() => setCurrentView('search')}
          >
            <Text style={{ 
              fontSize: 20, 
              color: currentView === 'search' ? '#FFFFFF' : '#6B7280' 
            }}>🔍</Text>
            {currentView === 'search' && (
              <Text style={styles.activeNavText}>Search</Text>
            )}
          </Pressable>
        </View>
        
        {/* Scan Button */}
        <Pressable 
          style={[styles.scanButton, currentView === 'scan' && styles.activeScanButton]}
          onPress={() => setCurrentView('scan')}
        >
          <Text style={{ 
            fontSize: 20, 
            color: currentView === 'scan' ? '#FFFFFF' : '#6B7280' 
          }}>📷</Text>
          {currentView === 'scan' && (
            <Text style={styles.activeNavText}>Scan</Text>
          )}
        </Pressable>
      </View>
    );
  }
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
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  savedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 8,
  },
  
  // Scanner Section
  scannerSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  cameraContainer: {
    width: screenWidth - 48,
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraFallback: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  fallbackImage: {
    width: '100%',
    height: '100%',
  },
  scanCorner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#FFFFFF',
    borderWidth: 4,
  },
  topLeft: {
    top: 20,
    left: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 20,
    right: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 20,
    left: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 20,
    right: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  liveIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
    marginRight: 8,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  scanInstruction: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Search Screen
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    marginHorizontal: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  locationText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
    marginRight: 8,
  },
  
  // Sections
  recentSection: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  storesSection: {
    marginBottom: 0,
  },
  categoriesSection: {
    paddingBottom: 32,
  },
  savedWhiteSection: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 24,
  },
  scanWhiteSection: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 24,
  },
  searchGraySection: {
    backgroundColor: '#F9FAFB',
    flex: 1,
    paddingTop: 0,
  },
  scanGraySection: {
    backgroundColor: '#F9FAFB',
    flex: 1,
    paddingTop: 0,
  },
  savedGraySection: {
    backgroundColor: '#F9FAFB',
    flex: 1,
    paddingTop: 16,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  
  // Filter
  filterContainer: {
    position: 'relative',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginRight: 8,
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  filterDropdown: {
    position: 'absolute',
    right: 0,
    top: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 140,
    paddingVertical: 8,
    zIndex: 1000,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
  },
  activeFilterOption: {
    backgroundColor: '#F3F4F6',
  },
  activeFilterText: {
    color: '#10B981',
    fontWeight: '600',
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  
  // Products
  productList: {
    gap: 12,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  productImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 16,
    padding: 8,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  productInfo: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: '#6B7280',
  },
  scoreCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Stores
  storesContainer: {
    paddingRight: 24,
  },
  storeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 16,
    width: 160,
    height: 130,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  specialStoreCard: {
    borderColor: '#10B981',
    borderWidth: 2,
  },
  storeImageContainer: {
    width: '100%',
    height: 70,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    position: 'relative',
  },
  storeEmoji: {
    textAlign: 'center',
  },
  storeLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeLogoText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  specialBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialBadgeText: {
    fontSize: 12,
  },
  storeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  storeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  storeRating: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  storeDistance: {
    fontSize: 12,
    color: '#6B7280',
  },
  trendingSection: {
    marginTop: 10,
    paddingBottom: 120,
  },
  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  trendingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '48%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  trendingEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  trendingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  storeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  storeCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  
  // Categories
  categoriesContainer: {
    paddingRight: 24,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 16,
    width: 170,
    height: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  categoryImageContainer: {
    width: '100%',
    height: 80,
    backgroundColor: '#F3F4F6',
    padding: 8,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  categoryInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  
  // Health Progress
  healthProgress: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressSegment: {
    height: '100%',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  activeGoodLabel: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  activeModerateLabel: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  activePoorLabel: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  labelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  labelText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeGoodText: {
    color: '#15803D',
    fontWeight: '600',
  },
  activeModerateText: {
    color: '#D97706',
    fontWeight: '600',
  },
  activePoorText: {
    color: '#DC2626',
    fontWeight: '600',
  },
  
  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 32,
    left: 32,
    right: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  navGroup: {
    backgroundColor: '#E5E7EB',
    borderRadius: 28,
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  activeNavButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
  },
  scanButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 56,
  },
  activeScanButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
  },
  activeNavText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});