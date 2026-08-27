import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../api/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await cartApi.getCart(user.id);
      if (res && res.data) {
        setCart(res.data);
      }
    } catch (e) {
      console.error('Error fetching cart:', e);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await cartApi.addItem({ productId, quantity }, user?.id);
      if (res && res.data) {
        setCart(res.data);
      }
    } catch (e) {
      console.error('Error adding to cart:', e);
      throw e;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await cartApi.updateQuantity(productId, quantity, user?.id);
      if (res && res.data) {
        setCart(res.data);
      }
    } catch (e) {
      console.error('Error updating quantity:', e);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await cartApi.removeItem(productId, user?.id);
      if (res && res.data) {
        setCart(res.data);
      }
    } catch (e) {
      console.error('Error removing item:', e);
    }
  };

  const clearCart = async () => {
    try {
      const res = await cartApi.clearCart(user?.id);
      if (res && res.data) {
        setCart(res.data);
      }
    } catch (e) {
      console.error('Error clearing cart:', e);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, refreshCart: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
