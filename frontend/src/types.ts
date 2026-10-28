export type Category = "laptops" | "accessories" | "audio" | "books";

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  description: string;
  stock: number;
  rating: number;
  imageUrl: string;
  specs: Record<string, string>;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface CartItemDetail {
  product: Product;
  quantity: number;
  itemTotal: number;
}

export type OrderStatus = "processing" | "shipped" | "delivered";

export interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: string;
}
