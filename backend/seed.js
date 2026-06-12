require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/product');

const products = [
  // ☕ DRINKS
  {
    name: 'Cold Coffee',
    description: 'Chilled coffee blended with milk and ice cream',
    price: 129,
    category: 'Drinks',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    inStock: true,
  },
  {
    name: 'Mango Smoothie',
    description: 'Fresh mango blended with milk and honey',
    price: 119,
    category: 'Drinks',
    imageUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400',
    inStock: true,
  },
  {
    name: 'Mint Lemonade',
    description: 'Refreshing lemon juice with fresh mint and soda',
    price: 99,
    category: 'Drinks',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    inStock: true,
  },

  // 🥪 SNACKS
  {
    name: 'Crispy Fries',
    description: 'Golden crispy fries served with dipping sauce',
    price: 89,
    category: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
    inStock: true,
  },
  {
    name: 'Veg Sandwich',
    description: 'Grilled sandwich with cheese, veggies and mayo',
    price: 119,
    category: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
    inStock: true,
  },
  {
    name: 'Nachos with Salsa',
    description: 'Crunchy nachos served with fresh tomato salsa and cheese dip',
    price: 149,
    category: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400',
    inStock: true,
  },

  // 🍕 MAINS
  {
    name: 'Chicken Burger',
    description: 'Juicy grilled chicken patty with fresh lettuce and sauce',
    price: 199,
    category: 'Mains',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    inStock: true,
  },
  {
    name: 'Veg Pizza',
    description: 'Loaded veggie pizza with extra cheese and oregano',
    price: 299,
    category: 'Mains',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    inStock: true,
  },
  {
    name: 'Pasta Arrabbiata',
    description: 'Penne pasta in spicy tomato sauce with herbs',
    price: 219,
    category: 'Mains',
    imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400',
    inStock: true,
  },

  // 🍰 DESSERTS
  {
    name: 'Chocolate Brownie',
    description: 'Warm fudgy brownie served with a scoop of vanilla ice cream',
    price: 149,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400',
    inStock: true,
  },
  {
    name: 'Mango Cheesecake',
    description: 'Creamy no-bake cheesecake with fresh mango topping',
    price: 179,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
    inStock: true,
  },
  {
    name: 'Gulab Jamun',
    description: 'Soft melt-in-mouth gulab jamuns served warm with syrup',
    price: 99,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1601303516534-bf4c6b667714?w=400',
    inStock: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected ✅');

    await Product.deleteMany({});
    console.log('Old products cleared 🗑️');

    await Product.insertMany(products);
    console.log('New cafe menu seeded successfully 🌱');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed ❌', error);
    process.exit(1);
  }
};

seedDB();