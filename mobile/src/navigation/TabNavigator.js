import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

import DashboardScreen from '../screens/DashboardScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import ProductsScreen from '../screens/ProductsScreen';
import AddEditProductScreen from '../screens/AddEditProductScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const OrdersStack = createNativeStackNavigator();
const ProductsStack = createNativeStackNavigator();

const stackScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background },
  animation: 'slide_from_right',
};

function OrdersNavigator() {
  return (
    <OrdersStack.Navigator screenOptions={stackScreenOptions}>
      <OrdersStack.Screen name="OrdersList" component={OrdersScreen} />
      <OrdersStack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </OrdersStack.Navigator>
  );
}

function ProductsNavigator() {
  return (
    <ProductsStack.Navigator screenOptions={stackScreenOptions}>
      <ProductsStack.Screen name="ProductsList" component={ProductsScreen} />
      <ProductsStack.Screen
        name="AddEditProduct"
        component={AddEditProductScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
    </ProductsStack.Navigator>
  );
}

const TAB_ICONS = {
  Dashboard: ['grid', 'grid-outline'],
  Orders: ['receipt', 'receipt-outline'],
  Products: ['cube', 'cube-outline'],
  Settings: ['settings', 'settings-outline'],
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons[0] : icons[1];
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen
        name="Orders"
        component={OrdersNavigator}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.navigate('Orders', { screen: 'OrdersList' });
          },
        })}
      />
      <Tab.Screen
        name="Products"
        component={ProductsNavigator}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.navigate('Products', { screen: 'ProductsList' });
          },
        })}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 10,
    position: 'absolute',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  tabItem: {
    paddingTop: 4,
  },
});