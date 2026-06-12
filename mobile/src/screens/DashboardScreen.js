import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from '../components/StatusBadge';
import { colors } from '../theme/colors';
import { getDashboard } from '../services/api';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning 👋';
  if (hour < 17) return 'Good afternoon 👋';
  return 'Good evening 👋';
}

function StatCard({ label, value, icon, color }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconWrap, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value ?? '—'}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function OrderRow({ item, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.orderCard, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>#{item._id?.slice(-6).toUpperCase()}</Text>
          <Text style={styles.orderCustomer}>{item.customerName || 'Customer'}</Text>
        </View>
        <StatusBadge status={item.status} size="sm" />
      </View>
      <View style={styles.orderFooter}>
        <Text style={styles.orderItems}>
          {item.items?.length} item{item.items?.length > 1 ? 's' : ''}
        </Text>
        <Text style={styles.orderTotal}>₹{item.totalAmount}</Text>
        <Text style={styles.orderTime}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </Pressable>
  );
}

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const dashRes = await getDashboard();
      setStats(dashRes.data.stats);
      setRecentOrders(dashRes.data.stats.recentOrders.slice(0, 4));
    } catch (error) {
      console.error('Dashboard fetch error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const STAT_CARDS = [
    { key: 'revenue', label: 'Revenue', value: stats ? `₹${stats.totalRevenue}` : '—', icon: 'trending-up', color: colors.success },
    { key: 'orders', label: 'Orders', value: stats?.totalOrders ?? '—', icon: 'receipt', color: colors.primary },
    { key: 'customers', label: 'Customers', value: stats?.totalCustomers ?? '—', icon: 'people', color: colors.accent },
    { key: 'pending', label: 'Pending', value: stats?.pendingOrders ?? '—', icon: 'time', color: colors.warning },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.title}>Dashboard</Text>
        </View>
        <Pressable style={styles.avatarWrap} onPress={fetchData}>
          <Ionicons name="refresh" size={22} color={colors.primary} />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          <View style={styles.statsGrid}>
            {STAT_CARDS.map((card) => (
              <StatCard
                key={card.key}
                label={card.label}
                value={card.value}
                icon={card.icon}
                color={card.color}
              />
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <Pressable onPress={() => navigation.navigate('Orders')}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>

          <FlatList
            data={recentOrders}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <OrderRow
                item={item}
                onPress={() =>
                  navigation.navigate('Orders', {
                    screen: 'OrderDetail',
                    params: { order: item },
                  })
                }
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.empty}>No orders yet</Text>
            }
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 10,
  },
  orderCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  pressed: {
    opacity: 0.85,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  orderCustomer: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  orderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderItems: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
  },
  orderTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  empty: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 20,
  },
});