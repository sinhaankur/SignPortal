import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';

// ============================================================================
// Types
// ============================================================================

type DocumentStatus = 'pending' | 'signed' | 'draft' | 'expired';

interface Document {
  id: string;
  title: string;
  status: DocumentStatus;
  sender: string;
  date: string;
  dueDate?: string;
}

// ============================================================================
// Demo Data
// ============================================================================

const demoDocuments: Document[] = [
  {
    id: '1',
    title: 'Service Agreement 2024',
    status: 'pending',
    sender: 'John Smith',
    date: 'Jan 15, 2024',
    dueDate: 'Jan 20, 2024',
  },
  {
    id: '2',
    title: 'NDA - Project Alpha',
    status: 'signed',
    sender: 'Sarah Johnson',
    date: 'Jan 12, 2024',
  },
  {
    id: '3',
    title: 'Employment Contract',
    status: 'pending',
    sender: 'HR Department',
    date: 'Jan 10, 2024',
    dueDate: 'Jan 25, 2024',
  },
  {
    id: '4',
    title: 'Vendor Agreement',
    status: 'draft',
    sender: 'You',
    date: 'Jan 8, 2024',
  },
  {
    id: '5',
    title: 'Lease Renewal',
    status: 'expired',
    sender: 'Property Manager',
    date: 'Dec 15, 2023',
    dueDate: 'Dec 31, 2023',
  },
  {
    id: '6',
    title: 'Partnership Agreement',
    status: 'signed',
    sender: 'Business Partners',
    date: 'Dec 10, 2023',
  },
];

// ============================================================================
// Components
// ============================================================================

function StatusBadge({ status }: { status: DocumentStatus }) {
  const theme = useTheme();
  
  const getStatusStyle = () => {
    switch (status) {
      case 'pending':
        return { bg: theme.colors.status.warning + '20', color: theme.colors.status.warning };
      case 'signed':
        return { bg: theme.colors.status.success + '20', color: theme.colors.status.success };
      case 'draft':
        return { bg: theme.colors.status.info + '20', color: theme.colors.status.info };
      case 'expired':
        return { bg: theme.colors.status.error + '20', color: theme.colors.status.error };
      default:
        return { bg: theme.colors.text.muted + '20', color: theme.colors.text.muted };
    }
  };

  const style = getStatusStyle();

  return (
    <View style={[styles.statusBadge, { backgroundColor: style.bg }]}>
      <Text style={[styles.statusText, { color: style.color }]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
}

function DocumentCard({ document, onPress }: { document: Document; onPress: () => void }) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.documentCard, { backgroundColor: theme.colors.background.card }]}
      onPress={onPress}
    >
      <View style={styles.documentHeader}>
        <View style={[styles.documentIcon, { backgroundColor: theme.colors.brand.primary + '20' }]}>
          <Ionicons name="document-text" size={24} color={theme.colors.brand.primary} />
        </View>
        <View style={styles.documentInfo}>
          <Text style={[styles.documentTitle, { color: theme.colors.text.primary }]} numberOfLines={1}>
            {document.title}
          </Text>
          <Text style={[styles.documentSender, { color: theme.colors.text.muted }]}>
            From: {document.sender}
          </Text>
        </View>
        <StatusBadge status={document.status} />
      </View>
      <View style={styles.documentFooter}>
        <View style={styles.documentDate}>
          <Ionicons name="calendar-outline" size={14} color={theme.colors.text.muted} />
          <Text style={[styles.documentDateText, { color: theme.colors.text.muted }]}>
            {document.date}
          </Text>
        </View>
        {document.dueDate && (
          <View style={styles.documentDate}>
            <Ionicons name="time-outline" size={14} color={theme.colors.status.warning} />
            <Text style={[styles.documentDateText, { color: theme.colors.status.warning }]}>
              Due: {document.dueDate}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ============================================================================
// Main Screen
// ============================================================================

export default function DocumentsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<DocumentStatus | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filters: Array<{ key: DocumentStatus | 'all'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'signed', label: 'Signed' },
    { key: 'draft', label: 'Draft' },
  ];

  const filteredDocuments = demoDocuments.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || doc.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleDocumentPress = (document: Document) => {
    if (document.status === 'pending') {
      navigation.navigate('DocumentSign', { documentId: document.id });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Documents</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.background.input }]}>
          <Ionicons name="search" size={20} color={theme.colors.text.muted} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text.primary }]}
            placeholder="Search documents..."
            placeholderTextColor={theme.colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.text.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    selectedFilter === item.key
                      ? theme.colors.brand.primary
                      : theme.colors.background.card,
                },
              ]}
              onPress={() => setSelectedFilter(item.key)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color:
                      selectedFilter === item.key
                        ? '#FFFFFF'
                        : theme.colors.text.primary,
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Document List */}
      <FlatList
        data={filteredDocuments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DocumentCard document={item} onPress={() => handleDocumentPress(item)} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={theme.colors.text.muted} />
            <Text style={[styles.emptyStateText, { color: theme.colors.text.muted }]}>
              No documents found
            </Text>
          </View>
        }
      />
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  documentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  documentSender: {
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  documentFooter: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  documentDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  documentDateText: {
    fontSize: 12,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
  },
});
