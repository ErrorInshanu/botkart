# BotKart — Full Project Context
> **Paste this file at the start of any new AI chat to continue building seamlessly.**
> Last updated: June 9, 2026 | Status: Day 3 Complete ✅

---

## 1. Project Overview

**BotKart** is an AI-powered e-commerce Telegram bot with a real-time React Native owner dashboard.

Customers shop entirely inside Telegram. The AI (powered by Groq/LLaMA 3) handles conversations, takes orders, answers FAQs, and provides order updates — no website needed. The shop owner manages everything through a mobile app that receives real-time notifications via Socket.io.

**Target User:**
Small business owners (food, clothing, local products) who want to sell via Telegram without building a full website.

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Telegram Bot | Telegraf.js (Node.js) | Bot logic, menus, order flow |
| AI Brain | Groq API — LLaMA 3 (llama3-8b-8192) | Natural language understanding, smart replies |
| Backend | Node.js + Express.js | REST API, bot server, business logic |
| Database | MongoDB Atlas | Products, orders, customers, chats |
| Real-time | Socket.io | Push new orders/messages to owner app instantly |
| Owner App | React Native + Expo | Mobile dashboard for the shop owner |
| Hosting | Render (free tier) | Backend deployment |
| Version Control | GitHub — repo: `botkart` (public) | Source code |

---

## 3. Credentials & Accounts

> ⚠️ Never commit `.env` to GitHub. `.gitignore` already set up.

```env
MONGODB_URI=mongodb+srv://anshulsharmahr1203_db_user:PASSWORD@botkart.gxir9l4.mongodb.net/botkart?appName=botkart
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TELEGRAM_BOT_TOKEN=7xxxxxxxxx:AAFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=3000
NODE_ENV=development
```

**Accounts status:**
- ✅ MongoDB Atlas — cluster `botkart` connected and working
- ✅ Groq API — key created (separate from CVPilot project)
- ✅ Telegram — bot `@botkart_shop_bot` created via @BotFather, token saved
- ✅ GitHub — repo `ErrorInshanu/botkart` (public)
- ✅ Render — existing account, botkart will be added as NEW Web Service (CVPilot already running separately, do NOT touch it)

---

## 4. Folder Structure (Current State)

```
botkart/
├── backend/
│   ├── src/
│   │   ├── bot/
│   │   │   ├── index.js              ✅ DONE — Bot init, all menu handlers, callback router
│   │   │   ├── commands/
│   │   │   │   ├── start.js          ✅ DONE — /start command, saves customer to DB, shows main menu
│   │   │   │   ├── catalog.js        ✅ DONE — Shows product categories with emoji buttons
│   │   │   │   └── myorders.js       ❌ TODO — Show customer's order history
│   │   │   ├── handlers/
│   │   │   │   ├── products.js       ✅ DONE — Shows products by category with Add to Cart buttons
│   │   │   │   ├── callback.js       ✅ DONE — Routes all inline button presses
│   │   │   │   ├── order.js          ❌ TODO — Full cart + order placement flow
│   │   │   │   └── message.js        ❌ TODO — AI free-text handler via Groq
│   │   │   └── keyboards/
│   │   │       └── mainMenu.js       ❌ TODO — Reusable keyboard helper
│   │   ├── routes/
│   │   │   ├── products.js           ❌ TODO — REST CRUD for products
│   │   │   ├── orders.js             ❌ TODO — REST get/update orders
│   │   │   └── dashboard.js          ❌ TODO — Stats for owner dashboard
│   │   ├── models/
│   │   │   ├── product.js            ✅ DONE — name, description, price, category, imageUrl, inStock
│   │   │   ├── order.js              ✅ DONE — telegramId, items[], totalAmount, status, address
│   │   │   └── customer.js           ✅ DONE — telegramId, firstName, username, totalOrders, totalSpent
│   │   ├── controllers/
│   │   │   ├── productController.js  ❌ TODO
│   │   │   ├── orderController.js    ❌ TODO
│   │   │   └── dashboardController.js ❌ TODO
│   │   ├── services/
│   │   │   ├── groqService.js        ❌ TODO — All Groq API calls centralized here
│   │   │   └── socketService.js      ❌ TODO — Socket.io emit helpers
│   │   └── config/
│   │       ├── db.js                 ✅ DONE — MongoDB connection
│   │       └── groq.js               ✅ DONE — Groq client initialization
│   ├── seed.js                       ✅ DONE — Seeds 6 test products (Food, Drinks, Clothing)
│   ├── .env                          ✅ DONE — All keys filled in
│   ├── .env.example                  ✅ DONE — Template with empty values
│   ├── .gitignore                    ✅ DONE — node_modules and .env ignored
│   ├── package.json                  ✅ DONE — All dependencies installed
│   └── server.js                     ✅ DONE — Express + Socket.io + MongoDB + Bot
│
└── mobile/                           ❌ TODO — Start Day 7
    └── (empty for now)
```

---

## 5. What Is Working Right Now ✅

Tested live on Telegram (@botkart_shop_bot):

- `/start` → Welcome message + persistent keyboard menu (Shop, My Orders, Support, About)
- `🛍️ Shop` → Shows categories (Food, Drinks, Clothing) with emoji inline buttons
- Tap category → Shows all products with name, description, price
- Tap product → "Added to cart" response (placeholder, real cart coming Day 4)
- `📦 My Orders` → "No orders yet" message
- `💬 Support` → Email + hours message
- `ℹ️ About` → Professional about page
- Back to Categories → Works
- Main Menu → Works
- MongoDB → Saving customers on /start
- 6 seed products in DB → Food (2), Drinks (2), Clothing (2)

---

## 6. What Is Remaining ❌

### Day 4 — Cart System & Order Placement
- In-memory cart per user (using Map or session)
- Add to cart → store item in cart
- View cart → show items + total
- Place order → ask for delivery address
- Confirm order → save Order to MongoDB
- Emit `new_order` via Socket.io

### Day 5 — Groq AI Integration
- Create `src/services/groqService.js`
- System prompt: BotKart shopping assistant
- Free text messages → Groq API → smart reply
- Keep last 10 messages as context
- Save conversation to Chat model

### Day 6 — REST API Complete
- `src/routes/products.js` — GET all, GET one, POST, PUT, DELETE
- `src/routes/orders.js` — GET all, GET one, PUT status
- `src/routes/dashboard.js` — stats endpoint
- Mount all routes in server.js
- Test all endpoints in Postman

### Day 7 — React Native App Init
- `cd mobile && npx create-expo-app . --template blank`
- Install: `@react-navigation/native`, `@react-navigation/bottom-tabs`, `axios`, `socket.io-client`, `expo-notifications`
- Bottom tab navigator: Dashboard, Orders, Chats, Products, Settings
- Connect to backend URL

### Day 8 — Orders Screen
- Fetch orders from backend API
- Tab filters: All / Pending / Confirmed / Delivered
- Tap order → order detail screen
- Change status button → PUT API call

### Day 9 — Socket.io Real-time in App
- Connect socket client to backend
- Listen for `new_order` event
- Show push notification when new order arrives
- Auto-refresh orders list

### Day 10 — Chats + Products Screens
- Chats screen: list customers + last message
- Products screen: grid view, Add/Edit/Delete product
- Add product form with all fields

### Day 11 — Deploy to Render
- Push final backend to GitHub
- Create new Web Service on Render
- Add all .env variables in Render dashboard
- Connect mobile app to production URL
- Test everything end to end

### Day 12 — Polish & Testing
- End to end order flow test
- Fix any bugs
- Performance check
- Final commit

---

## 7. MongoDB Data Models

### product.js
```js
{ name, description, price, category, imageUrl, inStock, timestamps }
```

### order.js
```js
{
  telegramId, customerName,
  items: [{ productId, name, price, quantity }],
  totalAmount,
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled',
  deliveryAddress, notes, timestamps
}
```

### customer.js
```js
{ telegramId (unique), firstName, username, totalOrders, totalSpent, lastSeen, timestamps }
```

---

## 8. Bot User Flow (Complete)

```
/start → Welcome + Menu saved to DB
🛍️ Shop → Categories → Products → Add to Cart → View Cart → Place Order → Address → Confirm → Saved to DB → Socket emit → Owner notified
📦 My Orders → List of customer's orders with status
💬 Support → Contact info
ℹ️ About → App info
Free text → Groq AI replies smartly
```

---

## 9. Socket.io Events

| Event | Direction | Payload |
|---|---|---|
| `new_order` | Server → App | `{ order }` |
| `order_updated` | Server → App | `{ orderId, status }` |
| `new_message` | Server → App | `{ telegramId, message }` |

---

## 10. REST API Endpoints (To Be Built Day 6)

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products |
| POST | `/api/products` | Add new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | Get all orders |
| PUT | `/api/orders/:id/status` | Update order status |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | totalOrders, revenue, pending, customers |

---

## 11. Mobile App Style Guide (Discussed, To Be Implemented Day 7+)

**Design Direction:** Dark theme, premium feel, modern e-commerce aesthetic

**Color Palette:**
```
Background:     #0A0A0A  (deep black)
Card:           #1A1A1A  (dark card)
Primary:        #6C63FF  (purple — main brand color)
Accent:         #FF6584  (pink — highlights, badges)
Success:        #00C896  (green — confirmed, delivered)
Warning:        #FFB347  (orange — pending, preparing)
Text Primary:   #FFFFFF
Text Secondary: #A0A0A0
Border:         #2A2A2A
```

**Typography:**
- Font: Inter (or System default)
- Headings: Bold, 24-28px
- Body: Regular, 14-16px
- Labels: Medium, 12px

**Component Style:**
- Cards: rounded corners (16px), subtle shadow
- Buttons: rounded (12px), gradient primary button
- Status badges: colored pill badges
- Bottom tab: dark background, purple active icon
- Order cards: left color border based on status

**Screen Layouts:**
- Dashboard: stat cards in 2x2 grid, recent orders list below
- Orders: tab filter bar at top, FlatList of order cards
- Chats: WhatsApp-style chat list
- Products: 2-column grid with product cards
- Settings: grouped list sections

---

## 12. Important Rules for AI Assistants

- Always use **Telegraf.js** syntax — never node-telegram-bot-api
- All Groq calls go through `src/services/groqService.js` only
- MongoDB models are lowercase: `product.js`, `order.js`, `customer.js`
- Run server always from inside `backend/` folder: `node server.js`
- Git commits always from root `botkart/` folder — never from inside `backend/`
- CVPilot is a separate app on same Render account — **never touch it**
- Groq key for BotKart is **separate** from CVPilot Groq key
- Mobile app uses **Expo managed workflow** — do not eject
- `.env` is never committed — use `.env.example` for template
- Socket.io is server → mobile app only, not bot ↔ backend

---

## 13. How to Resume in a New Chat

Paste this entire file and say:

> **"I am building BotKart. Read the context above. Day 3 is complete. Help me continue from Day 4 — Cart System and Order Placement."**

---

## 14. GitHub

- Repo: `https://github.com/ErrorInshanu/botkart`
- Branch: `main`
- Last commit: Day 3 - catalog and product listing complete






















































# BotKart — Full Project Context
> **Paste this file at the start of any new AI chat to continue building seamlessly.**
> Last updated: June 9, 2026 | Status: Day 4 Complete ✅

---

## 1. Project Overview

**BotKart** is an AI-powered e-commerce Telegram bot with a real-time React Native owner dashboard.

Customers shop entirely inside Telegram. The AI (powered by Groq/LLaMA 3) handles conversations, takes orders, answers FAQs, and provides order updates — no website needed. The shop owner manages everything through a mobile app that receives real-time notifications via Socket.io.

**Target User:**
Small business owners (food, clothing, local products) who want to sell via Telegram without building a full website.

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Telegram Bot | Telegraf.js (Node.js) | Bot logic, menus, order flow |
| AI Brain | Groq API — LLaMA 3 (llama3-8b-8192) | Natural language understanding, smart replies |
| Backend | Node.js + Express.js | REST API, bot server, business logic |
| Database | MongoDB Atlas | Products, orders, customers, chats |
| Real-time | Socket.io | Push new orders/messages to owner app instantly |
| Owner App | React Native + Expo | Mobile dashboard for the shop owner |
| Hosting | Render (free tier) | Backend deployment |
| Version Control | GitHub — repo: `botkart` (public) | Source code |

---

## 3. Credentials & Accounts

> ⚠️ Never commit `.env` to GitHub. `.gitignore` already set up.

```env
MONGODB_URI=mongodb+srv://anshulsharmahr1203_db_user:PASSWORD@botkart.gxir9l4.mongodb.net/botkart?appName=botkart
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TELEGRAM_BOT_TOKEN=7xxxxxxxxx:AAFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=3000
NODE_ENV=development
```

**Accounts status:**
- ✅ MongoDB Atlas — cluster `botkart` connected and working
- ✅ Groq API — key created (separate from CVPilot project)
- ✅ Telegram — bot `@botkart_shop_bot` created via @BotFather, token saved
- ✅ GitHub — repo `ErrorInshanu/botkart` (public)
- ✅ Render — existing account, botkart will be added as NEW Web Service (CVPilot already running separately, do NOT touch it)

---

## 4. Folder Structure (Current State)

```
botkart/
├── backend/
│   ├── src/
│   │   ├── bot/
│   │   │   ├── index.js              ✅ DONE — Bot init, all menu handlers, callback router
│   │   │   ├── commands/
│   │   │   │   ├── start.js          ✅ DONE — /start command, saves customer to DB, shows main menu
│   │   │   │   ├── catalog.js        ✅ DONE — Shows product categories with emoji buttons
│   │   │   │   └── myorders.js       ✅ DONE — Show customer's order history with status
│   │   │   ├── handlers/
│   │   │   │   ├── products.js       ✅ DONE — Shows products by category with Add to Cart buttons
│   │   │   │   ├── callback.js       ✅ DONE — Routes all inline button presses, main menu handler fixed
│   │   │   │   ├── order.js          ✅ DONE — Full cart + order placement + address capture + MongoDB save
│   │   │   │   └── message.js        ✅ DONE — Captures delivery address, placeholder for Groq AI (Day 5)
│   │   │   └── keyboards/
│   │   │       └── mainMenu.js       ❌ TODO — Reusable keyboard helper (optional)
│   │   ├── routes/
│   │   │   ├── products.js           ❌ TODO — REST CRUD for products
│   │   │   ├── orders.js             ❌ TODO — REST get/update orders
│   │   │   └── dashboard.js          ❌ TODO — Stats for owner dashboard
│   │   ├── models/
│   │   │   ├── product.js            ✅ DONE — name, description, price, category, imageUrl, inStock
│   │   │   ├── order.js              ✅ DONE — telegramId, items[], totalAmount, status, address
│   │   │   └── customer.js           ✅ DONE — telegramId, firstName, username, totalOrders, totalSpent
│   │   ├── controllers/
│   │   │   ├── productController.js  ❌ TODO
│   │   │   ├── orderController.js    ❌ TODO
│   │   │   └── dashboardController.js ❌ TODO
│   │   ├── services/
│   │   │   ├── cartService.js        ✅ DONE — In-memory cart Map + checkout state
│   │   │   ├── groqService.js        ❌ TODO — Groq API calls centralized (Day 5)
│   │   │   └── socketService.js      ❌ TODO — Socket.io emit helpers
│   │   └── config/
│   │       ├── db.js                 ✅ DONE — MongoDB connection
│   │       └── groq.js               ✅ DONE — Groq client initialization
│   ├── seed.js                       ✅ DONE — Seeds 6 test products (Food, Drinks, Clothing)
│   ├── .env                          ✅ DONE — All keys filled in
│   ├── .env.example                  ✅ DONE — Template with empty values
│   ├── .gitignore                    ✅ DONE — node_modules and .env ignored
│   ├── package.json                  ✅ DONE — All dependencies installed
│   └── server.js                     ✅ DONE — Express + Socket.io + MongoDB + Bot
│
└── mobile/                           ❌ TODO — Start Day 7
    └── (empty for now)
```

---

## 5. What Is Working Right Now ✅ (Day 4 Complete!)

**Tested live on Telegram (@botkart_shop_bot):**

### **User Flows:**
- ✅ `/start` → Welcome message + persistent keyboard menu (Shop, My Orders, Support, About)
- ✅ `🛍️ Shop` → Shows categories (Food, Drinks, Clothing) with emoji inline buttons
- ✅ Tap category → Shows all products with name, description, price
- ✅ Tap product → "✅ Added to cart" + cart count increments
- ✅ `🛒 View Cart` → Shows all items with quantities + total price
- ✅ `✅ Place Order` → Asks for delivery address
- ✅ User types address → Order saved to MongoDB + Socket.io emit
- ✅ `📦 My Orders` → Shows customer's order history with status, total, date
- ✅ `💬 Support` → Email + hours message
- ✅ `ℹ️ About` → Professional about page
- ✅ Navigation → Back to Categories, Main Menu all work
- ✅ Cart persistence per user → Map<telegramId, cartItems[]>
- ✅ Checkout state tracking → User awaiting address captured correctly

### **Database:**
- ✅ MongoDB → Saving customers on /start
- ✅ MongoDB → Saving orders with items[], totalAmount, deliveryAddress, status
- ✅ 6 seed products in DB → Food (2), Drinks (2), Clothing (2)

### **Bug Fixes (Day 4):**
- ✅ Fixed callback_data mismatch: `show_catalog` → `show_categories`
- ✅ Fixed main_menu handler to show persistent keyboard
- ✅ Fixed exports: `catalogCommand` → `{ showCategories: catalogCommand }`
- ✅ Fixed callback.js export: `{ handleCallback }` → `handleCallback`

---

## 6. What Is Remaining ❌

### Day 5 — Groq AI Integration ⭐ **NEXT**
- Create `src/services/groqService.js`
- System prompt: BotKart shopping assistant
- Free text messages → Groq API → smart reply
- Keep last 10 messages as context in memory
- Save conversation to Chat model (optional MongoDB storage)
- Test with sample queries: "What's your best product?", "How long is delivery?", "Do you have vegan options?"

### Day 6 — REST API Complete
- `src/routes/products.js` — GET all, GET one, POST, PUT, DELETE
- `src/routes/orders.js` — GET all, GET one, PUT status
- `src/routes/dashboard.js` — stats endpoint (totalOrders, revenue, pending, customers)
- Mount all routes in server.js
- Test all endpoints in Postman

### Day 7 — React Native App Init
- `cd mobile && npx create-expo-app . --template blank`
- Install: `@react-navigation/native`, `@react-navigation/bottom-tabs`, `axios`, `socket.io-client`, `expo-notifications`
- Bottom tab navigator: Dashboard, Orders, Chats, Products, Settings
- Connect to backend URL (dev: http://localhost:3000)

### Day 8 — Orders Screen
- Fetch orders from backend API `/api/orders`
- Tab filters: All / Pending / Confirmed / Delivered
- Tap order → order detail screen
- Change status button → PUT `/api/orders/:id/status` API call

### Day 9 — Socket.io Real-time in App
- Connect socket client to backend
- Listen for `new_order` event
- Show push notification when new order arrives
- Auto-refresh orders list

### Day 10 — Chats + Products Screens
- Chats screen: list customers + last message
- Products screen: grid view, Add/Edit/Delete product
- Add product form with all fields

### Day 11 — Deploy to Render
- Push final backend to GitHub
- Create new Web Service on Render
- Add all .env variables in Render dashboard
- Connect mobile app to production URL
- Test everything end to end

### Day 12 — Polish & Testing
- End to end order flow test
- Fix any bugs
- Performance check
- Final commit

---

## 7. MongoDB Data Models

### product.js ✅
```js
{ name, description, price, category, imageUrl, inStock, timestamps }
```

### order.js ✅
```js
{
  telegramId, customerName,
  items: [{ productId, name, price, quantity }],
  totalAmount,
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled',
  deliveryAddress, notes, timestamps
}
```

### customer.js ✅
```js
{ telegramId (unique), firstName, username, totalOrders, totalSpent, lastSeen, timestamps }
```

---

## 8. Bot User Flow (Complete) ✅

```
/start → Welcome + Menu saved to DB
🛍️ Shop → Categories → Products → Add to Cart → View Cart → Place Order → Address → Confirm → Saved to DB → Socket emit → Owner notified
📦 My Orders → List of customer's orders with status
💬 Support → Contact info
ℹ️ About → App info
Free text → Groq AI replies smartly (Day 5)
```

---

## 9. Socket.io Events

| Event | Direction | Payload | Status |
|---|---|---|---|
| `new_order` | Server → App | `{ order }` | ✅ Emitting |
| `order_updated` | Server → App | `{ orderId, status }` | ❌ TODO (Day 8) |
| `new_message` | Server → App | `{ telegramId, message }` | ❌ TODO (Day 10) |

---

## 10. REST API Endpoints (To Be Built Day 6)

### Products
| Method | Endpoint | Description | Status |
|---|---|---|---|
| GET | `/api/products` | Get all products | ❌ TODO |
| POST | `/api/products` | Add new product | ❌ TODO |
| PUT | `/api/products/:id` | Update product | ❌ TODO |
| DELETE | `/api/products/:id` | Delete product | ❌ TODO |

### Orders
| Method | Endpoint | Description | Status |
|---|---|---|---|
| GET | `/api/orders` | Get all orders | ❌ TODO |
| PUT | `/api/orders/:id/status` | Update order status | ❌ TODO |

### Dashboard
| Method | Endpoint | Description | Status |
|---|---|---|---|
| GET | `/api/dashboard` | totalOrders, revenue, pending, customers | ❌ TODO |

---

## 11. Mobile App Style Guide (Discussed, To Be Implemented Day 7+)

**Design Direction:** Dark theme, premium feel, modern e-commerce aesthetic

**Color Palette:**
```
Background:     #0A0A0A  (deep black)
Card:           #1A1A1A  (dark card)
Primary:        #6C63FF  (purple — main brand color)
Accent:         #FF6584  (pink — highlights, badges)
Success:        #00C896  (green — confirmed, delivered)
Warning:        #FFB347  (orange — pending, preparing)
Text Primary:   #FFFFFF
Text Secondary: #A0A0A0
Border:         #2A2A2A
```

**Typography:**
- Font: Inter (or System default)
- Headings: Bold, 24-28px
- Body: Regular, 14-16px
- Labels: Medium, 12px

**Component Style:**
- Cards: rounded corners (16px), subtle shadow
- Buttons: rounded (12px), gradient primary button
- Status badges: colored pill badges
- Bottom tab: dark background, purple active icon
- Order cards: left color border based on status

**Screen Layouts:**
- Dashboard: stat cards in 2x2 grid, recent orders list below
- Orders: tab filter bar at top, FlatList of order cards
- Chats: WhatsApp-style chat list
- Products: 2-column grid with product cards
- Settings: grouped list sections

---

## 12. Important Rules for AI Assistants

- Always use **Telegraf.js** syntax — never node-telegram-bot-api
- All Groq calls go through `src/services/groqService.js` only
- MongoDB models are lowercase: `product.js`, `order.js`, `customer.js`
- Run server always from inside `backend/` folder: `node server.js`
- Git commits always from root `botkart/` folder — never from inside `backend/`
- CVPilot is a separate app on same Render account — **never touch it**
- Groq key for BotKart is **separate** from CVPilot Groq key
- Mobile app uses **Expo managed workflow** — do not eject
- `.env` is never committed — use `.env.example` for template
- Socket.io is server → mobile app only, not bot ↔ backend
- **Exports must be consistent:** Always check what's imported vs exported

---

## 13. Day 4 Bug Fixes Applied

**Fixed on June 9, 2026:**
1. `products.js` line 47: Changed `callback_data: 'show_catalog'` → `'show_categories'`
2. `callback.js`: Added `mainMenuKeyboard` object, fixed main_menu handler
3. `catalog.js` export: Changed `module.exports = catalogCommand` → `module.exports = { showCategories: catalogCommand }`
4. `callback.js` export: Changed `module.exports = { handleCallback }` → `module.exports = handleCallback`

All fixes tested ✅ on live Telegram bot (@botkart_shop_bot)

---

## 14. How to Resume in a New Chat

Paste this entire file and say:

> **"I am building BotKart. Read the context above. Day 4 is complete. Help me continue from Day 5 — Groq AI Integration."**

---

## 15. GitHub

- Repo: `https://github.com/ErrorInshanu/botkart`
- Branch: `main`
- Last commit: Day 4 - Cart System & Order Placement complete with full E2E testing