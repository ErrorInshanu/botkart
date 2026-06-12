const cartService = require('../../services/cartService');
const Order = require('../../models/order');

// Show cart contents
const showCart = async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const cart = cartService.getCart(telegramId);

  if (cart.length === 0) {
    return ctx.reply(
      '🛒 Your cart is empty!\n\nBrowse products using 🛍️ Shop.',
      { parse_mode: 'Markdown' }
    );
  }

  let message = '🛒 *Your Cart*\n\n';
  cart.forEach((item, i) => {
    message += `${i + 1}. ${item.name}\n`;
    message += `   Qty: ${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}\n\n`;
  });

  const total = cartService.getTotal(telegramId);
  message += `━━━━━━━━━━━━━━\n`;
  message += `💰 *Total: ₹${total}*`;

  await ctx.reply(message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '✅ Place Order', callback_data: 'place_order' }],
        [{ text: '🗑️ Clear Cart', callback_data: 'clear_cart' }],
        [{ text: '🛍️ Continue Shopping', callback_data: 'show_categories' }],
      ],
    },
  });
};

// Start checkout — ask for address
const placeOrder = async (ctx) => {
  const telegramId = ctx.from.id.toString();

  if (cartService.isEmpty(telegramId)) {
    return ctx.reply('🛒 Your cart is empty! Add some items first.');
  }

  cartService.setAwaitingAddress(telegramId);

  await ctx.reply(
    '📍 *Enter Delivery Address*\n\nPlease type your full delivery address below:\n\n_Example: 12 MG Road, Bandra West, Mumbai - 400050_',
    { parse_mode: 'Markdown' }
  );
};

// Confirm and save order
const confirmOrder = async (ctx, address) => {
  const telegramId = ctx.from.id.toString();
  const cart = cartService.getCart(telegramId);
  const total = cartService.getTotal(telegramId);

  if (cart.length === 0) {
    cartService.clearAwaitingAddress(telegramId);
    return ctx.reply('⚠️ Your cart is empty. Please add items first.');
  }

  try {
    // Save to MongoDB
    const order = new Order({
      telegramId,
      customerName: ctx.from.first_name || 'Customer',
      items: cart,
      totalAmount: total,
      deliveryAddress: address,
      status: 'pending',
    });

    await order.save();

    // Emit to owner dashboard via Socket.io
    const socketService = require('../../services/socketService');
    socketService.emitNewOrder(order);
    // Clear cart and state
    cartService.clearCart(telegramId);
    cartService.clearAwaitingAddress(telegramId);

    await ctx.reply(
      `✅ *Order Placed Successfully!*\n\n` +
      `📦 Order ID: \`${order._id}\`\n` +
      `💰 Total: ₹${total}\n` +
      `📍 Address: ${address}\n\n` +
      `We'll confirm your order shortly. Use *📦 My Orders* to track status.`,
      { parse_mode: 'Markdown' }
    );

  } catch (err) {
    console.error('Order save error:', err);
    cartService.clearAwaitingAddress(telegramId);
    await ctx.reply('❌ Something went wrong placing your order. Please try again.');
  }
};

// Clear cart
const clearCart = async (ctx) => {
  const telegramId = ctx.from.id.toString();
  cartService.clearCart(telegramId);
  await ctx.reply('🗑️ Cart cleared!');
};

module.exports = { showCart, placeOrder, confirmOrder, clearCart };