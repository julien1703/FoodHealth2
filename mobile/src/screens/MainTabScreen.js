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
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// TEMPORÄR: Native Module für Expo Go auskommentiert
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import { Camera } from 'expo-camera';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import FilterDropdown from '../components/FilterDropdown';
import useFilteredProducts, { getHealthColor } from '../hooks/useProducts';
import { analyzeProduct, getProductInfo } from '../services/openAI';
import supabase from '../supabaseClient';
import { getUserScans } from '../services/scanService';
import { getSavedProducts } from '../services/savedProductsService';
import { waitForSession } from '../services/sessionService';

const { width: screenWidth } = Dimensions.get('window');

export default function MainTabScreen({ navigation }) {
  const [currentView, setCurrentView] = useState('scan'); // Standard ist Scan
  const [searchQuery, setSearchQuery] = useState('');
  const [healthFilter, setHealthFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Camera and scanning states
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  
  // Recent Scans und Saved Products - aus Supabase
  const [recentScans, setRecentScans] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  // Session-Management und Daten-Laden
  useEffect(() => {
    initializeSession();
    requestCameraPermission();

    // Supabase-Session-Listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('MainTab Auth State Change:', event, session?.user?.id);
      if (session?.user?.id) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
        setRecentScans([]);
        setSavedProducts([]);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Daten laden wenn userId verfügbar ist
  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const initializeSession = async () => {
    try {
      // Kurzes Delay für Session-Initialisierung
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let sessionData = await supabase.auth.getSession();
      console.log('MainTab Session Data (first try):', sessionData.data?.session?.user?.id);
      
      if (!sessionData.data?.session?.user) {
        console.log('No session found, trying refresh...');
        await supabase.auth.refreshSession();
        sessionData = await supabase.auth.getSession();
        console.log('MainTab Session Data (after refresh):', sessionData.data?.session?.user?.id);
      }
      
      if (sessionData.data?.session?.user?.id) {
        setUserId(sessionData.data.session.user.id);
      } else {
        console.log('Still no session found in MainTab');
        // Versuche getUser als Fallback
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.id) {
          console.log('Found user via getUser:', userData.user.id);
          setUserId(userData.user.id);
        }
      }
    } catch (error) {
      console.error('MainTab Session Error:', error);
    }
  };

  const loadUserData = async () => {
    if (!userId) return;
    
    console.log('Loading user data for:', userId);
    setLoadingData(true);
    
    try {
      // Parallel laden für bessere Performance
      const [scansData, savedData] = await Promise.all([
        getUserScans(),
        getSavedProducts()
      ]);
      
      console.log('Loaded scans:', scansData?.length || 0);
      console.log('Loaded saved products:', savedData?.length || 0);
      
      setRecentScans(scansData || []);
      setSavedProducts(savedData || []);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  // Kamera-Berechtigungen anfordern (temporär deaktiviert für Expo Go)
  const requestCameraPermission = async () => {
    // const { status } = await Camera.requestCameraPermissionsAsync();
    // setHasPermission(status === 'granted');
    setHasPermission(false); // Temporär für Expo Go
  };

  // Echte Kamera-Barcode-Scanner
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setShowCamera(false);
    console.log('🔍 Barcode gescannt:', data);
    
    // Sofort OpenAI Analyse starten
    await handleRealBarcodeScan(data);
  };

  const startScanning = async () => {
    // Temporär für Expo Go: Direkt zur manuellen Eingabe
    Alert.alert(
      'Kamera nicht verfügbar',
      'Kamera-Features sind in Expo Go nicht verfügbar. Verwende die manuelle Eingabe.',
      [
        { text: 'OK', onPress: () => setShowBarcodeInput(true) }
      ]
    );
  };

  const startManualInput = () => {
    setShowBarcodeInput(true);
  };

  const openProduct = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  // ECHTER BARCODE SCAN - Manuelle Eingabe mit echter OpenAI Analysis
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showBarcodeInput, setShowBarcodeInput] = useState(false);

  const handleRealBarcodeScan = async (barcode) => {
    setAnalyzing(true);
    setShowBarcodeInput(false);
    
    try {
      // Step 1: Hole echte Produktinfos mit dem Barcode
      const productInfo = await getProductInfo(barcode);
      
      // Step 2: Sende an OpenAI für Analyse (nutzt dein Template)
      const analysis = await analyzeProduct(productInfo);
      
      // Step 3: In Supabase speichern falls User eingeloggt
      if (userId) {
        console.log('Saving scan to Supabase for userId:', userId);
        const scanData = {
          user_id: userId,
          product_id: barcode,
          product_data: { ...analysis, barcode, scannedAt: new Date().toISOString() },
          scanned_at: new Date().toISOString(),
        };
        
        try {
          const { error } = await supabase.from('scans').insert([scanData]);
          if (error) {
            console.error('Scan save error:', error);
          } else {
            console.log('Scan saved successfully');
            // Recent Scans neu laden
            setTimeout(() => {
              loadUserData();
            }, 500);
          }
        } catch (err) {
          console.error('Scan save catch error:', err);
        }
      } else {
        console.log('No userId available, skipping scan save (user might still be logging in)');
      }
      
      // Step 4: Navigiere zur Detail-Seite mit AI-Analyse
      navigation.navigate('ProductDetail', { product: analysis });
      
    } catch (error) {
      Alert.alert('Analysis Failed', error.message);
    } finally {
      setAnalyzing(false);
      setBarcodeInput('');
    }
  };

  const quickTestProducts = [
    { name: 'Coca Cola (Test)', barcode: '5000112546415' },
    { name: 'Nutella (Test)', barcode: '8000500037508' },
    { name: 'Red Bull (Test)', barcode: '9002490100026' }
  ];

  const handleQuickTest = (testProduct) => {
    setBarcodeInput(testProduct.barcode);
    handleRealBarcodeScan(testProduct.barcode);
  };

  // Hooks immer initialisieren, Listen je nach View wählen
  const filteredProductsScan = recentScans?.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = healthFilter === 'all' ||
                         (healthFilter === 'good' && product.score >= 70) ||
                         (healthFilter === 'moderate' && product.score >= 40 && product.score < 70) ||
                         (healthFilter === 'poor' && product.score < 40);
    return matchesSearch && matchesFilter;
  }) || [];
  
  const filteredProductsOther = useFilteredProducts(products, searchQuery, healthFilter);
  const filterProducts = (list, includeLimit = false) => includeLimit ? list.slice(0, 3) : list;
  const getFilterButtonText = (screenType) => {
    if (healthFilter === 'all') return screenType === 'scan' ? 'All Scans' : screenType === 'saved' ? 'All Saved' : 'All Products';
    if (healthFilter === 'good') return 'Good Only';
    if (healthFilter === 'moderate') return 'Moderate Only';
    return 'Poor Only';
  };

  // ==================== SCAN SCREEN ====================
  if (currentView === 'scan') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* Fixed Header */}
          <View style={[styles.header, { backgroundColor: '#FFFFFF' }]}>
            <View style={styles.logoContainer}>
              <Text style={[styles.logo, { color: '#000' }]}>chec</Text>
              <Text style={[styles.logo, { color: '#10B981' }]}>K</Text>
              <Text style={[styles.logo, { color: '#000' }]}>it</Text>
            </View>
            <Pressable style={styles.menuButton}>
              <Text style={{ fontSize: 24, color: '#1F2937' }}>☰</Text>
            </Pressable>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* ECHTER BARCODE SCANNER - Manuelle Eingabe */}
            <View style={styles.scannerSection}>
              <View style={styles.cameraContainer}>
                {!showBarcodeInput ? (
                  <Pressable style={styles.cameraFallback} onPress={startScanning}>
                    <Image
                      source={{ uri: 'https://images.unsplash.com/photo-1556909114-5-brooklyn-bridge-new-york?w=800&h=600&fit=crop&auto=format' }}
                      style={styles.fallbackImage}
                    />
                    <View style={styles.scanButton}>
                      <Text style={styles.scanButtonText}>� Scan Barcode</Text>
                    </View>
                  </Pressable>
                ) : (
                  <View style={styles.barcodeInputContainer}>
                    <Text style={styles.inputLabel}>Enter Barcode:</Text>
                    <TextInput
                      style={styles.barcodeInput}
                      value={barcodeInput}
                      onChangeText={setBarcodeInput}
                      placeholder="e.g. 5000112546415"
                      keyboardType="numeric"
                      autoFocus
                    />
                    <View style={styles.inputButtons}>
                      <Pressable 
                        style={[styles.inputButton, styles.cancelButton]} 
                        onPress={() => {setShowBarcodeInput(false); setBarcodeInput('');}}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </Pressable>
                      <Pressable 
                        style={[styles.inputButton, styles.scanInputButton]} 
                        onPress={() => handleRealBarcodeScan(barcodeInput)}
                        disabled={!barcodeInput}
                      >
                        <Text style={styles.scanInputButtonText}>Analyze</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
                
                {/* Scan Corners */}
                <View style={[styles.scanCorner, styles.topLeft]} />
                <View style={[styles.scanCorner, styles.topRight]} />
                <View style={[styles.scanCorner, styles.bottomLeft]} />
                <View style={[styles.scanCorner, styles.bottomRight]} />
                
                {/* Loading Overlay */}
                {analyzing && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#10B981" />
                    <Text style={styles.loadingText}>Analyzing Product...</Text>
                  </View>
                )}
              </View>
              <Text style={styles.scanInstruction}>
                Scan with camera or enter barcode manually
              </Text>
              
              <Pressable 
                style={styles.manualInputButton} 
                onPress={startManualInput}
              >
                <Text style={styles.manualInputText}>📝 Enter Barcode Manually</Text>
              </Pressable>
              
              {/* Quick Test Buttons */}
              <View style={styles.quickTestContainer}>
                <Text style={styles.quickTestLabel}>Quick Test:</Text>
                <View style={styles.quickTestButtons}>
                  {quickTestProducts.map((product, index) => (
                    <Pressable
                      key={index}
                      style={styles.quickTestButton}
                      onPress={() => handleQuickTest(product)}
                    >
                      <Text style={styles.quickTestButtonText}>{product.name}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            {/* Gray Background Section */}
            <View style={styles.scanGraySection}>
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
                  <FilterDropdown
                    visible={showFilterDropdown}
                    healthFilter={healthFilter}
                    screenType={'scan'}
                    onSelect={(value) => { setHealthFilter(value); setShowFilterDropdown(false); }}
                  />
                </View>
              </View>
              
              <View style={[styles.productList, { paddingHorizontal: 24 }]}> 
                {loadingData ? (
                  <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 32 }} />
                ) : filteredProductsScan.length > 0 ? (
                  filterProducts(filteredProductsScan, true).map((product) => (
                    <ProductCard key={product.scan_id || product.id} product={product} onPress={openProduct} />
                  ))
                ) : userId ? (
                  <View style={{ alignItems: 'center', marginTop: 48 }}>
                    <Text style={{ fontSize: 18, color: '#6B7280', marginBottom: 8 }}>No recent scans</Text>
                    <Text style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center' }}>
                      Start scanning products to see your scan history here
                    </Text>
                  </View>
                ) : (
                  <View style={{ alignItems: 'center', marginTop: 48 }}>
                    <Text style={{ fontSize: 18, color: '#6B7280', marginBottom: 8 }}>Please log in</Text>
                    <Text style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center' }}>
                      Log in to save and view your scan history
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
          
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
    // Verwende savedProducts aus Supabase statt statische products
    const currentSavedProducts = savedProducts || [];
    const goodCount = currentSavedProducts.filter(p => p.score >= 70).length;
    const moderateCount = currentSavedProducts.filter(p => p.score >= 40 && p.score < 70).length;
    const poorCount = currentSavedProducts.filter(p => p.score < 40).length;
    const total = currentSavedProducts.length;

    const goodPercent = total > 0 ? (goodCount / total) * 100 : 0;
    const moderatePercent = total > 0 ? (moderateCount / total) * 100 : 0;
    const poorPercent = total > 0 ? (poorCount / total) * 100 : 0;

    // Gefilterte Saved Products für Anzeige
    const filteredSavedProducts = currentSavedProducts.filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = healthFilter === 'all' ||
                           (healthFilter === 'good' && product.score >= 70) ||
                           (healthFilter === 'moderate' && product.score >= 40 && product.score < 70) ||
                           (healthFilter === 'poor' && product.score < 40);
      return matchesSearch && matchesFilter;
    });

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* White Background Section - Fixed */}
          <View style={styles.savedWhiteSection}>
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

          {/* Gray Background Section - Scrollable */}
          <View style={styles.savedGraySection}>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                  <FilterDropdown
                    visible={showFilterDropdown}
                    healthFilter={healthFilter}
                    screenType={'saved'}
                    onSelect={(value) => { setHealthFilter(value); setShowFilterDropdown(false); }}
                  />
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

              {/* Saved Products List */}
              <View style={[styles.productList, { paddingHorizontal: 24 }]}> 
                {loadingData ? (
                  <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 32 }} />
                ) : filteredSavedProducts.length > 0 ? (
                  filteredSavedProducts.map((product) => (
                    <ProductCard key={product.save_id || product.id} product={product} onPress={openProduct} />
                  ))
                ) : (
                  <View style={{ alignItems: 'center', marginTop: 48 }}>
                    <Text style={{ fontSize: 18, color: '#6B7280', marginBottom: 8 }}>No saved products</Text>
                    <Text style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center' }}>
                      Start scanning and saving products to see them here
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
          
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
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  closeCameraButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    marginTop: 20,
  },
  closeCameraText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scanFrame: {
    width: 250,
    height: 150,
    position: 'relative',
  },
  scanInstructions: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 30,
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

  // Camera Scanner Styles
  camera: {
    flex: 1,
  },
  scanButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -60 }],
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
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
  // Kamera Styles
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  closeCameraButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    marginTop: 20,
  },
  closeCameraText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scanFrame: {
    width: 250,
    height: 150,
    position: 'relative',
  },
  scanInstructions: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 30,
  },
  manualInputButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 24,
    marginTop: 16,
    alignItems: 'center',
  },
  manualInputText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Neue Styles für echten Barcode Scanner
  barcodeInputContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    margin: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  barcodeInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  inputButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  inputButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  scanInputButton: {
    backgroundColor: '#10B981',
  },
  scanInputButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  quickTestContainer: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  quickTestLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  quickTestButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickTestButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickTestButtonText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '500',
  },
});