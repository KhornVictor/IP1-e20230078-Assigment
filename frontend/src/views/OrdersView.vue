<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { Order } from "../types";

const props = defineProps<{
  orders: Order[];
}>();

const sortedOrders = computed(() => {
  return [...props.orders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
});

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <div class="orders-view">
    <div class="orders-header">
      <h2>Your Orders & History</h2>
      <p class="subtitle">Track campus shipments, view invoices, and manage past purchases.</p>
    </div>

    <div v-if="sortedOrders.length > 0" class="orders-list">
      <article
        v-for="order in sortedOrders"
        :key="order.id"
        class="order-card"
      >
        <div class="order-card-header">
          <div class="header-left">
            <span class="order-id">{{ order.id }}</span>
            <span class="order-date">Placed: {{ formatDate(order.date) }}</span>
          </div>

          <div class="header-right">
            <span
              class="status-badge"
              :class="order.status"
            >
              {{ order.status.toUpperCase() }}
            </span>
          </div>
        </div>

        <div class="order-card-body">
          <div class="items-list">
            <div
              v-for="item in order.items"
              :key="item.productId"
              class="order-item-row"
            >
              <div class="item-info">
                <span class="item-name">{{ item.productName }}</span>
                <span class="item-qty">Qty: {{ item.quantity }}</span>
              </div>
              <span class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="order-meta-grid">
            <div class="meta-col">
              <span class="meta-label">Delivery Destination</span>
              <span class="meta-val">{{ order.deliveryAddress }}</span>
            </div>
            <div class="meta-col total-col">
              <span class="meta-label">Total Amount</span>
              <span class="order-total">${{ order.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="empty-orders">
      <span class="orders-icon">📋</span>
      <h3>No orders placed yet</h3>
      <p>When you place an order in the shop, your invoices and tracking status will appear here.</p>
      <RouterLink to="/" class="btn-catalog">Start Shopping</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.orders-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.orders-header h2 {
  margin: 0 0 6px;
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
}
.subtitle {
  margin: 0;
  color: #6b7280;
}
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.order-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}
.order-card-header {
  background: #f8fafc;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.order-id {
  font-weight: 700;
  color: #111827;
  font-size: 1.05rem;
}
.order-date {
  color: #6b7280;
  font-size: 0.88rem;
}
.status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  letter-spacing: 0.05em;
}
.status-badge.processing {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}
.status-badge.shipped {
  background: #fefce8;
  color: #ca8a04;
  border: 1px solid #fef08a;
}
.status-badge.delivered {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}
.order-card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.items-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.order-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
}
.item-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.item-name {
  font-weight: 600;
  color: #1f2937;
}
.item-qty {
  color: #6b7280;
  font-size: 0.85rem;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
}
.item-price {
  font-weight: 600;
  color: #111827;
}
.order-meta-grid {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-top: 1px solid #f3f4f6;
  padding-top: 14px;
  margin-top: 4px;
}
.meta-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.meta-label {
  font-size: 0.78rem;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
}
.meta-val {
  font-size: 0.9rem;
  color: #374151;
}
.order-total {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
}

.empty-orders {
  text-align: center;
  padding: 64px 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}
.orders-icon {
  font-size: 3.5rem;
  display: block;
  margin-bottom: 12px;
}
.btn-catalog {
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
