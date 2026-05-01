'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import { useCart as useCartContext } from '@/contexts/CartContext'
import type { CartItem } from '@/contexts/CartContext'

export function useCart() {
  const { user } = useAuth()
  const userId = user?.id
  const { 
    cart: localCart, 
    addToCart: addLocalCart, 
    removeFromCart: removeLocalCart, 
    updateCartQuantity: updateLocalQuantity,
    clearCart: clearLocalCart,
    getLocalCart,
  } = useCartContext()
  
  const [dbCart, setDbCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  // Load cart from database if user is authenticated
  useEffect(() => {
    if (!userId) {
      setDbCart([])
      return
    }

    let isMounted = true

    const loadDbCart = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', userId)

        if (error) throw error
        if (isMounted) setDbCart(data || [])
      } catch (error) {
        console.error('Error loading cart from database:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadDbCart()

    return () => {
      isMounted = false
    }
  }, [userId])

  // Determine which cart to use
  const activeCart = user ? dbCart : localCart

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) {
      // Not authenticated, use localStorage
      addLocalCart(productId, quantity)
      return
    }

    // User authenticated, use database
    try {
      setLoading(true)
      const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle()

      if (existing) {
        await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity: quantity,
          })
      }

      // Refresh cart
      const { data } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
      
      setDbCart(data || [])
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId: string) => {
    if (!user) {
      // Not authenticated, use localStorage
      removeLocalCart(productId)
      return
    }

    // User authenticated, use database
    try {
      setLoading(true)
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)

      // Refresh cart
      const { data } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
      
      setDbCart(data || [])
    } catch (error) {
      console.error('Error removing from cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    if (!user) {
      // Not authenticated, use localStorage
      updateLocalQuantity(productId, quantity)
      return
    }

    // User authenticated, use database
    try {
      setLoading(true)
      await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId)

      // Refresh cart
      const { data } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
      
      setDbCart(data || [])
    } catch (error) {
      console.error('Error updating cart quantity:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    if (!user) {
      // Not authenticated, clear localStorage (handled by context)
      clearLocalCart()
      return
    }

    // User authenticated, clear database
    try {
      setLoading(true)
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      setDbCart([])
    } catch (error) {
      console.error('Error clearing cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCartItemCount = () => {
    return activeCart.reduce((count, item) => count + item.quantity, 0)
  }

  const getCartTotalAmount = () => {
    return activeCart.reduce((total, item) => {
      const price = item.price || 0
      return total + price * item.quantity
    }, 0)
  }

  return {
    cart: activeCart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    getCartTotalAmount,
    getLocalCart,
    isAuthenticated: !!user,
  }
}
