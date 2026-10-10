# ShopEase — Full-Stack E-Commerce Platform

ShopEase is a clean, modern e-commerce web application built using **React with Vite**, **Java 21 with Spring Boot**, and **MongoDB**.

---

## 🏛 System Architecture & Security Overview

### 🔐 Authentication & Authorization (Spring Security + BCrypt + JWT)
- **Roles**:
  - `CUSTOMER` (`ROLE_CUSTOMER`): Can browse products, view details, filter/sort, manage cart, place orders, and review order history. Cannot modify catalog products or categories.
  - `ADMIN` (`ROLE_ADMIN`): Full access to product catalog management, category creation and maintenance, and store administrative controls.
- **Backend Role Protection**:
  - Enforced via Spring Security `SecurityFilterChain`.
  - Administrative endpoints (`POST`, `PUT`, `DELETE` on `/api/products/**` and `/api/categories/**`) strictly require `ROLE_ADMIN`.
  - Customer endpoints (`/api/cart/**`, `/api/orders/**`) require authentication; customer data access is isolated so customers only access their own cart and orders.
  - Secrets are configured via environment variables (`APP_JWT_SECRET`, `APP_JWT_EXPIRATION_MS`) with secure fallback for local development. Sensitive tokens are never logged or exposed in URLs.
  - Public registration (`POST /api/auth/register`) strictly creates `ROLE_CUSTOMER` accounts.

---

## 🚀 Development Credentials (Pre-seeded)

On application startup, a development-only initializer (`DataInitializer`) creates default accounts:

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Administrator** | `admin@shopease.com` | `admin123` | Full catalog, product & category management |
| **Customer** | `customer@shopease.com` | `customer123` | Storefront browsing, persistent cart, checkout, order history |

*(The login page includes quick-fill buttons for instant testing in local development).*

---

## 📡 REST API Endpoints

### 🔑 Authentication
- `POST /api/auth/register` — Register a customer account (name, email, password).
- `POST /api/auth/login` — Authenticate and receive a signed JWT token + user roles.
- `GET /api/auth/me` — Retrieve the authenticated user's profile.

### 🛒 Shopping Cart
- `GET /api/cart` — Retrieve authenticated customer's shopping cart.
- `POST /api/cart` — Add product to cart with quantity validation (`{ productId, quantity }`).
- `PUT /api/cart/{itemId}` — Update item quantity (`{ quantity }`).
- `DELETE /api/cart/{itemId}` — Remove item from cart.
- `DELETE /api/cart` — Clear all items from cart.

### 📦 Orders & Checkout (Cash on Delivery)
- `POST /api/orders` — Create order (`{ customerName, phoneNumber, deliveryAddress, items }`). Recalculates prices on backend, validates stock availability, deducts inventory safely in document atomic updates, and clears the user's cart.
- `GET /api/orders` — Retrieve authenticated customer's order history.
- `GET /api/orders/{id}` — Retrieve order details by ID (restricted to order owner or ADMIN).

### 🏷️ Categories
- `GET /api/categories` — List all product categories *(Public)*.
- `GET /api/categories/{id}` — Get category by ID *(Public)*.
- `POST /api/categories` — Create category *(ADMIN only)*.
- `PUT /api/categories/{id}` — Update category *(ADMIN only)*.
- `DELETE /api/categories/{id}` — Delete category if no products linked *(ADMIN only)*.

### 📦 Products
- `GET /api/products` — List products with pagination, category filter (`categoryId`), price filters (`minPrice`, `maxPrice`), and sorting (`sortBy`, `sortDir`) *(Public)*.
- `GET /api/products/{id}` — Get single product details *(Public)*.
- `POST /api/products` — Create product with category selection *(ADMIN only)*.
- `PUT /api/products/{id}` — Update product *(ADMIN only)*.
- `DELETE /api/products/{id}` — Delete product *(ADMIN only)*.

### 🩺 System Health
- `GET /api/health` — Returns JSON status `{ "status": "UP", "service": "ShopEase E-Commerce API" }` *(Public)*.

---

## 💻 Running Locally (Windows PowerShell)

### Prerequisites
- **Java 21** JDK installed and configured in `PATH`.
- **MongoDB** running locally on port `27017` (database: `shopease_db`).
- **Node.js** (v18+) and npm.
- **Maven** (3.8+) or included wrapper.

### 1. Start the Spring Boot Backend
Open a PowerShell terminal in `backend/`:

```powershell
cd d:\TT-PROJECT\backend
mvn spring-boot:run
```

*By default, connects to MongoDB at `mongodb://localhost:27017/shopease_db`. Configurable via the `SPRING_DATA_MONGODB_URI` environment variable.*

### 2. Run Backend Unit & Integration Tests
```powershell
cd d:\TT-PROJECT\backend
mvn test
```

### 3. Start the React Frontend
Open a second PowerShell terminal in `frontend/`:

```powershell
cd d:\TT-PROJECT\frontend
npm.cmd install
npm.cmd run dev
```

*Access the application in your browser at `http://localhost:5173/`.*
