import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../constants/theme';
import { CATEGORIES } from '../../constants/categories';

interface Expense {
  _id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  paymentMethod: string;
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const params = selectedCategory ? { category: selectedCategory } : {};
      const res = await api.getExpenses(params);
      setExpenses(res.expenses || []);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [selectedCategory])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
  };

  const handleDelete = (id: string, description: string) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${description || 'this expense'}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteExpense(id);
              setExpenses(expenses.filter((e) => e._id !== id));
              Alert.alert('Success', 'Expense deleted');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete');
            }
          },
        },
      ]
    );
  };

  const getCategoryColor = (category: string) => {
    return (
      Colors.categories[category as keyof typeof Colors.categories] ||
      Colors.categories.Other
    );
  };

  const getCategoryIcon = (category: string) => {
    const cat = CATEGORIES.find((c) => c.id === category);
    return cat?.icon || 'apps';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const renderExpense = ({ item }: { item: Expense }) => {
    const catColor = getCategoryColor(item.category);
    return (
      <View style={styles.expenseCard}>
        <View style={[styles.expenseIcon, { backgroundColor: catColor.bg }]}>
          <Ionicons
            name={getCategoryIcon(item.category) as any}
            size={24}
            color={catColor.icon}
          />
        </View>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseTitle} numberOfLines={1}>
            {item.description || item.category}
          </Text>
          <Text style={styles.expenseCategory}>
            {item.category} • {item.paymentMethod}
          </Text>
          <Text style={styles.expenseDate}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.expenseRight}>
          <Text style={styles.expenseAmount}>₹{item.amount.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item._id, item.description)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color={Colors.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Expenses</Text>
          <Text style={styles.subtitle}>
            {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>₹{totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      {/* Category Filters */}
      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterChip, !selectedCategory && styles.filterChipActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Ionicons
            name="apps"
            size={16}
            color={!selectedCategory ? Colors.white : Colors.gray}
          />
          <Text
            style={[styles.filterText, !selectedCategory && styles.filterTextActive]}
          >
            All
          </Text>
        </TouchableOpacity>

        {CATEGORIES.slice(0, 6).map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.filterChip,
              selectedCategory === cat.id && styles.filterChipActive,
            ]}
            onPress={() =>
              setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
            }
          >
            <Ionicons
              name={cat.icon as any}
              size={16}
              color={selectedCategory === cat.id ? Colors.white : Colors.gray}
            />
            <Text
              style={[
                styles.filterText,
                selectedCategory === cat.id && styles.filterTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Expense List */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item._id}
        renderItem={renderExpense}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="receipt-outline" size={64} color={Colors.grayLight} />
              </View>
              <Text style={styles.emptyText}>No expenses found</Text>
              <Text style={styles.emptySubtext}>
                {selectedCategory
                  ? `No ${selectedCategory} expenses yet`
                  : 'Start adding your expenses'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.black,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.gray,
    marginTop: 2,
  },
  totalCard: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexWrap: 'wrap',
    gap: Spacing.xs,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.grayLight,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: FontSizes.xs,
    color: Colors.gray,
    fontWeight: '500',
  },
  filterTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 100,
  },
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },
  expenseIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  expenseTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 2,
  },
  expenseCategory: {
    fontSize: FontSizes.xs,
    color: Colors.gray,
    marginTop: 2,
  },
  expenseDate: {
    fontSize: FontSizes.xs,
    color: Colors.grayLight,
    marginTop: 2,
  },
  expenseRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  expenseAmount: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.secondary,
  },
  deleteBtn: {
    padding: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.secondaryLight,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.gray,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    color: Colors.gray,
    textAlign: 'center',
  },
});