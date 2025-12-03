import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function FilterDropdown({ visible, healthFilter, onSelect, screenType }) {
  if (!visible) return null;

  return (
    <View style={styles.filterDropdown}>
      <Pressable
        style={[styles.filterOption, healthFilter === 'all' && styles.activeFilterOption]}
        onPress={() => onSelect('all')}
      >
        <Text style={[styles.filterText, healthFilter === 'all' && styles.activeFilterText]}>
          {screenType === 'scan' ? 'All Scans' : 'All Products'}
        </Text>
      </Pressable>

      <Pressable
        style={[styles.filterOption, healthFilter === 'good' && styles.activeFilterOption]}
        onPress={() => onSelect('good')}
      >
        <Text style={[styles.filterText, healthFilter === 'good' && styles.activeFilterText]}>Good Only</Text>
      </Pressable>

      <Pressable
        style={[styles.filterOption, healthFilter === 'moderate' && styles.activeFilterOption]}
        onPress={() => onSelect('moderate')}
      >
        <Text style={[styles.filterText, healthFilter === 'moderate' && styles.activeFilterText]}>Moderate Only</Text>
      </Pressable>

      <Pressable
        style={[styles.filterOption, healthFilter === 'poor' && styles.activeFilterOption]}
        onPress={() => onSelect('poor')}
      >
        <Text style={[styles.filterText, healthFilter === 'poor' && styles.activeFilterText]}>Poor Only</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  filterDropdown: {
    position: 'absolute',
    top: 56,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 50,
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  activeFilterOption: {
    backgroundColor: '#F0FFF4',
    borderRadius: 8,
  },
  filterText: {
    color: '#111827',
  },
  activeFilterText: {
    color: '#065F46',
    fontWeight: '700',
  }
});
