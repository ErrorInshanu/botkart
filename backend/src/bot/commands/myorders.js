const Order = require('../../models/order');

const myOrders = async (ctx) => {
  const telegramId = ctx.from.id.toString();
  try {
    const orders = await Order.find({ telegramId }).sort({ createdAt: -1 }).limit(5);
    if (orders.length === 0) {
      return ctx.reply('No orders yet! Browse products using Shop.');
    }
    let message = 'Your Recent Orders\n\n';
    orders.forEach((order, i) => {
      message += (i + 1) + '. Order #' + order._id.toString().slice(-6) + '\n';
      message += '   Status: ' + order.status.toUpperCase() + '\n';
      message += '   Total: Rs.' + order.totalAmount + '\n';
      message += '   Date: ' + new Date(order.createdAt).toLocaleDateString('en-IN') + '\n\n';
    });
    await ctx.reply(message);
  } catch (err) {
    console.error('My orders error:', err);
    await ctx.reply('Could not fetch orders. Please try again.');
  }
};

module.exports = { myOrders };
