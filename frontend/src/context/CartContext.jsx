import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../api/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0, totalItems: 0 });
  const [loading, setLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  // Helper to calculate totals from item list
  const calculateTotals = (items) => {
    const totalAmount = items.reduce((acc, item) => acc + (item.subtotal || item.productPrice * item.quantity), 0);
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    return {
      items,
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalItems,
    };
  };

  // Load from local storage for guests
  const loadGuestCart = () => {
    try {
      const saved = localStorage.getItem('shopease_guest_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCart(calculateTotals(parsed));
      } else {
        setCart({ items: [], totalAmount: 0, totalItems: 0 });
      }
    } catch {
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
    }
  };

  const saveGuestCart = (items) => {
    localStorage.setItem('shopease_guest_cart', JSON.stringify(items));
    setCart(calculateTotals(items));
  };

  // Refresh cart from server (if authenticated) or local storage
  const refreshCart = useCallback(async () => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        const res = await cartService.getCart();
        if (res.data) {
          setCart(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch user cart:', err);
      } finally {
        setLoading(false);
      }
    } else {
      loadGuestCart();
    }
  }, [isAuthenticated]);

  // Sync guest cart to backend upon login
  useEffect(() => {
    const syncGuestCartToBackend = async () => {
      if (isAuthenticated) {
        const saved = localStorage.getItem('shopease_guest_cart');
        if (saved) {
          try {
            const guestItems = JSON.parse(saved);
            for (const item of guestItems) {
              await cartService.addToCart(item.productId, item.quantity);
            }
            localStorage.removeItem('shopease_guest_cart');
          } catch (err) {
            console.error('Failed to sync guest cart:', err);
          }
        }
        refreshCart();
      } else {
        loadGuestCart();
      }
    };

    syncGuestCartToBackend();
  }, [isAuthenticated, refreshCart]);

  const addToCart = async (product, quantity = 1) => {
    setCartError(null);
    if (isAuthenticated) {
      try {
        const res = await cartService.addToCart(product.id, quantity);
        setCart(res.data);
        return { success: true };
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to add item to cart';
        setCartError(msg);
        return { success: false, message: msg };
      }
    } else {
      // Guest mode
      const existingIndex = cart.items.findIndex((item) => item.productId === product.id);
      let updatedItems = [...cart.items];

      if (existingIndex > -1) {
        const newQty = updatedItems[existingIndex].quantity + quantity;
        if (product.stockQuantity && newQty > product.stockQuantity) {
          const msg = `Only ${product.stockQuantity} units available`;
          setCartError(msg);
          return { success: false, message: msg };
        }
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: newQty,
          subtotal: Math.round(newQty * product.price * 100) / 100,
        };
      } else {
        if (product.stockQuantity && quantity > product.stockQuantity) {
          const msg = `Only ${product.stockQuantity} units available`;
          setCartError(msg);
          return { success: false, message: msg };
        }
        updatedItems.push({
          id: Date.now(),
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          productImage: product.imageUrl,
          stockQuantity: product.stockQuantity,
          categoryName: product.categoryName,
          quantity,
          subtotal: Math.round(quantity * product.price * 100) / 100,
        });
      }

      saveGuestCart(updatedItems);
      return { success: true };
    }
  };

  const updateQuantity = async (itemId, productId, quantity) => {
    setCartError(null);
    if (isAuthenticated) {
      try {
        const res = await cartService.updateCartItem(itemId, quantity);
        setCart(res.data);
        return { success: true };
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to update quantity';
        setCartError(msg);
        return { success: false, message: msg };
      }
    } else {
      let updatedItems;
      if (quantity <= 0) {
        updatedItems = cart.items.filter((item) => item.productId !== productId);
      } else {
        updatedItems = cart.items.map((item) => {
          if (item.productId === productId) {
            if (item.stockQuantity && quantity > item.stockQuantity) {
              setCartError(`Only ${item.stockQuantity} units available`);
              return item;
            }
            return {
              ...item,
              quantity,
              subtotal: Math.round(quantity * item.productPrice * 100) / 100,
            };
          }
          return item;
        });
      }
      saveGuestCart(updatedItems);
      return { success: true };
    }
  };

  const removeFromCart = async (itemId, productId) => {
    setCartError(null);
    if (isAuthenticated) {
      try {
        const res = await cartService.removeFromCart(itemId);
        setCart(res.data);
      } catch (err) {
        setCartError('Failed to remove item');
      }
    } else {
      const updatedItems = cart.items.filter((item) => item.productId !== productId);
      saveGuestCart(updatedItems);
    }
  };

  const clearCart = async () => {
    setCartError(null);
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
        setCart({ items: [], totalAmount: 0, totalItems: 0 });
      } catch (err) {
        setCartError('Failed to clear cart');
      }
    } else {
      localStorage.removeItem('shopease_guest_cart');
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartError,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        totalItems: cart.totalItems || 0,
        subtotal: cart.totalAmount || 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
