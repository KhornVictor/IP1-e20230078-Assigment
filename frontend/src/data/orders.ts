import type { Order } from "../types";

export const initialOrders: Order[] = [
  {
    id: "ORD-2026-781",
    date: "2026-09-14T10:30:00Z",
    items: [
      {
        productId: 4,
        productName: "Sony WH-1000XM5 Wireless Headphones",
        price: 299.99,
        quantity: 1,
      },
    ],
    subtotal: 299.99,
    discount: 30.0,
    tax: 21.6,
    total: 291.59,
    status: "delivered",
    deliveryAddress: "Dorm B, Room 210, Campus",
  },
];
