import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../theme/ThemeContext';

// ============================================================================
// Types
// ============================================================================

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  destructive?: boolean;
}

// ============================================================================
// Components
// ============================================================================

function MenuItem({ icon, title, subtitle, onPress, showChevron = true, destructive = false }: MenuItemProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor: theme.colors.background.card }]}
      onPress={onPress}
    >
      <View
        style={[
          styles.menuIconContainer,
          {
            backgroundColor: destructive
              ? theme.colors.status.error + '20'
              : theme.colors.brand.primary + '20',
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={destructive ? theme.colors.status.error : theme.colors.brand.primary}
        />
      </View>
      <View style={styles.menuContent}>
        <Text
          style={[
            styles.menuTitle,
            {
              color: destructive ? theme.colors.status.error : theme.colors.text.primary,
            },
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.menuSubtitle, { color: theme.colors.text.muted }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.muted} />
      )}
    </TouchableOpacity>
  );
}

// ============================================================================
// Main Screen
// ============================================================================

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.colors.background.card }]}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.brand.primary }]}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            )}
          </View>
          <Text style={[styles.userName, { color: theme.colors.text.primary }]}>
            {user?.name || 'Guest User'}
          </Text>
          <Text style={[styles.userEmail, { color: theme.colors.text.muted }]}>
            {user?.email || 'guest@example.com'}
          </Text>
          <View style={[styles.roleBadge, { backgroundColor: theme.colors.brand.primary + '20' }]}>
            <Text style={[styles.roleText, { color: theme.colors.brand.primary }]}>
              {user?.role?.replace('_', ' ')?.toUpperCase() || 'USER'}
            </Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.muted }]}>Account</Text>
          <MenuItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() => {}}
          />
          <MenuItem
            icon="key-outline"
            title="Change Password"
            subtitle="Update your security credentials"
            onPress={() => {}}
          />
          <MenuItem
            icon="shield-checkmark-outline"
            title="Two-Factor Authentication"
            subtitle="Add an extra layer of security"
            onPress={() => {}}
          />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.muted }]}>Preferences</Text>
          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage your notification settings"
            onPress={() => {}}
          />
          <MenuItem
            icon="moon-outline"
            title="Appearance"
            subtitle="Light mode"
            onPress={() => {}}
          />
          <MenuItem
            icon="language-outline"
            title="Language"
            subtitle="English"
            onPress={() => {}}
          />
        </View>

        {/* Signatures Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.muted }]}>Signatures</Text>
          <MenuItem
            icon="create-outline"
            title="My Signatures"
            subtitle="Manage your saved signatures"
            onPress={() => {}}
          />
          <MenuItem
            icon="finger-print-outline"
            title="Default Signature"
            subtitle="Set your default signing method"
            onPress={() => {}}
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.muted }]}>Support</Text>
          <MenuItem
            icon="help-circle-outline"
            title="Help Center"
            onPress={() => {}}
          />
          <MenuItem
            icon="chatbubble-outline"
            title="Contact Support"
            onPress={() => {}}
          />
          <MenuItem
            icon="document-text-outline"
            title="Terms of Service"
            onPress={() => {}}
          />
          <MenuItem
            icon="shield-outline"
            title="Privacy Policy"
            onPress={() => {}}
          />
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.muted }]}>Danger Zone</Text>
          <MenuItem
            icon="log-out-outline"
            title="Sign Out"
            onPress={handleLogout}
            destructive
          />
          <MenuItem
            icon="trash-outline"
            title="Delete Account"
            subtitle="Permanently delete your account and data"
            onPress={handleDeleteAccount}
            destructive
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appInfoText, { color: theme.colors.text.muted }]}>
            SignPortal v1.0.0
          </Text>
          <Text style={[styles.appInfoText, { color: theme.colors.text.muted }]}>
            © 2024 SignPortal. All rights reserved.
          </Text>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  profileCard: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 32,
    borderRadius: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 12,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appInfoText: {
    fontSize: 12,
    marginBottom: 4,
  },
});
