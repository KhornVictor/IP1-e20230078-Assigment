<script setup lang="ts">
import { computed, ref } from "vue";
import type { Category, Product } from "../types";
import ProductCard from "../components/ProductCard.vue";

const props = defineProps<{
  products: Product[];
}>();

const emit = defineEmits<{
  (e: "add-to-cart", id: number): void;
}>();

const search = ref("");
const selectedCategory = ref<Category | "all">("all");
const sortOrder = ref<"featured" | "price-asc" | "price-desc" | "rating">("featured");

const categories: { label: string; value: Category | "all" }[] = [
  { label: "All Categories", value: "all" },
  { label: "Laptops", value: "laptops" },
  { label: "Accessories", value: "accessories" },
  { label: "Audio", value: "audio" },
  { label: "Books", value: "books" },
];

const visibleProducts = computed(() => {
  const query = search.value.trim().toLowerCase();

  const filtered = props.products.filter((p) => {
    const matchesCategory =
      selectedCategory.value === "all" || p.category === selectedCategory.value;
    const matchesSearch =
      query === "" ||
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return filtered.sort((a, b) => {
    if (sortOrder.value === "price-asc") return a.price - b.price;
    if (sortOrder.value === "price-desc") return b.price - a.price;
    if (sortOrder.value === "rating") return b.rating - a.rating;
    return a.id - b.id;
  });
});

function resetFilters() {
  search.value = "";
  selectedCategory.value = "all";
}
</script>

<template>
  <div class="catalog-view">
    <div class="hero-banner">
      <h2>Welcome to Campus Hub Shop</h2>
      <p>Official student gear, tech essentials, textbooks & campus accessories.</p>
    </div>

    <!-- Filters Bar -->
    <div class="filters-card">
      <div class="search-input-wrap">
        <span class="search-icon">🔍</span>
        <input
          v-model="search"
          type="search"
          placeholder="Search by name, brand, or specs..."
          class="search-input"
          aria-label="Search products"
        />
      </div>

      <div class="controls-row">
        <div class="category-chips">
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="chip"
            :class="{ active: selectedCategory === cat.value }"
            @click="selectedCategory = cat.value"
          >
            {{ cat.label }}
          </button>
        </div>

        <div class="sort-wrap">
          <label for="sort-select" class="sort-label">Sort:</label>
          <select id="sort-select" v-model="sortOrder" class="sort-select">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Results Counter -->
    <div class="results-header">
      <p class="count-text">
        Showing <strong>{{ visibleProducts.length }}</strong> of
        <strong>{{ products.length }}</strong> products
      </p>
    </div>

    <!-- Product Grid -->
    <div v-if="visibleProducts.length > 0" class="products-grid">
      <ProductCard
        v-for="item in visibleProducts"
        :key="item.id"
        :product="item"
        @add-to-cart="emit('add-to-cart', $event)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <span class="empty-icon">📦</span>
      <h3>No products match your search</h3>
      <p>Try clearing your search term or selecting a different category.</p>
      <button class="btn btn-primary" @click="resetFilters">Reset Filters</button>
    </div>
  </div>
</template>

<style scoped>
.catalog-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.hero-banner {
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  color: white;
  padding: 36px 32px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}
.hero-banner h2 {
  margin: 0 0 8px;
  font-size: 1.8rem;
  font-weight: 800;
}
.hero-banner p {
  margin: 0;
  font-size: 1.05rem;
  color: #dbeafe;
}
.filters-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 12px;
  font-size: 1rem;
}
.search-input {
  width: 100%;
  padding: 10px 14px 10px 38px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
}
.search-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}
.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.category-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.chip {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.15s ease;
}
.chip:hover {
  background: #e5e7eb;
}
.chip.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}
.sort-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sort-label {
  font-size: 0.88rem;
  font-weight: 600;
  color: #4b5563;
}
.sort-select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 0.88rem;
  background: white;
}
.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.count-text {
  margin: 0;
  color: #6b7280;
  font-size: 0.92rem;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.empty-state {
  text-align: center;
  padding: 48px 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}
.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 12px;
}
.empty-state h3 {
  margin: 0 0 6px;
  color: #111827;
}
.empty-state p {
  margin: 0 0 16px;
  color: #6b7280;
}
.btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}
.btn-primary {
  background: #2563eb;
  color: white;
}
.btn-primary:hover {
  background: #1d4ed8;
}
</style>
