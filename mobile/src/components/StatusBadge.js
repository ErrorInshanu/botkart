import { StyleSheet, Text, View } from 'react-native';
import { statusColors } from '../theme/colors';

const LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function StatusBadge({ status, size = 'md' }) {
  const color = statusColors[status] || statusColors.pending;
  const label = LABELS[status] || status;

  return (
    <View style={[styles.badge, { backgroundColor: `${color}26` }, size === 'sm' && styles.sm]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }, size === 'sm' && styles.smText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  sm: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  smText: {
    fontSize: 11,
  },
});
