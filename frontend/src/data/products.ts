import type { Product } from "../types";

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "ThinkPad T14 Gen 4",
    category: "laptops",
    price: 1150.0,
    description: "Reliable 14-inch enterprise business laptop with Intel Core i7 and 16GB DDR5 RAM.",
    stock: 2, // Low stock demo
    rating: 4.8,
    imageUrl: "💻",
    specs: {
      Processor: "Intel Core i7-1365U vPro",
      RAM: "16 GB DDR5",
      Storage: "512 GB PCIe NVMe SSD",
      Display: "14-inch WUXGA (1920 x 1200) IPS",
    },
  },
  {
    id: 2,
    name: "MacBook Air M2",
    category: "laptops",
    price: 999.0,
    description: "Incredibly thin and fast laptop with Apple M2 chip and all-day 18-hour battery life.",
    stock: 8,
    rating: 4.9,
    imageUrl: "🍎",
    specs: {
      Chip: "Apple M2 (8-core CPU / 8-core GPU)",
      RAM: "8 GB Unified Memory",
      Storage: "256 GB SSD",
      Display: "13.6-inch Liquid Retina Display",
    },
  },
  {
    id: 3,
    name: "USB-C 7-in-1 Aluminum Hub",
    category: "accessories",
    price: 39.99,
    description: "Expand your ports with 4K HDMI, 100W Power Delivery, SD reader, and 3x USB-A 3.0 ports.",
    stock: 25,
    rating: 4.6,
    imageUrl: "🔌",
    specs: {
      Ports: "1x HDMI 4K@60Hz, 3x USB 3.0, 1x USB-C PD, SD/TF",
      Power: "100W Pass-through charging",
      Material: "Anodized Aluminum",
    },
  },
  {
    id: 4,
    name: "Sony WH-1000XM5 Wireless Headphones",
    category: "audio",
    price: 299.99,
    description: "Industry-leading active noise cancellation with Auto NC Optimizer and 30-hour battery.",
    stock: 0, // Sold out demo
    rating: 4.7,
    imageUrl: "🎧",
    specs: {
      NoiseCanceling: "Industry Leading Dual Processor ANC",
      BatteryLife: "Up to 30 hours",
      Connectivity: "Bluetooth 5.2 / 3.5mm AUX",
    },
  },
  {
    id: 5,
    name: "Logitech MX Master 3S Mouse",
    category: "accessories",
    price: 89.99,
    description: "Ergonomic wireless performance mouse with 8K DPI sensor and quiet electromagnetic scroll.",
    stock: 4, // Low stock demo
    rating: 4.9,
    imageUrl: "🖱️",
    specs: {
      Sensor: "Darkfield 8000 DPI",
      Battery: "70 days on full charge",
      Buttons: "7 customizable buttons",
    },
  },
  {
    id: 6,
    name: "Clean Architecture by Robert C. Martin",
    category: "books",
    price: 34.5,
    description: "A craftsman's guide to software structure and design for professional software engineers.",
    stock: 15,
    rating: 4.8,
    imageUrl: "📚",
    specs: {
      Author: "Robert C. Martin (Uncle Bob)",
      Pages: "432 pages",
      Publisher: "Prentice Hall",
    },
  },
];
