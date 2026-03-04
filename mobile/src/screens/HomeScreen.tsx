import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../theme/ThemeContext';

// ============================================================================
// Types
// ============================================================================

interface StatCardProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface QuickActionProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

// ============================================================================
// Components
// ============================================================================

function StatCard({ title, value, icon, color }: StatCardProps) {
  const theme = useTheme();
  
  return (
    <View style={[styles.statCard, { backgroundColor: theme.colors.background.card }]}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: theme.colors.text.muted }]}>{title}</Text>
    </View>
  );
}

function QuickAction({ title, icon, onPress }: QuickActionProps) {
  const theme = useTheme();
  
  return (
    <TouchableOpacity
      style={[styles.quickAction, { backgroundColor: theme.colors.background.card }]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={28} color={theme.colors.brand.primary} />
      <Text style={[styles.quickActionText, { color: theme.colors.text.primary }]}>{title}</Text>
    </TouchableOpacity>
  );
}

// ============================================================================
// Main Screen
// ============================================================================

export default function HomeScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Refresh data
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Demo stats
  const stats = [
    { title: 'Pending', value: '5', icon: 'time-outline' as const, color: theme.colors.status.warning },
    { title: 'Signed', value: '23', icon: 'checkmark-circle-outline' as const, color: theme.colors.status.success },
    { title: 'Total', value: '48', icon: 'documents-outline' as const, color: theme.colors.brand.primary },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.text.muted }]}>
              Welcome back,
            </Text>
            <Text style={[styles.userName, { color: theme.colors.text.primary }]}>
              {user?.name || 'User'}
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.colors.text.primary}
            />
            <View style={[styles.notificationBadge, { backgroundColor: theme.colors.status.error }]}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsContainer}>
            <QuickAction
              title="New Document"
              icon="add-circle-outline"
              onPress={() => {}}
            />
            <QuickAction
              title="Sign Document"
              icon="create-outline"
              onPress={() => navigation.navigate('Documents')}
            />
            <QuickAction
              title="Templates"
              icon="copy-outline"
              onPress={() => {}}
            />
            <QuickAction
              title="Share"
              icon="share-outline"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Recent Activity
          </Text>
          <View style={[styles.activityCard, { backgroundColor: theme.colors.background.card }]}>
            {[
              { title: 'Contract signed', doc: 'Service Agreement.pdf', time: '2 hours ago' },
              { title: 'Document received', doc: 'NDA Template.pdf', time: '5 hours ago' },
              { title: 'Signature requested', doc: 'Employment Contract.pdf', time: '1 day ago' },
            ].map((activity, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.activityItem,
                  index > 0 && { borderTopWidth: 1, borderTopColor: theme.colors.border.light },
                ]}
              >
                <View style={[styles.activityIcon, { backgroundColor: theme.colors.brand.primary + '20' }]}>
                  <Ionicons
                    name="document-text"
                    size={20}
                    color={theme.colors.brand.primary}
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTitle, { color: theme.colors.text.primary }]}>
                    {activity.title}
                  </Text>
                  <Text style={[styles.activityDoc, { color: theme.colors.text.muted }]}>
                    {activity.doc}
                  </Text>
                </View>
                <Text style={[styles.activityTime, { color: theme.colors.text.muted }]}>
                  {activity.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statTitle: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  activityCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityDoc: {
    fontSize: 12,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
  },
});
