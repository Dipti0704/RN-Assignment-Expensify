import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../constants/theme';

const { width } = Dimensions.get('window');

interface CategoryData {
  _id: string;
  total: number;
  count: number;
}

interface Insight {
  category: string;
  changePercent: number;
  message: string;
  currentAmount: number;
}

export default function Stats() {
  const [period, setPeriod] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Month');
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [total, setTotal] = useState(0);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const [catRes, insightRes] = await Promise.all([
        api.getCategoryBreakdown(),
        api.getInsights(),
      ]);

      setCategories(catRes.breakdown || []);
      setTotal(catRes.total || 0);
      setInsights(insightRes.insights || []);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const getCategoryColor = (category: string) => {
    return (
      Colors.categories[category as keyof typeof Colors.categories] ||
      Colors.categories.Other
    );
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

  const maxAmount = Math.max(...categories.map((c) => c.total), 1);

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
        <Text style={styles.title}>Statistics</Text>
        <TouchableOpacity style={styles.calendarBtn}>
          <Ionicons name="calendar-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Period Tabs */}
      <View style={styles.periodTabs}>
        {(['Day', 'Week', 'Month', 'Year'] as const).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodTab, period === p && styles.periodTabActive]}
            onPress={() => setPeriod(p)}
            activeOpacity={0.7}
          >
            <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Total Card */}
      <View style={styles.totalCard}>
        <Ionicons name="trending-up" size={32} color="rgba(255,255,255,0.8)" />
        <Text style={styles.totalLabel}>Total Spending</Text>
        <Text style={styles.totalAmount}>₹{total.toFixed(2)}</Text>
        <Text style={styles.totalPeriod}>
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      </View>

      {/* Bar Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>
        <View style={styles.barChart}>
          {categories.slice(0, 6).map((cat) => {
            const catColor = getCategoryColor(cat._id);
            const barHeight = (cat.total / maxAmount) * 150;
            return (
              <View key={cat._id} style={styles.barContainer}>
                <Text style={styles.barValue}>₹{cat.total.toFixed(0)}</Text>
                <View
                  style={[
                    styles.bar,
                    { height: Math.max(barHeight, 20), backgroundColor: catColor.color },
                  ]}
                />
                <View style={[styles.barIcon, { backgroundColor: catColor.bg }]}>
                  <Ionicons
                    name={getCategoryIcon(cat._id) as any}
                    size={16}
                    color={catColor.icon}
                  />
                </View>
                <Text style={styles.barLabel} numberOfLines={1}>
                  {cat._id}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Category Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        {categories.map((cat) => {
          const catColor = getCategoryColor(cat._id);
          const percentage = total > 0 ? (cat.total / total) * 100 : 0;
          return (
            <View key={cat._id} style={styles.categoryCard}>
              <View style={[styles.categoryIcon, { backgroundColor: catColor.bg }]}>
                <Ionicons
                  name={getCategoryIcon(cat._id) as any}
                  size={22}
                  color={catColor.icon}
                />
              </View>
              <View style={styles.categoryInfo}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{cat._id}</Text>
                  <Text style={styles.categoryAmount}>₹{cat.total.toFixed(2)}</Text>
                </View>
                <View style={styles.progressContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${percentage}%`, backgroundColor: catColor.color },
                    ]}
                  />
                </View>
                <Text style={styles.categoryMeta}>
                  {cat.count} transaction{cat.count !== 1 ? 's' : ''} • {percentage.toFixed(1)}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Insights */}
      {insights.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Insights</Text>
          {insights.map((insight, index) => (
            <View key={index} style={styles.insightCard}>
              <View
                style={[
                  styles.insightIcon,
                  {
                    backgroundColor:
                      insight.changePercent > 0 ? '#FEE2E2' : '#D1FAE5',
                  },
                ]}
              >
                <Ionicons
                  name={insight.changePercent > 0 ? 'trending-up' : 'trending-down'}
                  size={24}
                  color={insight.changePercent > 0 ? '#DC2626' : '#059669'}
                />
              </View>
              <View style={styles.insightInfo}>
                <Text style={styles.insightText}>{insight.message}</Text>
                <Text style={styles.insightAmount}>
                  Current: ₹{insight.currentAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Empty State */}
      {categories.length === 0 && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="bar-chart-outline" size={64} color={Colors.grayLight} />
          </View>
          <Text style={styles.emptyText}>No statistics yet</Text>
          <Text style={styles.emptySubtext}>
            Add expenses to see your spending patterns
          </Text>
        </View>
      )}

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
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.black,
  },
  calendarBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  periodTabs: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: 4,
    marginBottom: Spacing.lg,
    ...Shadows.small,
  },
  periodTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  periodTabActive: {
    backgroundColor: Colors.primary,
  },
  periodText: {
    fontSize: FontSizes.sm,
    color: Colors.gray,
    fontWeight: '600',
  },
  periodTextActive: {
    color: Colors.white,
  },
  totalCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  totalLabel: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: Spacing.sm,
  },
  totalAmount: {
    fontSize: 44,
    fontWeight: 'bold',
    color: Colors.white,
    marginVertical: Spacing.sm,
  },
  totalPeriod: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  chartSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    height: 250,
    ...Shadows.small,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barValue: {
    fontSize: FontSizes.xs,
    color: Colors.gray,
    marginBottom: 4,
    fontWeight: '600',
  },
  bar: {
    width: 28,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    marginBottom: Spacing.xs,
  },
  barIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 9,
    color: Colors.gray,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  categoryCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.black,
  },
  categoryAmount: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.black,
  },
  progressContainer: {
    height: 8,
    backgroundColor: Colors.grayLight,
    borderRadius: 4,
    marginBottom: 6,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  categoryMeta: {
    fontSize: FontSizes.xs,
    color: Colors.gray,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  insightText: {
    fontSize: FontSizes.sm,
    color: Colors.black,
    fontWeight: '500',
    marginBottom: 4,
  },
  insightAmount: {
    fontSize: FontSizes.xs,
    color: Colors.gray,
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