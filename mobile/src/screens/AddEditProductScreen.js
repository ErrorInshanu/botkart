import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { categories } from '../data/dummyData';
import { colors } from '../theme/colors';

export default function AddEditProductScreen({ route, navigation }) {
  const { mode, product } = route.params || {};
  const isEdit = mode === 'edit';

  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [category, setCategory] = useState(product?.category || categories[0]);
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleSave = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navBar}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.navTitle}>{isEdit ? 'Edit Product' : 'Add Product'}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Product name"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Short description"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Price (₹)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="0"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Category</Text>
          <Pressable
            style={styles.dropdown}
            onPress={() => setShowCategoryPicker(true)}
          >
            <Text style={styles.dropdownText}>{category}</Text>
            <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={[styles.fieldGroup, styles.toggleRow]}>
          <View>
            <Text style={styles.label}>In Stock</Text>
            <Text style={styles.toggleHint}>Available for ordering</Text>
          </View>
          <Switch
            value={inStock}
            onValueChange={setInStock}
            trackColor={{ false: colors.border, true: `${colors.primary}80` }}
            thumbColor={inStock ? colors.primary : colors.textSecondary}
          />
        </View>

        <Pressable
          style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}
          onPress={handleSave}
        >
          <Ionicons name="checkmark" size={20} color={colors.textPrimary} />
          <Text style={styles.saveBtnText}>{isEdit ? 'Save Changes' : 'Add Product'}</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={showCategoryPicker} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowCategoryPicker(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select Category</Text>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                style={[styles.modalOption, category === cat && styles.modalOptionActive]}
                onPress={() => {
                  setCategory(cat);
                  setShowCategoryPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    category === cat && styles.modalOptionTextActive,
                  ]}
                >
                  {cat}
                </Text>
                {category === cat && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  form: {
    padding: 20,
    paddingBottom: 40,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 90,
    paddingTop: 14,
  },
  dropdown: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  toggleHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    marginTop: 12,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pressed: {
    opacity: 0.85,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  modalOptionActive: {
    backgroundColor: `${colors.primary}20`,
  },
  modalOptionText: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  modalOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
