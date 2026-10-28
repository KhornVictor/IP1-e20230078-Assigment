<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import type { CartItem, CartItemDetail, Order, Product } from "../types";
import CartItemRow from "../components/CartItemRow.vue";

const props = defineProps<{
  cartItems: CartItem[];
  products: Product[];
}>();

const emit = defineEmits<{
  (e: "update-qty", productId: number, qty: number): void;
  (e: "remove-item", productId: number): void;
  (e: "clear-cart"): void;
  (e: "checkout", order: Order): void;
}>();

const promoInput = ref("CAMPUS10");
const appliedDiscount = ref(0.1); // 10% student discount default
const promoMessage = ref("Student discount applied! (10% OFF)");
const deliveryAddress = ref("Dorm A, Room 304, Campus Housing");
const isOrderPlaced = ref(false);

const detailedItems = computed<CartItemDetail[]>(() => {
  return props.cartItems
    .map((item) => {
      const prod = props.products.find((p) => p.id === item.productId);
      if (!prod) return null;
      return {
        product: prod,
        quantity: item.quantity,
        itemTotal: prod.price * item.quantity,
      };
    })
    .filter((x): x is CartItemDetail => x !== null);
});

const subtotal = computed(() =>
  detailedItems.value.reduce((acc, item) => acc + item.itemTotal, 0)
);

const discountAmount = computed(() => subtotal.value * appliedDiscount.value);
const taxAmount = computed(() => (subtotal.value - discountAmount.value) * 0.08);
const finalTotal = computed(() => subtotal.value - discountAmount.value + taxAmount.value);

function applyPromo() {
  if (promoInput.value.trim().toUpperCase() === "CAMPUS10") {
    appliedDiscount.value = 0.1;
    promoMessage.value = "Student discount applied! (10% OFF)";
  } else if (promoInput.value.trim().toUpperCase() === "VIP20") {
    appliedDiscount.value = 0.2;
    promoMessage.value = "VIP discount applied! (20% OFF)";
  } else {
    appliedDiscount.value = 0;
    promoMessage.value = "Invalid promo code.";
  }
}

function handleCheckout() {
  if (detailedItems.value.length === 0) return;

  const newOrder: Order = {
    id: `ORD-2026-${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toISOString(),
    items: detailedItems.value.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
    })),
    subtotal: subtotal.value,
    discount: discountAmount.value,
    tax: taxAmount.value,
    total: finalTotal.value,
    status: "processing",
    deliveryAddress: deliveryAddress.value,
  };

  emit("checkout", newOrder);
  isOrderPlaced.value = true;
}
</script>

<template>
  <div class="cart-view">
    <div class="cart-header">
      <h2>Your Shopping Cart</h2>
      <p class="cart-subtitle">
        Review your campus essentials and finalize your order.
      </p>
    </div>

    <div v-if="detailedItems.length > 0" class="cart-grid">
      <!-- Items Table Column -->
      <div class="items-card">
        <div class="items-header">
          <span>Items ({{ detailedItems.length }})</span>
          <button class="btn-clear" @click="emit('clear-cart')">Clear All</button>
        </div>

        <div class="items-list">
          <CartItemRow
            v-for="item in detailedItems"
            :key="item.product.id"
            :item="item"
            @update-qty="(id, qty) => emit('update-qty', id, qty)"
            @remove="(id) => emit('remove-item', id)"
          />
        </div>

        <div class="items-footer">
          <RouterLink to="/" class="continue-link">← Continue Shopping</RouterLink>
        </div>
      </div>

      <!-- Order Summary Column -->
      <div class="summary-card">
        <h3>Order Summary</h3>

        <div class="promo-box">
          <label class="promo-label">Promo / Student Code</label>
          <div class="promo-input-group">
            <input
              v-model="promoInput"
              placeholder="e.g. CAMPUS10"
              class="promo-input"
            />
            <button class="btn-apply" @click="applyPromo">Apply</button>
          </div>
          <span v-if="promoMessage" class="promo-feedback">{{ promoMessage }}</span>
        </div>

        <div class="summary-breakdown">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>

          <div v-if="discountAmount > 0" class="summary-row discount-row">
            <span>Student Discount</span>
            <span>-${{ discountAmount.toFixed(2) }}</span>
          </div>

          <div class="summary-row">
            <span>Estimated Tax (8%)</span>
            <span>${{ taxAmount.toFixed(2) }}</span>
          </div>

          <div class="summary-row">
            <span>Campus Delivery</span>
            <span class="free-tag">FREE</span>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-row total-row">
            <span>Total</span>
            <span>${{ finalTotal.toFixed(2) }}</span>
          </div>
        </div>

        <div class="address-box">
          <label class="address-label">Campus Delivery Location</label>
          <input v-model="deliveryAddress" class="address-input" />
        </div>

        <button class="btn-checkout" @click="handleCheckout">
          Place Order (${{ finalTotal.toFixed(2) }})
        </button>
      </div>
    </div>

    <!-- Empty Cart State -->
    <div v-else class="empty-cart-card">
      <span class="cart-emoji">🛒</span>
      <h3>Your cart is empty</h3>
      <p>Explore our catalog to find laptops, accessories, and course textbooks.</p>
      <RouterLink to="/" class="btn-shop">Browse Catalog</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.cart-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.cart-header h2 {
  margin: 0 0 6px;
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
}
.cart-subtitle {
  margin: 0;
  color: #6b7280;
}
.cart-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
}
@media (max-width: 900px) {
  .cart-grid {
    grid-template-columns: 1fr;
  }
}
.items-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}
.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 700;
  color: #111827;
}
.btn-clear {
  background: none;
  border: none;
  color: #dc2626;
  font-size: 0.85rem;
  cursor: pointer;
}
.btn-clear:hover {
  text-decoration: underline;
}
.items-footer {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
}
.continue-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}
.summary-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.summary-card h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #0f172a;
}
.promo-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.promo-label, .address-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}
.promo-input-group {
  display: flex;
  gap: 8px;
}
.promo-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.88rem;
}
.btn-apply {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
}
.btn-apply:hover { background: #e2e8f0; }
.promo-feedback {
  font-size: 0.78rem;
  color: #059669;
  font-weight: 600;
}
.summary-breakdown {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: #4b5563;
}
.discount-row {
  color: #059669;
  font-weight: 600;
}
.free-tag {
  background: #ecfdf5;
  color: #059669;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 700;
}
.summary-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 6px 0;
}
.total-row {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
}
.address-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.address-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.88rem;
}
.btn-checkout {
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease;
}
.btn-checkout:hover {
  background: #1d4ed8;
}

.empty-cart-card {
  text-align: center;
  padding: 64px 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}
.cart-emoji {
  font-size: 4rem;
  display: block;
  margin-bottom: 12px;
}
.btn-shop {
  display: inline-block;
  margin-top: 16px;
  background: #2563eb;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
}
</style>
