<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, RouterLink } from "vue-router";
import type { Product } from "../types";

const props = defineProps<{
  products: Product[];
}>();

const emit = defineEmits<{
  (e: "add-to-cart", id: number, quantity: number): void;
}>();

const route = useRoute();
const productId = computed(() => Number(route.params.id));
const product = computed(() => props.products.find((p) => p.id === productId.value));

const quantity = ref(1);
const addedSuccess = ref(false);

const isOutOfStock = computed(() => (product.value ? product.value.stock === 0 : true));
const isLowStock = computed(() =>
  product.value ? product.value.stock > 0 && product.value.stock <= 4 : false
);
const formattedPrice = computed(() =>
  product.value ? `$${product.value.price.toFixed(2)}` : "$0.00"
);

function increment() {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++;
  }
}

function decrement() {
  if (quantity.value > 1) {
    quantity.value--;
  }
}

function handleAddToCart() {
  if (product.value && !isOutOfStock.value) {
    emit("add-to-cart", product.value.id, quantity.value);
    addedSuccess.value = true;
    setTimeout(() => {
      addedSuccess.value = false;
    }, 2500);
  }
}
</script>

<template>
  <div v-if="product" class="detail-view">
    <!-- Breadcrumb -->
    <div class="breadcrumb-row">
      <RouterLink to="/" class="back-link">← Back to Catalog</RouterLink>
      <span class="sep">/</span>
      <span class="crumb-cat">{{ product.category }}</span>
      <span class="sep">/</span>
      <span class="crumb-current">{{ product.name }}</span>
    </div>

    <!-- Main Detail Box -->
    <div class="product-layout">
      <!-- Media Column -->
      <div class="media-card">
        <span class="hero-emoji">{{ product.imageUrl }}</span>
        <div class="badges-overlay">
          <span class="category-pill">{{ product.category }}</span>
          <span v-if="isOutOfStock" class="badge-stock out">Sold Out</span>
          <span v-else-if="isLowStock" class="badge-stock warn">Low Stock ({{ product.stock }} left)</span>
          <span v-else class="badge-stock in">In Stock ({{ product.stock }} available)</span>
        </div>
      </div>

      <!-- Buy Box Column -->
      <div class="info-card">
        <h1 class="product-name">{{ product.name }}</h1>

        <div class="meta-row">
          <span class="stars">★★★★★</span>
          <span class="rating-val">{{ product.rating }} / 5.0</span>
          <span class="dot">·</span>
          <span class="student-deal">🎓 Student Discount Eligible</span>
        </div>

        <div class="price-section">
          <span class="main-price">{{ formattedPrice }}</span>
          <span class="tax-note">Tax calculated at checkout</span>
        </div>

        <p class="product-desc">{{ product.description }}</p>

        <!-- Quantity & Add to Cart -->
        <div class="purchase-box">
          <div class="qty-group">
            <label class="qty-label">Quantity:</label>
            <div class="qty-controls">
              <button
                class="qty-btn"
                :disabled="quantity <= 1 || isOutOfStock"
                @click="decrement"
              >
                -
              </button>
              <span class="qty-display">{{ quantity }}</span>
              <button
                class="qty-btn"
                :disabled="quantity >= product.stock || isOutOfStock"
                @click="increment"
              >
                +
              </button>
            </div>
          </div>

          <button
            class="btn-buy"
            :disabled="isOutOfStock"
            @click="handleAddToCart"
          >
            {{ isOutOfStock ? "Sold Out" : `Add ${quantity} to Cart` }}
          </button>
        </div>

        <!-- Success Toast -->
        <div v-if="addedSuccess" class="success-banner">
          ✓ Added {{ quantity }}x {{ product.name }} to your cart!
          <RouterLink to="/cart" class="view-cart-link">View Cart →</RouterLink>
        </div>

        <!-- Specifications -->
        <div class="specs-section">
          <h3>Specifications & Features</h3>
          <dl class="specs-grid">
            <template v-for="(val, key) in product.specs" :key="key">
              <dt>{{ key }}</dt>
              <dd>{{ val }}</dd>
            </template>
          </dl>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    <h2>Product not found</h2>
    <p>The product you are looking for does not exist.</p>
    <RouterLink to="/" class="btn-primary">Return to Catalog</RouterLink>
  </div>
</template>

<style scoped>
.detail-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.breadcrumb-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #6b7280;
}
.back-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}
.back-link:hover {
  text-decoration: underline;
}
.crumb-cat {
  text-transform: capitalize;
}
.crumb-current {
  color: #111827;
  font-weight: 600;
}
.product-layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 32px;
}
@media (max-width: 768px) {
  .product-layout {
    grid-template-columns: 1fr;
  }
}
.media-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 360px;
  padding: 32px;
}
.hero-emoji {
  font-size: 8rem;
}
.badges-overlay {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 8px;
}
.category-pill {
  background: #e0e7ff;
  color: #3730a3;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 6px;
}
.badge-stock {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
}
.badge-stock.in { background: #ecfdf5; color: #059669; }
.badge-stock.warn { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
.badge-stock.out { background: #f3f4f6; color: #6b7280; }

.info-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.product-name {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
}
.meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}
.stars { color: #f59e0b; }
.rating-val { font-weight: 600; color: #374151; }
.student-deal { color: #059669; font-weight: 600; }
.price-section {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.main-price {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
}
.tax-note {
  font-size: 0.85rem;
  color: #6b7280;
}
.product-desc {
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}
.purchase-box {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
}
.qty-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.qty-label {
  font-weight: 600;
  font-size: 0.9rem;
}
.qty-controls {
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
}
.qty-btn {
  background: #f9fafb;
  border: none;
  padding: 8px 14px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
}
.qty-btn:disabled { color: #d1d5db; cursor: not-allowed; }
.qty-display {
  padding: 8px 16px;
  font-weight: 700;
  min-width: 30px;
  text-align: center;
}
.btn-buy {
  flex: 1;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease;
}
.btn-buy:hover:not(:disabled) { background: #1d4ed8; }
.btn-buy:disabled { background: #9ca3af; cursor: not-allowed; }

.success-banner {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.view-cart-link {
  color: #059669;
  text-decoration: underline;
  margin-left: 8px;
}

.specs-section {
  margin-top: 12px;
}
.specs-section h3 {
  margin: 0 0 12px;
  font-size: 1.1rem;
  color: #111827;
}
.specs-grid {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 8px 16px;
  margin: 0;
  font-size: 0.9rem;
}
.specs-grid dt {
  color: #6b7280;
  font-weight: 600;
}
.specs-grid dd {
  color: #111827;
  margin: 0;
}

.not-found {
  text-align: center;
  padding: 64px 24px;
  background: white;
  border-radius: 12px;
}
</style>
