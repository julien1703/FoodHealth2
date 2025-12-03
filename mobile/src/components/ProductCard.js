import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { getHealthColor } from '../hooks/useProducts';

export default function ProductCard({ product, onPress }) {
  return (
    <Pressable style={styles.productCard} onPress={() => onPress(product)}>
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
  );
}

const styles = StyleSheet.create({
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  productImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  productBrand: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  scoreCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  scoreText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
