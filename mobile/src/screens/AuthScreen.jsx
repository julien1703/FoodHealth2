import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Pressable } from 'react-native';
import supabase from '../supabaseClient';
import { createProfile, getProfile } from '../services/profileService';

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        // Login mit Passwort
        const result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) {
          Alert.alert('Login Error', result.error.message);
        } else {
          console.log('Login successful');
          // Prüfe Onboarding-Status
          try {
            const profile = await getProfile(result.data.user.id);
            const hasCompletedOnboarding = profile?.onboarding_completed;
            
            if (hasCompletedOnboarding) {
              navigation.replace('Main');
            } else {
              navigation.replace('Onboarding');
            }
          } catch (err) {
            navigation.replace('Main');
          }
        }
      } else {
        // Registrierung mit E-Mail-Code
        const result = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: null,
            data: {
              email_confirm_redirect_to: null
            }
          }
        });
        
        if (result.error) {
          Alert.alert('Registration Error', result.error.message);
        } else if (!result.data.session) {
          // User muss E-Mail bestätigen
          console.log('User created, needs email verification');
          setShowVerification(true);
          Alert.alert(
            'Check your email',
            'We sent you an 8-digit code. Enter it below to verify your account.'
          );
        } else {
          // Falls Session direkt verfügbar
          await createProfile(result.data.user.id, username || 'User');
          navigation.replace('Onboarding');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      Alert.alert('Error', err.message);
    }
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 8) {
      Alert.alert('Error', 'Please enter a valid 8-digit code');
      return;
    }

    setVerificationLoading(true);
    try {
      const result = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: 'signup'
      });

      if (result.error) {
        Alert.alert('Verification Error', result.error.message);
      } else {
        console.log('Email verified successfully');
        // Erstelle Profil nach Verifizierung
        await createProfile(result.data.user.id, username || 'User');
        Alert.alert('Success', 'Email verified! Welcome to the app.');
        navigation.replace('Onboarding');
      }
    } catch (err) {
      console.error('Verification error:', err);
      Alert.alert('Error', err.message);
    }
    setVerificationLoading(false);
  };

  const resendCode = async () => {
    try {
      const result = await supabase.auth.resend({
        type: 'signup',
        email
      });
      
      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        Alert.alert('Code Sent', 'A new verification code has been sent to your email.');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  if (showVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>
          We sent an 8-digit code to {email}. Enter it below:
        </Text>
        
        <TextInput
          style={[styles.input, styles.codeInput]}
          placeholder="00000000"
          keyboardType="number-pad"
          maxLength={8}
          textAlign="center"
          value={verificationCode}
          onChangeText={setVerificationCode}
        />
        
        <Button 
          title={verificationLoading ? 'Verifying...' : 'Verify Code'} 
          onPress={handleVerifyCode} 
          disabled={verificationLoading}
        />
        
        <Text style={styles.switch} onPress={resendCode}>
          Didn't receive the code? Resend
        </Text>
        
        <Text style={styles.switch} onPress={() => setShowVerification(false)}>
          ← Back to registration
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</Text>
      
      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
      )}
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <Button 
        title={loading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Login' : 'Sign Up')} 
        onPress={handleAuth} 
        disabled={loading}
      />
      
      <Text style={styles.switch} onPress={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Don\'t have an account? Sign up' : 'Already have an account? Login'}
      </Text>
      
      {/* Social Login Placeholder */}
      <View style={styles.socialContainer}>
        <Text style={styles.orText}>or</Text>
        <Pressable style={styles.socialButton} disabled>
          <Text style={styles.socialButtonText}>📧 Continue with Google (Coming Soon)</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  codeInput: {
    fontSize: 24,
    letterSpacing: 8,
    fontFamily: 'monospace',
  },
  switch: {
    marginTop: 16,
    color: '#007AFF',
    textAlign: 'center',
  },
  socialContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  orText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  socialButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    opacity: 0.6,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});