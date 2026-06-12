import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { cafeProfile } from '../data/dummyData';
import { colors } from '../theme/colors';

const SETTINGS_SECTIONS = [
  {
    title: 'Business',
    items: [
      { icon: 'storefront-outline', label: 'Cafe Details', subtitle: 'Name, address, hours' },
      { icon: 'time-outline', label: 'Operating Hours', subtitle: cafeProfile.hours },
      { icon: 'location-outline', label: 'Delivery Zones', subtitle: 'Manage service areas' },
    ],
  },
  {
    title: 'Orders & Payments',
    items: [
      { icon: 'notifications-outline', label: 'Order Alerts', subtitle: 'Push & sound notifications' },
      { icon: 'wallet-outline', label: 'Payment Methods', subtitle: 'UPI, Card, Cash' },
      { icon: 'receipt-outline', label: 'Tax & Invoicing', subtitle: 'GST settings' },
    ],
  },
  {
    title: 'Account',
    items: [
      { icon: 'person-outline', label: 'Profile', subtitle: 'Admin account settings' },
      { icon: 'shield-checkmark-outline', label: 'Security', subtitle: 'Password & 2FA' },
      { icon: 'help-circle-outline', label: 'Help & Support', subtitle: 'FAQ, contact us' },
    ],
  },
];

function SettingRow({ icon, label, subtitle, isLast }) {
  return (
    <Pressable style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={[styles.settingContent, !isLast && styles.settingBorder]}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <View style={styles.chevronWrap}>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
}

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Ionicons name="cafe" size={32} color={colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{cafeProfile.name}</Text>
            <Text style={styles.profileTagline}>{cafeProfile.tagline}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={colors.warning} />
              <Text style={styles.rating}>{cafeProfile.rating}</Text>
              <Text style={styles.reviews}>({cafeProfile.totalReviews} reviews)</Text>
            </View>
          </View>
          <Pressable style={styles.editProfileBtn}>
            <Ionicons name="pencil" size={16} color={colors.primary} />
          </Pressable>
        </View>

        <View style={styles.contactCard}>
          <View style={styles.contactRow}>
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.contactText}>{cafeProfile.address}</Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.contactText}>{cafeProfile.phone}</Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.contactText}>{cafeProfile.email}</Text>
          </View>
        </View>

        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, index) => (
                <SettingRow
                  key={item.label}
                  {...item}
                  isLast={index === section.items.length - 1}
                />
              ))}
            </View>
          </View>
        ))}

        <Pressable style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>

        <Text style={styles.version}>BotKart Admin v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  profileTagline: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  reviews: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  editProfileBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    gap: 10,
    marginBottom: 24,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactText: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingVertical: 4,
    gap: 12,
  },
  pressed: {
    opacity: 0.85,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 8,
  },
  settingBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chevronWrap: {
    paddingRight: 14,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: `${colors.error}15`,
    borderWidth: 1,
    borderColor: `${colors.error}30`,
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.error,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
});
