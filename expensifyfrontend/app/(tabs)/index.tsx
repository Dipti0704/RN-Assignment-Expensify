import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../constants/theme';

const { width } = Dimensions.get('window');

interface Expense {
  _id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  paymentMethod: string;
}

export default function Home() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [monthlyRes, dailyRes, expensesRes] = await Promise.all([
        api.getMonthlyStats(),
        api.getDailyStats(),
        api.getExpenses({ page: 1 }),
      ]);

      setMonthlyTotal(monthlyRes.total || 0);
      setTodayTotal(dailyRes.total || 0);
      setExpenses(expensesRes.expenses || []);
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      Food: 'fast-food',
      Transport: 'bus',
      Shopping: 'bag-handle',
      Entertainment: 'game-controller',
      Bills: 'document-text',
      Health: 'fitness',
      Education: 'book',
      Other: 'apps',
    };
    return icons[category] || 'apps';
  };

  const getCategoryColor = (category: string) => {
    return (
      Colors.categories[category as keyof typeof Colors.categories] ||
      Colors.categories.Other
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.name}>{user?.name || 'User'}! 👋</Text>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <Ionicons name="notifications-outline" size={24} color={Colors.black} />
          <View style={styles.notifBadge} />
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <View>
            <Text style={styles.balanceLabel}>Monthly Spending</Text>
            <Text style={styles.balanceAmount}>${monthlyTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.monthBadge}>
            <Ionicons name="calendar" size={16} color={Colors.white} />
            <Text style={styles.monthText}>
              {new Date().toLocaleDateString('en-US', { month: 'short' })}
            </Text>
          </View>
        </View>

        <View style={styles.balanceFooter}>
          <View style={styles.todaySpend}>
            <Ionicons name="trending-up" size={18} color={Colors.white} />
            <View>
              <Text style={styles.todayLabel}>Today's Spending</Text>
              <Text style={styles.todayAmount}>${todayTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        {['Food', 'Transport', 'Shopping'].map((category) => {
          const catColor = getCategoryColor(category);
          const total = expenses
            .filter((e) => e.category === category)
            .reduce((sum, e) => sum + e.amount, 0);

          return (
            <View key={category} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: catColor.bg }]}>
                <Ionicons
                  name={getCategoryIcon(category) as any}
                  size={22}
                  color={catColor.icon}
                />
              </View>
              <Text style={styles.statLabel}>{category}</Text>
              <Text style={styles.statValue}>${total.toFixed(0)}</Text>
            </View>
          );
        })}
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {expenses.slice(0, 6).map((expense) => {
          const catColor = getCategoryColor(expense.category);
          return (
            <View key={expense._id} style={styles.transactionCard}>
              <View style={[styles.transactionIcon, { backgroundColor: catColor.bg }]}>
                <Ionicons
                  name={getCategoryIcon(expense.category) as any}
                  size={22}
                  color={catColor.icon}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>
                  {expense.description || expense.category}
                </Text>
                <Text style={styles.transactionDate}>
                  {formatDate(expense.date)} • {expense.paymentMethod}
                </Text>
              </View>
              <Text style={styles.transactionAmount}>-${expense.amount.toFixed(2)}</Text>
            </View>
          );
        })}

        {expenses.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="receipt-outline" size={56} color={Colors.grayLight} />
            </View>
            <Text style={styles.emptyText}>No expenses yet</Text>
            <Text style={styles.emptySubtext}>
              Start tracking your spending by adding expenses
            </Text>
          </View>
        )}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
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
    paddingBottom: Spacing.lg,
  },
  greeting: {
    fontSize: FontSizes.md,
    color: Colors.gray,
  },
  name: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.black,
  },
  notifButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
  },
  balanceCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  balanceLabel: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.white,
  },
  monthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  monthText: {
    fontSize: FontSizes.xs,
    color: Colors.white,
    fontWeight: '600',
  },
  balanceFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: Spacing.md,
  },
  todaySpend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  todayLabel: {
    fontSize: FontSizes.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  todayAmount: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.white,
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.small,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.gray,
    marginBottom: 2,
  },
  statValue: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.black,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.black,
  },
  seeAll: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  transactionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.black,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: FontSizes.xs,
    color: Colors.gray,
  },
  transactionAmount: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.secondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
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