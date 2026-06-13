const { showCategories } = require('../commands/catalog');
const { showProductsByCategory } = require('./products');
const { showCart, placeOrder, clearCart } = require('./order');
const cartService = require('../../services/cartService');
const Product = require('../../models/product');

const mainMenuKeyboard = {
  keyboard: [
    [{ text: '🛍️ Menu' }, { text: '📦 My Orders' }],
    [{ text: '💬 Support' }, { text: 'ℹ️ About Us' }],
  ],
  resize_keyboard: true,
  one_time_keyboard: false,
};

const handleCallback = async (ctx) => {
  const data = ctx.callbackQuery.data;

  await ctx.answerCbQuery(); // dismiss loading spinner

  // Category selection
  if (data.startsWith('category_')) {
    const category = data.replace('category_', '');
    return await showProductsByCategory(ctx, category);
  }

  // Add to cart
  if (data.startsWith('add_to_cart_')) {
    const productId = data.replace('add_to_cart_', '');
    try {
      const product = await Product.findById(productId);
      if (!product) return ctx.reply('❌ Product not found.');

      cartService.addItem(ctx.from.id.toString(), product);
      const cart = cartService.getCart(ctx.from.id.toString());
      const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

      return ctx.reply(
        `✅ *${product.name}* added to cart!\n\n🛒 Cart: ${itemCount} item(s)`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🛒 View Cart', callback_data: 'view_cart' }],
              [{ text: '🛍️ Continue Shopping', callback_data: 'show_categories' }],
            ],
          },
        }
      );
    } catch (err) {
      console.error('Add to cart error:', err);
      return ctx.reply('❌ Could not add item. Please try again.');
    }
  }

  // View cart
  if (data === 'view_cart') {
    return await showCart(ctx);
  }

  // Place order
  if (data === 'place_order') {
    return await placeOrder(ctx);
  }

  // Clear cart
  if (data === 'clear_cart') {
    return await clearCart(ctx);
  }

  // Back to categories
  if (data === 'show_categories') {
    return await showCategories(ctx);
  }

  // Main menu — show persistent keyboard
  if (data === 'main_menu') {
    return ctx.reply('🏠 *Main Menu*\n\nUse the buttons below to navigate 👇', {
      parse_mode: 'Markdown',
      reply_markup: mainMenuKeyboard,
    });
  }

  await ctx.reply('Unknown action. Please try again.');
};

module.exports =  handleCallback ;