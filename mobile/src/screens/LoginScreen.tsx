import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../theme/ThemeContext';

export default function LoginScreen() {
  const theme = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);

    if (!success) {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    logo: {
      alignItems: 'center',
      marginBottom: theme.spacing['3xl'],
    },
    logoText: {
      fontSize: 32,
      fontWeight: '700',
      color: theme.colors.brand.primary,
    },
    logoSubtext: {
      fontSize: 14,
      color: theme.colors.text.muted,
      marginTop: theme.spacing.xs,
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
    },
    input: {
      backgroundColor: theme.colors.background.input,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: 16,
      color: theme.colors.text.primary,
    },
    inputFocused: {
      borderColor: theme.colors.brand.primary,
    },
    button: {
      backgroundColor: theme.colors.brand.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    forgotPassword: {
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    forgotPasswordText: {
      color: theme.colors.brand.primary,
      fontSize: 14,
    },
    footer: {
      alignItems: 'center',
      marginTop: theme.spacing['3xl'],
    },
    footerText: {
      color: theme.colors.text.muted,
      fontSize: 12,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.logo}>
          <Text style={styles.logoText}>SignPortal</Text>
          <Text style={styles.logoSubtext}>Secure Document Signing</Text>
        </View>

        <Text style={styles.title}>Welcome Back</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={theme.colors.text.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={theme.colors.text.muted}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 SignPortal. All rights reserved.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
