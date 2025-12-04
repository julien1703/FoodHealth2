import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Pressable
} from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function ScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loadingScans, setLoadingScans] = useState(false);
  const [errorScans, setErrorScans] = useState(null);

  useEffect(() => {
    getCameraPermissions();
    fetchUserIdFromSession();

    // Supabase-Session-Listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.id) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
        setRecentScans([]);
      }
    });
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userId) {
      setLoadingScans(true);
      loadRecentScans();
    }
  }, [userId]);

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const fetchUserIdFromSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (data?.session?.user?.id) {
      setUserId(data.session.user.id);
    } else {
      setUserId(null);
    }
  };

  const loadRecentScans = async () => {
    setErrorScans(null);
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', userId)
        .order('scanned_at', { ascending: false })
        .limit(5);
      if (error) {
        setErrorScans(error.message);
        setRecentScans([]);
      } else {
        setRecentScans(data);
      }
    } catch (err) {
      setErrorScans(err.message);
      setRecentScans([]);
    }
    setLoadingScans(false);
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    // Produktdaten speichern
    if (userId) {
      const scanData = {
        user_id: userId,
        product_id: data,
        product_data: { id: data },
        scanned_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('scans').insert([scanData]);
      if (!error) {
        loadRecentScans();
      }
    }

    Alert.alert(
      'Barcode Scanned!',
      `Found product: ${data}`,
      [
        { 
          text: 'Scan Again', 
          onPress: () => setScanned(false),
          style: 'cancel'
        },
        { 
          text: 'View Product', 
          onPress: () => {
            navigation.goBack();
          }
        }
      ]
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color="#9CA3AF" />
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionMessage}>
            To scan product barcodes, please allow camera access in your device settings.
          </Text>
          <Pressable style={styles.settingsButton} onPress={getCameraPermissions}>
            <Text style={styles.settingsButtonText}>Grant Permission</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <SafeAreaView style={styles.overlay}>
          {/* Top Controls */}
          <View style={styles.topControls}>
            <Pressable style={styles.controlButton} onPress={goBack}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Scanner Frame */}
          <View style={styles.scannerContainer}>
            <View style={styles.scannerFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Scan Product Barcode</Text>
            <Text style={styles.instructionsText}>
              Position the barcode within the frame to get instant food safety information
            </Text>
            {scanned && (
              <Pressable 
                style={styles.scanAgainButton}
                onPress={() => setScanned(false)}
              >
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.scanAgainText}>Scan Again</Text>
              </Pressable>
            )}
          </View>

          {/* Recent Scans mit Loading/Error-Handling */}
          {userId && (
            <View style={{ marginTop: 24, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Recent Scans</Text>
              {loadingScans && (
                <Text style={{ color: '#fff' }}>Lade Scans...</Text>
              )}
              {errorScans && (
                <Text style={{ color: 'red' }}>Fehler: {errorScans}</Text>
              )}
              {!loadingScans && !errorScans && recentScans.length === 0 && (
                <Text style={{ color: '#ccc' }}>Keine Scans gefunden.</Text>
              )}
              {!loadingScans && !errorScans && recentScans.length > 0 && (
                recentScans.map((scan) => (
                  <View key={scan.id || scan.uuid} style={{ marginBottom: 8 }}>
                    <Text style={{ color: '#fff' }}>Product: {scan.product_id}</Text>
                    <Text style={{ color: '#ccc', fontSize: 12 }}>Scanned: {new Date(scan.scanned_at).toLocaleString()}</Text>
                  </View>
                ))
              )}
            </View>
          )}
        </SafeAreaView>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topControls: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  scannerFrame: {
    width: 280,
    height: 200,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#10B981',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionsContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  instructionsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionsText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  scanAgainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#F9FAFB',
  },
  permissionText: {
    color: '#6B7280',
    fontSize: 16,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  permissionMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  settingsButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});