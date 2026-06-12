const Order = require('../models/order');
const socketService = require('../services/socketService');
const bot = require('../bot');

const STATUS_MESSAGES = {
  confirmed: '✅ Your order has been confirmed! We\'re getting it ready.',
  preparing: '🔥 Your order is being prepared right now!',
  delivered: '🚴 Your order is on the way! Hang tight.',
  cancelled: '❌ Your order has been cancelled. Contact us if this was a mistake.',
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // 1. Emit socket event to owner app
    socketService.emitOrderUpdated(order._id, status);

    // 2. Send Telegram message to customer
    const message = STATUS_MESSAGES[status];
    if (message && order.telegramId) {
      try {
        await bot.telegram.sendMessage(order.telegramId, message);
      } catch (telegramErr) {
        console.error('[Telegram] Failed to notify customer:', telegramErr.message);
      }
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllOrders, updateOrderStatus };