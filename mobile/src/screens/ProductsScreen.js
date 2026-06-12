import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { deleteProduct, getProducts } from '../services/api';
import { colors } from '../theme/colors';

function ProductCard({ item, onEdit, onDelete }) {
  const initial = item.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <View style={styles.card}>
      <View style={styles.emojiWrap}>
        <Text style={styles.emoji}>{initial}</Text>
      </View>

      {!item.inStock && (
        <View style={styles.outOfStock}>
          <Text style={styles.outOfStockText}>Out of Stock</Text>
        </View>
      )}

      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.price}>₹{item.price}</Text>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.actionBtn, styles.editBtn, pressed && styles.pressed]}
          onPress={() => onEdit(item)}
        >
          <Ionicons name="pencil" size={14} color={colors.primary} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.actionBtn, styles.deleteBtn, pressed && styles.pressed]}
          onPress={() => onDelete(item)}
        >
          <Ionicons name="trash" size={14} color={colors.error} />
        </Pressable>
      </View>
    </View>
  );
}

export default function ProductsScreen({ navigation }) {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProductList(response.data.products || []);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [fetchProducts])
  );

  const handleDelete = (item) => {
    Alert.alert('Delete Product', `Remove "${item.name}" from menu?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProduct(item._id);
            await fetchProducts();
          } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to delete product');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Products</Text>
          <Text style={styles.subtitle}>{productList.length} items on menu</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
          onPress={() => navigation.navigate('AddEditProduct', { mode: 'add' })}
        >
          <Ionicons name="add" size={22} color={colors.textPrimary} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={productList}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onEdit={(product) =>
                navigation.navigate('AddEditProduct', { mode: 'edit', product })
              }
              onDelete={handleDelete}
            />
          )}
        />
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    minHeight: 180,
  },
  emojiWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  outOfStock: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: `${colors.error}26`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  outOfStockText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.error,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  category: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 'auto',
  },
  actionBtn: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  editBtn: {
    borderColor: `${colors.primary}40`,
    backgroundColor: `${colors.primary}15`,
  },
  deleteBtn: {
    borderColor: `${colors.error}40`,
    backgroundColor: `${colors.error}15`,
  },
});
