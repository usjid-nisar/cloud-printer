import React, { createContext, useContext, useState } from "react";

// Example initial orders (add more as needed)
const initialOrders = [
  {
    id: 1,
    client: { name: "Circooles", url: "getcirooles.com", avatar: "https://i.pravatar.cc/32?img=1" },
    orderId: "123456",
    date: "Jan 8, 2025",
    status: "In progress",
    integration: "Shopify",
    forwarded: true,
  },
  {
    id: 2,
    client: { name: "Catalog", url: "catalogapp.io", avatar: "https://i.pravatar.cc/32?img=2" },
    orderId: "123457",
    date: "Jan 8, 2025",
    status: "In progress",
    integration: "WooCommerce",
    forwarded: false,
  },
  {
    id: 3,
    client: { name: "Hourglass", url: "hourglass.app", avatar: "https://i.pravatar.cc/32?img=3" },
    orderId: "123458",
    date: "Jan 8, 2025",
    status: "In progress",
    integration: "Shopify",
    forwarded: true,
  },
  {
    id: 4,
    client: { name: "Command+R", url: "cmdr.ai", avatar: "https://i.pravatar.cc/32?img=4" },
    orderId: "123459",
    date: "Jan 8, 2025",
    status: "In progress",
    integration: "WooCommerce",
    forwarded: false,
  },
  {
    id: 5,
    client: { name: "Quotient", url: "quotient.co", avatar: "https://i.pravatar.cc/32?img=5" },
    orderId: "123460",
    date: "Jan 8, 2025",
    status: "In progress",
    integration: "Shopify",
    forwarded: false,
  },
  {
    id: 6,
    client: { name: "Sisyphus", url: "sisyphus.com", avatar: "https://i.pravatar.cc/32?img=6" },
    orderId: "123461",
    date: "Jan 8, 2025",
    status: "Failed",
    integration: "WooCommerce",
    forwarded: true,
  },
  {
    id: 7,
    client: { name: "Circooles", url: "getcirooles.com", avatar: "https://i.pravatar.cc/32?img=1" },
    orderId: "123462",
    date: "Jan 8, 2025",
    status: "Failed",
    integration: "Shopify",
    forwarded: false,
  },
  {
    id: 8,
    client: { name: "Catalog", url: "catalogapp.io", avatar: "https://i.pravatar.cc/32?img=2" },
    orderId: "123463",
    date: "Jan 8, 2025",
    status: "Completed",
    integration: "WooCommerce",
    forwarded: true,
  },
  {
    id: 9,
    client: { name: "Hourglass", url: "hourglass.app", avatar: "https://i.pravatar.cc/32?img=3" },
    orderId: "123464",
    date: "Jan 8, 2025",
    status: "Completed",
    integration: "Shopify",
    forwarded: false,
  },
  {
    id: 10,
    client: { name: "Command+R", url: "cmdr.ai", avatar: "https://i.pravatar.cc/32?img=4" },
    orderId: "123465",
    date: "Jan 8, 2025",
    status: "Completed",
    integration: "WooCommerce",
    forwarded: true,
  },
];

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(initialOrders);
  return (
    <OrdersContext.Provider value={{ orders, setOrders }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}