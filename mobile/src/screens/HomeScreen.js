import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { products } from '../data/products';
import { getProfile } from '../services/profileService';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    async function fetchUsername() {
      try {
        const session = await import('../supabaseClient').then(mod => mod.default.auth.getSession());
        const userId = (await session).data?.session?.user?.id;
        if (userId) {
          const profile = await getProfile(userId);
          setUsername(profile?.username || 'User');
        }
      } catch (e) {
        console.error('Error fetching username:', e);
        setUsername('User');
      }
    }
    fetchUsername();
  }, []);

  const openProduct = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const openScanner = () => {
    navigation.navigate('Scanner');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>Hello, {username} 👋</Text>
            <Text style={styles.subGreeting}>What are we eating today?</Text>
            
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Daily Tip */}
          <View style={styles.tipContainer}>
            <View style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Text style={styles.tipIcon}>⚡</Text>
                <Text style={styles.tipLabel}>DAILY TIP</Text>
              </View>
              <Text style={styles.tipTitle}>Watch out for E171</Text>
              <Text style={styles.tipDescription}>
                Titanium Dioxide is banned in Europe since 2022.
              </Text>
            </View>
          </View>

          {/* Products List */}
          <View style={styles.productsContainer}>
            <View style={styles.productsHeader}>
              <Text style={styles.sectionTitle}>Recent Scans</Text>
              <Pressable>
                <Text style={styles.viewAllText}>View All</Text>
              </Pressable>
            </View>
            
            <View style={styles.productsList}>
              {products.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((product) => (
                <Pressable
                  key={product.id}
                  style={styles.productCard}
                  onPress={() => openProduct(product)}
                >
                  <View style={styles.productImage}>
                    <Image source={{ uri: product.image }} style={styles.image} />
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productBrand}>{product.brand}</Text>
                  </View>
                  <View 
                    style={[styles.scoreCircle, { backgroundColor: product.color }]}
                  >
                    <Text style={styles.scoreText}>{product.score}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Scan Button */}
        <Pressable style={styles.scanButton} onPress={openScanner}>
          <Ionicons name="qr-code" size={28} color="#FFFFFF" />
        </Pressable>
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
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  searchContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  tipContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 20,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipIcon: {
    color: '#FDE047',
    fontSize: 16,
  },
  tipLabel: {
    color: '#FDE047',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  tipTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tipDescription: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  productsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  productsList: {
    gap: 12,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  productImage: {
    width: 56,
    height: 56,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  productBrand: {
    fontSize: 14,
    color: '#6B7280',
  },
  scoreCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  scanButton: {
    position: 'absolute',
    bottom: 32,
    left: '50%',
    transform: [{ translateX: -32 }],
    backgroundColor: '#111827',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
});