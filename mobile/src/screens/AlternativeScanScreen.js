import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  TextInput,
  ActivityIndicator,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { analyzeProduct } from '../services/openAI';

export default function AlternativeScanScreen({ navigation }) {
  const [manualInput, setManualInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleManualScan = async () => {
    if (!manualInput.trim()) {
      Alert.alert('Fehler', 'Bitte gib eine Produkt-ID oder einen Namen ein');
      return;
    }

    setLoading(true);
    try {
      // Simuliere Barcode-Scan durch manuelle Eingabe
      const mockProductData = {
        name: manualInput,
        brand: 'Test Brand',
        barcode: '1234567890',
        ingredients: ['Zucker', 'Wasser', 'Aroma'],
        nutrition: {
          energy: '150 kJ',
          fat: '0g',
          sugar: '10g',
          salt: '0.1g'
        }
      };

      console.log('🔍 Analysiere Produkt:', mockProductData.name);
      const analysisResult = await analyzeProduct(mockProductData);
      
      console.log('✅ AI Analyse abgeschlossen:', analysisResult);
      
      // Navigation zur Detailseite mit AI Ergebnis
      navigation.navigate('ProductDetail', { 
        product: analysisResult,
        fromScan: true 
      });
      
    } catch (error) {
      console.error('❌ Scan Fehler:', error);
      Alert.alert(
        'Analyse Fehler', 
        'OpenAI Analyse fehlgeschlagen. Prüfe deine Internetverbindung und API Key.'
      );
    } finally {
      setLoading(false);
      setManualInput('');
    }
  };

  const handleTestProduct = async (productName, productData) => {
    setLoading(true);
    try {
      console.log('🧪 Teste Produkt:', productName);
      const analysisResult = await analyzeProduct(productData);
      
      console.log('✅ Test Analyse abgeschlossen:', analysisResult);
      
      navigation.navigate('ProductDetail', { 
        product: analysisResult,
        fromScan: true 
      });
      
    } catch (error) {
      console.error('❌ Test Fehler:', error);
      Alert.alert(
        'Test Fehler', 
        'OpenAI Analyse fehlgeschlagen. Prüfe deine API Key Konfiguration.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Test Produkte
  const testProducts = [
    {
      name: 'Coca Cola',
      brand: 'The Coca-Cola Company',
      barcode: '5000112548167',
      ingredients: ['Wasser', 'Zucker', 'Kohlensäure', 'Säuerungsmittel Phosphorsäure', 'Aroma', 'Koffein'],
      nutrition: {
        energy: '180 kJ (42 kcal)',
        fat: '0g',
        sugar: '10.6g',
        salt: '0g',
        additives: ['E338 - Phosphorsäure']
      }
    },
    {
      name: 'Nutella',
      brand: 'Ferrero',
      barcode: '8000500037560',
      ingredients: ['Zucker', 'Palmöl', 'Haselnüsse (13%)', 'Magermilchpulver', 'Kakao', 'Emulgator Lecithine (Soja)', 'Vanillin'],
      nutrition: {
        energy: '2252 kJ (539 kcal)',
        fat: '30.9g',
        sugar: '56.3g',
        salt: '0.107g'
      }
    }
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>🤖 AI analysiert Produkt...</Text>
        <Text style={styles.subText}>Das dauert 3-10 Sekunden</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="scan" size={60} color="#4CAF50" />
        <Text style={styles.title}>Produkt Scanner</Text>
        <Text style={styles.subtitle}>
          {Platform.OS === 'web' ? 'Web Modus - Manuelle Eingabe' : 'Demo Modus - Teste die AI'}
        </Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Manueller Scan</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Produkt Name eingeben (z.B. 'Coca Cola')"
          value={manualInput}
          onChangeText={setManualInput}
          onSubmitEditing={handleManualScan}
        />
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={handleManualScan}
          disabled={loading}
        >
          <Ionicons name="search" size={20} color="white" />
          <Text style={styles.buttonText}>AI Analyse starten</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>Test Produkte (mit echten Daten)</Text>
        {testProducts.map((product, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.testButton}
            onPress={() => handleTestProduct(product.name, product)}
            disabled={loading}
          >
            <Ionicons name="flask" size={20} color="#4CAF50" />
            <Text style={styles.testButtonText}>{product.name} testen</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoSection}>
        <Ionicons name="information-circle" size={24} color="#2196F3" />
        <Text style={styles.infoText}>
          Diese Demo verwendet OpenAI GPT-3.5-turbo für Produktanalyse. 
          Jede Analyse kostet ca. $0.01 - mit deinen $5 sind ~400-500 Analysen möglich.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    color: '#333',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  testSection: {
    marginBottom: 30,
  },
  testButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
    gap: 8,
  },
  testButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
});