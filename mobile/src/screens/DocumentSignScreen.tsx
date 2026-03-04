import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import SignatureCanvas from 'react-native-signature-canvas';
import { useTheme } from '../theme/ThemeContext';
import type { RootStackParamList } from '../navigation/RootNavigator';

// ============================================================================
// Types
// ============================================================================

type DocumentSignScreenRouteProp = RouteProp<RootStackParamList, 'DocumentSign'>;

type SignatureMode = 'draw' | 'type';

// ============================================================================
// Main Screen
// ============================================================================

export default function DocumentSignScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<DocumentSignScreenRouteProp>();
  const signatureRef = useRef<SignatureCanvas>(null);

  const [mode, setMode] = useState<SignatureMode>('draw');
  const [signature, setSignature] = useState<string | null>(null);
  const [typedName, setTypedName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClear = () => {
    if (mode === 'draw') {
      signatureRef.current?.clearSignature();
    }
    setSignature(null);
    setTypedName('');
  };

  const handleSave = (sig: string) => {
    setSignature(sig);
  };

  const handleEnd = () => {
    signatureRef.current?.readSignature();
  };

  const handleSubmit = async () => {
    if (!signature && mode === 'draw') {
      Alert.alert('Error', 'Please draw your signature');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Submit signature to API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert('Success', 'Document signed successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit signature. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { width: screenWidth } = Dimensions.get('window');
  const canvasWidth = screenWidth - 40;
  const canvasHeight = 200;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      edges={['bottom']}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Document Preview */}
        <View style={[styles.documentPreview, { backgroundColor: theme.colors.background.card }]}>
          <View style={styles.documentHeader}>
            <Ionicons name="document-text" size={32} color={theme.colors.brand.primary} />
            <View style={styles.documentInfo}>
              <Text style={[styles.documentTitle, { color: theme.colors.text.primary }]}>
                Service Agreement 2024
              </Text>
              <Text style={[styles.documentMeta, { color: theme.colors.text.muted }]}>
                From: John Smith • 3 pages
              </Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.viewButton, { borderColor: theme.colors.border.light }]}>
            <Ionicons name="eye-outline" size={20} color={theme.colors.brand.primary} />
            <Text style={[styles.viewButtonText, { color: theme.colors.brand.primary }]}>
              View Document
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mode Tabs */}
        <View style={styles.modeTabs}>
          <TouchableOpacity
            style={[
              styles.modeTab,
              mode === 'draw' && { backgroundColor: theme.colors.brand.primary },
            ]}
            onPress={() => setMode('draw')}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={mode === 'draw' ? '#FFFFFF' : theme.colors.text.primary}
            />
            <Text
              style={[
                styles.modeTabText,
                { color: mode === 'draw' ? '#FFFFFF' : theme.colors.text.primary },
              ]}
            >
              Draw
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeTab,
              mode === 'type' && { backgroundColor: theme.colors.brand.primary },
            ]}
            onPress={() => setMode('type')}
          >
            <Ionicons
              name="text-outline"
              size={20}
              color={mode === 'type' ? '#FFFFFF' : theme.colors.text.primary}
            />
            <Text
              style={[
                styles.modeTabText,
                { color: mode === 'type' ? '#FFFFFF' : theme.colors.text.primary },
              ]}
            >
              Type
            </Text>
          </TouchableOpacity>
        </View>

        {/* Signature Area */}
        <View style={styles.signatureSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Your Signature
          </Text>

          {mode === 'draw' ? (
            <View
              style={[
                styles.canvasContainer,
                { backgroundColor: '#FFFFFF', borderColor: theme.colors.border.light },
              ]}
            >
              <SignatureCanvas
                ref={signatureRef}
                onOK={handleSave}
                onEnd={handleEnd}
                webStyle={`
                  .m-signature-pad {
                    box-shadow: none;
                    border: none;
                  }
                  .m-signature-pad--body {
                    border: none;
                  }
                  .m-signature-pad--footer {
                    display: none;
                  }
                  body, html {
                    width: ${canvasWidth}px;
                    height: ${canvasHeight}px;
                  }
                `}
                backgroundColor="white"
              />
              <View style={styles.canvasHint}>
                <Text style={[styles.canvasHintText, { color: theme.colors.text.muted }]}>
                  Sign above using your finger or stylus
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={[
                styles.typedSignatureContainer,
                { backgroundColor: '#FFFFFF', borderColor: theme.colors.border.light },
              ]}
            >
              <Text style={styles.typedSignature}>
                {typedName || 'Your Name'}
              </Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.signatureActions}>
            <TouchableOpacity
              style={[styles.actionButton, { borderColor: theme.colors.border.light }]}
              onPress={handleClear}
            >
              <Ionicons name="trash-outline" size={20} color={theme.colors.text.primary} />
              <Text style={[styles.actionButtonText, { color: theme.colors.text.primary }]}>
                Clear
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Agreement */}
        <View style={styles.agreementSection}>
          <TouchableOpacity style={styles.agreementCheckbox}>
            <Ionicons name="checkbox" size={24} color={theme.colors.brand.primary} />
            <Text style={[styles.agreementText, { color: theme.colors.text.secondary }]}>
              I agree that this electronic signature is the legally binding equivalent of my
              handwritten signature.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={[styles.footer, { borderTopColor: theme.colors.border.light }]}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.brand.primary },
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.submitButtonText}>Submitting...</Text>
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Sign Document</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  documentPreview: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  documentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  documentMeta: {
    fontSize: 12,
    marginTop: 4,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  modeTabs: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#F0F0F0',
  },
  modeTabText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  signatureSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  canvasContainer: {
    borderWidth: 2,
    borderRadius: 12,
    borderStyle: 'dashed',
    overflow: 'hidden',
    height: 200,
  },
  canvasHint: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  canvasHintText: {
    fontSize: 12,
  },
  typedSignatureContainer: {
    borderWidth: 2,
    borderRadius: 12,
    borderStyle: 'dashed',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typedSignature: {
    fontSize: 36,
    fontFamily: 'Courier',
    fontStyle: 'italic',
  },
  signatureActions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    marginLeft: 8,
  },
  agreementSection: {
    marginBottom: 24,
  },
  agreementCheckbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  agreementText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
