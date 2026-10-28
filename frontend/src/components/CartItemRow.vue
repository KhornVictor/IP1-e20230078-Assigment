<script setup lang="ts">
import { computed } from "vue";
import type { CartItemDetail } from "../types";

const props = defineProps<{
  item: CartItemDetail;
}>();

const emit = defineEmits<{
  (e: "update-qty", productId: number, newQty: number): void;
  (e: "remove", productId: number): void;
}>();

const formattedPrice = computed(() => `$${props.item.product.price.toFixed(2)}`);
const formattedTotal = computed(() => `$${props.item.itemTotal.toFixed(2)}`);

function handleDecrement() {
  if (props.item.quantity > 1) {
    emit("update-qty", props.item.product.id, props.item.quantity - 1);
  } else {
    emit("remove", props.item.product.id);
  }
}

function handleIncrement() {
  if (props.item.quantity < props.item.product.stock) {
    emit("update-qty", props.item.product.id, props.item.quantity + 1);
  }
}
</script>

<template>
  <div class="cart-item-row">
    <div class="item-icon">{{ item.product.imageUrl }}</div>

    <div class="item-details">
      <h4 class="item-title">{{ item.product.name }}</h4>
      <p class="item-unit-price">{{ formattedPrice }} each</p>
      <span class="stock-hint">Max available: {{ item.product.stock }}</span>
    </div>

    <div class="qty-control">
      <button class="qty-btn" aria-label="Decrease quantity" @click="handleDecrement">
        -
      </button>
      <span class="qty-val">{{ item.quantity }}</span>
      <button
        class="qty-btn"
        :disabled="item.quantity >= item.product.stock"
        aria-label="Increase quantity"
        @click="handleIncrement"
      >
        +
      </button>
    </div>

    <div class="item-total-col">
      <span class="item-total">{{ formattedTotal }}</span>
      <button class="remove-btn" @click="emit('remove', item.product.id)">
        Remove
      </button>
    </div>
  </div>
</template>

<style scoped>
.cart-item-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}
.cart-item-row:last-child {
  border-bottom: none;
}
.item-icon {
  font-size: 2.2rem;
  background: #f8fafc;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
.item-details {
  flex: 1;
}
.item-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}
.item-unit-price {
  margin: 2px 0 0;
  color: #6b7280;
  font-size: 0.85rem;
}
.stock-hint {
  font-size: 0.75rem;
  color: #9ca3af;
}
.qty-control {
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
}
.qty-btn {
  background: #f9fafb;
  border: none;
  padding: 6px 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  color: #374151;
}
.qty-btn:hover:not(:disabled) {
  background: #f3f4f6;
}
.qty-btn:disabled {
  color: #d1d5db;
  cursor: not-allowed;
}
.qty-val {
  padding: 6px 14px;
  font-weight: 600;
  font-size: 0.95rem;
  min-width: 20px;
  text-align: center;
}
.item-total-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 90px;
}
.item-total {
  font-weight: 700;
  font-size: 1.05rem;
  color: #111827;
}
.remove-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 4px 0 0;
}
.remove-btn:hover {
  text-decoration: underline;
}
</style>
