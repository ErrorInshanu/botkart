import { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FilterPill from '../components/FilterPill';
import StatusBadge from '../components/StatusBadge';
import { getOrders } from '../services/api';
import { colors } from '../theme/colors';
import { connectSocket } from '../services/socket';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

function OrderCard({ item, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.cardTop}>
        <View style={styles.cardLeft}>
          <Text style={styles.orderId}>#{item._id?.slice(-6).toUpperCase()}</Text>
          <Text style={styles.customer}>{item.customerName || 'Customer'}</Text>
          <Text style={styles.phone}>{item.telegramId}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.itemsPreview}>
        {item.items?.map((line, i) => (
          <Text key={i} style={styles.itemLine}>
            {line.quantity}× {line.name}
          </Text>
        ))}
      </View>

      <View style={styles.cardBottom}>
        <Text style={styles.total}>₹{item.totalAmount}</Text>
        <View style={styles.meta}>
          <Text style={styles.time}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
        </View>
      </View>
    </Pressable>
  );
}

export default function OrdersScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchOrders();

    const socket = connectSocket();
    socketRef.current = socket;

    socket.on('new_order', ({ order }) => {
      console.log('[Socket] New order:', order._id);
      fetchOrders();
      Alert.alert(
        '🛍️ New Order!',
        `${order.customerName} placed an order for ₹${order.totalAmount}`,
        [{ text: 'View', onPress: () => navigation.navigate('OrderDetail', { order }) }]
      );
    });

    socket.on('order_updated', ({ orderId, status }) => {
      console.log('[Socket] Order updated:', orderId, status);
      fetchOrders();
    });

    return () => {
      socket.off('new_order');
      socket.off('order_updated');
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data.orders);
    } catch (error) {
      console.error('Orders fetch error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    activeFilter === 'all'
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        <Text style={styles.subtitle}>{filtered.length} orders</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        style={{ height: 44 }}
      >
        {FILTERS.map((f) => (
          <FilterPill
            key={f.key}
            label={f.label}
            active={activeFilter === f.key}
            onPress={() => setActiveFilter(f.key)}
          />
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="receipt-outline" size={48} color={colors.border} />
              <Text style={styles.emptyText}>No orders found</Text>
            </View>
          ) : (
            filtered.map((item) => (
              <OrderCard
                key={item._id}
                item={item}
                onPress={() => navigation.navigate('OrderDetail', { order: item })}
              />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  filters: { paddingHorizontal: 16, paddingBottom: 12 },
  list: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 84, gap: 12 },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16 },
  pressed: { opacity: 0.85 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLeft: { flex: 1 },
  orderId: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  customer: { fontSize: 14, color: colors.textPrimary, marginBottom: 2 },
  phone: { fontSize: 12, color: colors.textSecondary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  itemsPreview: { gap: 4, marginBottom: 12 },
  itemLine: { fontSize: 13, color: colors.textSecondary },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  total: { fontSize: 18, fontWeight: '700', color: colors.primary },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  time: { fontSize: 12, color: colors.textSecondary },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: colors.textSecondary },
});