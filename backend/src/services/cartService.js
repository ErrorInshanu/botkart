// In-memory cart store: Map<telegramId, cartItem[]>
const carts = new Map();

// awaitingAddress: Map<telegramId, true> — tracks checkout state
const awaitingAddress = new Map();

const cartService = {
  // Add item or increment quantity
  addItem(telegramId, product) {
    if (!carts.has(telegramId)) carts.set(telegramId, []);
    const cart = carts.get(telegramId);
    const existing = cart.find(i => i.productId.toString() === product._id.toString());
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    }
  },

  getCart(telegramId) {
    return carts.get(telegramId) || [];
  },

  clearCart(telegramId) {
    carts.delete(telegramId);
  },

  removeItem(telegramId, productId) {
    if (!carts.has(telegramId)) return;
    const cart = carts.get(telegramId).filter(
      i => i.productId.toString() !== productId.toString()
    );
    carts.set(telegramId, cart);
  },

  getTotal(telegramId) {
    const cart = carts.get(telegramId) || [];
    return cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  },

  isEmpty(telegramId) {
    const cart = carts.get(telegramId) || [];
    return cart.length === 0;
  },

  // Checkout state helpers
  setAwaitingAddress(telegramId) {
    awaitingAddress.set(telegramId, true);
  },

  isAwaitingAddress(telegramId) {
    return awaitingAddress.has(telegramId);
  },

  clearAwaitingAddress(telegramId) {
    awaitingAddress.delete(telegramId);
  },
};

module.exports = cartService;