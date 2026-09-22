import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [cart, setCart] = useState([
    { id: '1', name: 'Tonkotsu Ramen', price: 15.00, quantity: 1, icon: '🍜' },
    { id: '2', name: 'Pork Gyoza (6pcs)', price: 7.50, quantity: 1, icon: '🥟' }
  ]);

  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Connect to Backend WebSocket
  useEffect(() => {
    const socket = io('/', {
      transports: ['websocket', 'polling']
    });

    socket.on('initial:data', (data) => {
      if (data.orders) setOrders(data.orders);
      if (data.notifications) setNotifications(data.notifications);
      if (data.orders && data.orders.length > 0 && !activeOrder) {
        setActiveOrder(data.orders[0]);
      }
    });

    socket.on('order:updated', (updatedOrder) => {
      setOrders((prev) => {
        const index = prev.findIndex((o) => o.orderId === updatedOrder.orderId);
        if (index >= 0) {
          const next = [...prev];
          next[index] = updatedOrder;
          return next;
        }
        return [updatedOrder, ...prev];
      });

      setActiveOrder((current) => {
        if (!current || current.orderId === updatedOrder.orderId) {
          return updatedOrder;
        }
        return current;
      });
    });

    socket.on('notification:new', (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
    });

    fetchInitialData();

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const ordersRes = await fetch('/api/orders');
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders || []);
        if (data.orders?.length > 0 && !activeOrder) {
          setActiveOrder(data.orders[0]);
        }
      }

      const notifRes = await fetch('/api/notifications');
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData.notifications || []);
      }
    } catch (err) {
      console.error('Error fetching data from server:', err);
    }
  };

  // Cart Functions
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId, delta) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 2.99 : 0;
  const tax = subtotal * 0.085;
  const grandTotal = subtotal + deliveryFee + tax;

  // 1. CUSTOMER ACTION: Place Order
  const placeOrder = async ({ customerName, customerPhone, deliveryAddress, paymentMethod }) => {
    if (cart.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          deliveryAddress,
          paymentMethod: paymentMethod || 'Credit Card (•••• 4242)',
          items: [...cart],
          totalAmount: grandTotal
        })
      });

      const result = await response.json();

      if (result.success && result.order) {
        setActiveOrder(result.order);
        setOrders((prev) => [result.order, ...prev]);
        setCart([]);
      }
    } catch (err) {
      console.error('HTTP Request failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. RESTAURANT ACTION: Accept & Prepare
  const confirmRestaurantOrder = async (orderId) => {
    try {
      await fetch('/api/restaurant/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
    } catch (err) {
      console.error('Failed to confirm restaurant order:', err);
    }
  };

  // 3. COURIER ACTION A: Assign Driver
  const assignCourier = async (orderId) => {
    try {
      await fetch('/api/courier/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
    } catch (err) {
      console.error('Failed to assign courier:', err);
    }
  };

  // 3. COURIER ACTION B: Report Failure (Triggers Saga Compensation)
  const failCourier = async (orderId) => {
    try {
      await fetch('/api/courier/fail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
    } catch (err) {
      console.error('Failed to report courier failure:', err);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        subtotal,
        deliveryFee,
        tax,
        grandTotal,
        orders,
        activeOrder,
        setActiveOrder,
        notifications,
        isSubmitting,
        placeOrder,
        confirmRestaurantOrder,
        assignCourier,
        failCourier
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  return useContext(OrderContext);
}
