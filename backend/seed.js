require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/product');

const products = [
  {
    name: 'Chicken Burger',
    description: 'Juicy grilled chicken burger with fresh veggies',
    price: 199,
    category: 'Food',
    inStock: true,
  },
  {
    name: 'Veg Pizza',
    description: 'Loaded veggie pizza with extra cheese',
    price: 299,
    category: 'Food',
    inStock: true,
  },
  {
    name: 'Chocolate Shake',
    description: 'Thick and creamy chocolate milkshake',
    price: 149,
    category: 'Drinks',
    inStock: true,
  },
  {
    name: 'Mango Smoothie',
    description: 'Fresh mango blended with milk and honey',
    price: 129,
    category: 'Drinks',
    inStock: true,
  },
  {
    name: 'Classic White T-Shirt',
    description: 'Premium cotton white t-shirt, unisex fit',
    price: 499,
    category: 'Clothing',
    inStock: true,
  },
  {
    name: 'Black Hoodie',
    description: 'Warm fleece hoodie, perfect for winters',
    price: 999,
    category: 'Clothing',
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
    console.log('Products seeded successfully 🌱');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed ❌', error);
    process.exit(1);
  }
};

seedDB();