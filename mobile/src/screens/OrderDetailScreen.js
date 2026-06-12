import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from '../components/StatusBadge';
import { updateOrderStatus } from '../services/api';
import { colors, statusColors } from '../theme/colors';

const STATUS_ACTIONS = [
  { key: 'pending', label: 'Pending', icon: 'time-outline' },
  { key: 'confirmed', label: 'Confirm', icon: 'checkmark-circle-outline' },
  { key: 'preparing', label: 'Preparing', icon: 'flame-outline' },
  { key: 'delivered', label: 'Delivered', icon: 'bicycle-outline' },
  { key: 'cancelled', label: 'Cancel', icon: 'close-circle-outline' },
];

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '—'}</Text>
      </View>
    </View>
  );
}

export default function OrderDetailScreen({ route, navigation }) {
  const { order: initialOrder } = route.params;
  const [order, setOrder] = useState(initialOrder);
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (status) => {
    if (order.status === status) return;
    try {
      setUpdating(true);
      await updateOrderStatus(order._id, status);
      setOrder((prev) => ({ ...prev, status }));
    } catch (error) {
      console.error('Status update error:', error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navBar}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.navTitle}>Order Details</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.orderId}>#{order._id?.slice(-6).toUpperCase()}</Text>
              <Text style={styles.placedAt}>
                Placed {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <StatusBadge status={order.status} />
          </View>
          <Text style={styles.totalAmount}>₹{order.totalAmount}</Text>
          <Text style={styles.totalLabel}>Order Total</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer</Text>
          <View style={styles.card}>
            <InfoRow icon="person-outline" label="Name" value={order.customerName} />
            <View style={styles.cardDivider} />
            <InfoRow icon="logo-telegram" label="Telegram ID" value={order.telegramId} />
            <View style={styles.cardDivider} />
            <InfoRow icon="location-outline" label="Address" value={order.deliveryAddress} />
            {order.notes ? (
              <>
                <View style={styles.cardDivider} />
                <InfoRow icon="chatbubble-outline" label="Notes" value={order.notes} />
              </>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items ({order.items?.length})</Text>
          <View style={styles.card}>
            {order.items?.map((item, index) => (
              <View key={index}>
                {index > 0 && <View style={styles.cardDivider} />}
                <View style={styles.itemRow}>
                  <View style={styles.itemQty}>
                    <Text style={styles.qtyText}>{item.quantity}×</Text>
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>₹{item.price} each</Text>
                  </View>
                  <Text style={styles.itemTotal}>₹{item.quantity * item.price}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Update Status {updating && <ActivityIndicator size="small" color={colors.primary} />}
          </Text>
          <View style={styles.statusGrid}>
            {STATUS_ACTIONS.map((action) => {
              const isActive = order.status === action.key;
              const actionColor = statusColors[action.key];
              return (
                <Pressable
                  key={action.key}
                  style={[
                    styles.statusBtn,
                    isActive && {
                      backgroundColor: actionColor,
                      borderColor: actionColor,
                    },
                  ]}
                  onPress={() => handleStatusUpdate(action.key)}
                  disabled={updating}
                >
                  <Ionicons
                    name={action.icon}
                    size={18}
                    color={isActive ? colors.textPrimary : actionColor}
                  />
                  <Text
                    style={[
                      styles.statusBtnText,
                      isActive && styles.statusBtnTextActive,
                      !isActive && { color: actionColor },
                    ]}
                  >
                    {action.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  orderId: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  placedAt: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -1,
  },
  totalLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 4,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  itemQty: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: '30%',
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBtnTextActive: {
    color: colors.textPrimary,
  },
});