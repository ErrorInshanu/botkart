import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

export default function FilterPill({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        active ? styles.active : styles.inactive,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  active: {
    backgroundColor: colors.primary,
  },
  inactive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeText: {
    color: colors.textPrimary,
  },
});
