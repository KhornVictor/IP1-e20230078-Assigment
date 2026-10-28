<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter, RouterView } from "vue-router";
import AppNavbar from "./components/AppNavbar.vue";
import { initialProducts } from "./data/products";
import { initialOrders } from "./data/orders";
import type { CartItem, Order, Product } from "./types";

const router = useRouter();

// --- Reactive State (Root Owner) ---
const CART_STORAGE_KEY = "campus-hub:cart";
const ORDERS_STORAGE_KEY = "campus-hub:orders";

function loadSavedCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupted storage
  }
  return [
    { productId: 1, quantity: 1 },
    { productId: 3, quantity: 2 },
  ]; // Starter sample cart
}

function loadSavedOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return initialOrders;
}

const products = ref<Product[]>(initialProducts.map((p) => ({ ...p })));
const cartItems = ref<CartItem[]>(loadSavedCart());
const orders = ref<Order[]>(loadSavedOrders());

// Total quantity of items in cart
const cartCount = computed(() =>
  cartItems.value.reduce((acc, item) => acc + item.quantity, 0)
);

// Persistence
watch(
  cartItems,
  (val) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(val));
    } catch {
      // ignore
    }
  },
  { deep: true }
);

watch(
  orders,
  (val) => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(val));
    } catch {
      // ignore
    }
  },
  { deep: true }
);

// --- Event Handlers (Unidirectional Data Flow) ---
function handleAddToCart(productId: number, quantity = 1) {
  const product = products.value.find((p) => p.id === productId);
  if (!product || product.stock <= 0) return;

  const existing = cartItems.value.find((item) => item.productId === productId);
  const currentInCart = existing ? existing.quantity : 0;
  const toAdd = Math.min(quantity, product.stock - currentInCart);

  if (toAdd > 0) {
    if (existing) {
      existing.quantity += toAdd;
    } else {
      cartItems.value.push({ productId, quantity: toAdd });
    }
  }
}

function handleUpdateQty(productId: number, newQty: number) {
  const item = cartItems.value.find((i) => i.productId === productId);
  const product = products.value.find((p) => p.id === productId);
  if (!item || !product) return;

  if (newQty <= 0) {
    handleRemoveItem(productId);
  } else {
    item.quantity = Math.min(newQty, product.stock);
  }
}

function handleRemoveItem(productId: number) {
  cartItems.value = cartItems.value.filter((i) => i.productId !== productId);
}

function handleClearCart() {
  cartItems.value = [];
}

function handleCheckout(order: Order) {
  // Deduct purchased quantities from product stock
  for (const item of order.items) {
    const product = products.value.find((p) => p.id === item.productId);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
    }
  }

  orders.value.unshift(order);
  cartItems.value = [];
  router.push("/orders");
}
</script>

<template>
  <div class="app-layout">
    <AppNavbar :cart-count="cartCount" />

    <main class="main-content">
      <RouterView
        :products="products"
        :cart-items="cartItems"
        :orders="orders"
        @add-to-cart="handleAddToCart"
        @update-qty="handleUpdateQty"
        @remove-item="handleRemoveItem"
        @clear-cart="handleClearCart"
        @checkout="handleCheckout"
      />
    </main>

    <footer class="app-footer">
      <div class="footer-inner">
        <p>© 2026 Campus Hub Shop — Built with Vue 3, TypeScript & Vite.</p>
        <p class="tagline">Demonstrating Props Down & Events Up Reactivity.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  color: #0f172a;
}
.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
  box-sizing: border-box;
}
.app-footer {
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 24px;
  margin-top: auto;
}
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  font-size: 0.88rem;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.tagline {
  font-size: 0.8rem;
  color: #9ca3af;
}
</style>
