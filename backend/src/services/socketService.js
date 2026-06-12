let io = null;

const init = (socketIoInstance) => {
  io = socketIoInstance;

  io.on('connection', (socket) => {
    console.log(`[Socket] Owner app connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[Socket] Owner app disconnected: ${socket.id}`);
    });
  });
};

const emitNewOrder = (order) => {
  if (!io) return;
  io.emit('new_order', { order });
  console.log(`[Socket] Emitted new_order: ${order._id}`);
};

const emitOrderUpdated = (orderId, status) => {
  if (!io) return;
  io.emit('order_updated', { orderId, status });
  console.log(`[Socket] Emitted order_updated: ${orderId} → ${status}`);
};

module.exports = { init, emitNewOrder, emitOrderUpdated };