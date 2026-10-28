<script setup lang="ts">
import { RouterLink } from "vue-router";

defineProps<{
  cartCount: number;
}>();
</script>

<template>
  <header class="app-header">
    <div class="nav-container">
      <RouterLink to="/" class="brand">
        <span class="logo-icon">🏪</span>
        <span class="brand-name">Campus Hub Shop</span>
      </RouterLink>

      <nav class="nav-links">
        <RouterLink to="/" class="nav-link" active-class="active">
          Catalog
        </RouterLink>
        <RouterLink to="/cart" class="nav-link cart-link" active-class="active">
          <span>Cart</span>
          <span v-if="cartCount > 0" class="cart-pill">{{ cartCount }}</span>
        </RouterLink>
        <RouterLink to="/orders" class="nav-link" active-class="active">
          Orders
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
}
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #111827;
  font-weight: 700;
  font-size: 1.2rem;
}
.logo-icon {
  font-size: 1.5rem;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 16px;
}
.nav-link {
  text-decoration: none;
  color: #4b5563;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}
.nav-link:hover {
  color: #2563eb;
  background: #f8fafc;
}
.nav-link.active {
  color: #2563eb;
  background: #eff6ff;
}
.cart-pill {
  background: #2563eb;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
}
</style>
