import { createRouter, createWebHistory } from "vue-router";
import ProductCatalogView from "../views/ProductCatalogView.vue";
import ProductDetailView from "../views/ProductDetailView.vue";
import CartView from "../views/CartView.vue";
import OrdersView from "../views/OrdersView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "catalog",
      component: ProductCatalogView,
    },
    {
      path: "/product/:id",
      name: "product-detail",
      component: ProductDetailView,
    },
    {
      path: "/cart",
      name: "cart",
      component: CartView,
    },
    {
      path: "/orders",
      name: "orders",
      component: OrdersView,
    },
  ],
});

export default router;
