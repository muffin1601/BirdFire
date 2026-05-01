'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface CartItem {
  productId: string;
  quantity: number;
  price?: number;
  name?: string;
}

export interface FavoriteItem {
  productId: string;
}

interface CartContextType {
  cart: CartItem[];
  favorites: FavoriteItem[];
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  clearFavorites: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  getLocalCart: () => CartItem[];
  getLocalFavorites: () => FavoriteItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'birdfire_cart';
const FAVORITES_KEY = 'birdfire_favorites';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        const savedCart = localStorage.getItem(CART_KEY);
        const savedFavorites = localStorage.getItem(FAVORITES_KEY);

        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
      setIsHydrated(true);
    };

    loadFromLocalStorage();
    window.addEventListener('birdfire_cart_updated', loadFromLocalStorage);

    return () => {
      window.removeEventListener('birdfire_cart_updated', loadFromLocalStorage);
    };
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  // Save favorites to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isHydrated]);

  const addToCart = useCallback((productId: string, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === productId);

      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevCart, { productId, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const itemPrice = item.price || 0;
      return total + itemPrice * item.quantity;
    }, 0);
  }, [cart]);

  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const addToFavorites = useCallback((productId: string) => {
    setFavorites((prevFavorites) => {
      if (!prevFavorites.find((item) => item.productId === productId)) {
        return [...prevFavorites, { productId }];
      }
      return prevFavorites;
    });
  }, []);

  const removeFromFavorites = useCallback((productId: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((item) => item.productId !== productId)
    );
  }, []);

  const isFavorite = useCallback((productId: string) => {
    return favorites.some((item) => item.productId === productId);
  }, [favorites]);

  const getLocalCart = useCallback(() => cart, [cart]);

  const getLocalFavorites = useCallback(() => favorites, [favorites]);

  const value = useMemo(
    () => ({
      cart,
      favorites,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      clearFavorites,
      getCartTotal,
      getCartCount,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      getLocalCart,
      getLocalFavorites,
    }),
    [
      cart,
      favorites,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      clearFavorites,
      getCartTotal,
      getCartCount,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      getLocalCart,
      getLocalFavorites,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
