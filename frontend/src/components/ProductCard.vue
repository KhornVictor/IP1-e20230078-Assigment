<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "../types";
import { RouterLink } from "vue-router";

const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits<{
  (e: "add-to-cart", id: number): void;
}>();

const isOutOfStock = computed(() => props.product.stock === 0);
const isLowStock = computed(() => props.product.stock > 0 && props.product.stock <= 4);
const formattedPrice = computed(() => `$${props.product.price.toFixed(2)}`);
</script>

<template>
  <article class="product-card" :class="{ 'out-of-stock': isOutOfStock }">
    <div class="card-media">
      <span class="emoji-thumbnail">{{ product.imageUrl }}</span>
      <span class="category-tag">{{ product.category }}</span>
    </div>

    <div class="card-body">
      <h3 class="product-title">
        <RouterLink :to="`/product/${product.id}`" class="title-link">
          {{ product.name }}
        </RouterLink>
      </h3>
      <p class="description">{{ product.description }}</p>

      <div class="rating-bar">
        <span class="stars">★★★★☆</span>
        <span class="rating-text">{{ product.rating }}</span>
      </div>

      <div class="price-stock-row">
        <span class="price">{{ formattedPrice }}</span>
        <span v-if="isOutOfStock" class="badge badge-soldout">Sold Out</span>
        <span v-else-if="isLowStock" class="badge badge-warn">Only {{ product.stock }} left!</span>
        <span v-else class="badge badge-stock">In Stock</span>
      </div>
    </div>

    <div class="card-actions">
      <RouterLink :to="`/product/${product.id}`" class="btn btn-secondary">
        Details
      </RouterLink>
      <button
        class="btn btn-primary"
        :disabled="isOutOfStock"
        @click="emit('add-to-cart', product.id)"
      >
        {{ isOutOfStock ? "Sold Out" : "Add to Cart" }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
}
.product-card.out-of-stock {
  opacity: 0.75;
}
.card-media {
  background: #f8fafc;
  padding: 32px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 3.5rem;
}
.category-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #e0e7ff;
  color: #3730a3;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 8px;
  border-radius: 6px;
}
.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
.product-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}
.title-link {
  color: #111827;
  text-decoration: none;
}
.title-link:hover {
  color: #2563eb;
}
.description {
  margin: 0;
  color: #6b7280;
  font-size: 0.88rem;
  line-height: 1.4;
}
.rating-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}
.stars {
  color: #f59e0b;
}
.rating-text {
  color: #4b5563;
  font-weight: 500;
}
.price-stock-row {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
}
.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}
.badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
}
.badge-stock {
  background: #ecfdf5;
  color: #059669;
}
.badge-warn {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
.badge-soldout {
  background: #f3f4f6;
  color: #6b7280;
}
.card-actions {
  display: flex;
  gap: 8px;
  padding: 12px 16px 16px;
  border-top: 1px solid #f3f4f6;
}
.btn {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: all 0.15s ease;
  border: none;
}
.btn-primary {
  background: #2563eb;
  color: white;
}
.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}
.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
.btn-secondary {
  background: #f1f5f9;
  color: #334155;
}
.btn-secondary:hover {
  background: #e2e8f0;
}
</style>
