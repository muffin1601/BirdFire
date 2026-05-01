import { supabase } from '@/lib/supabaseClient'

const CART_KEY = 'birdfire_cart'

interface LocalCartItem {
  productId: string
  quantity: number
}

/**
 * DEPRECATED: Use useCart hook from '@/lib/useCart' instead
 * This function is kept for backwards compatibility
 */
export async function addToCart(productId: string, qty = 1) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    if (typeof window === 'undefined') return

    try {
      const savedCart = localStorage.getItem(CART_KEY)
      const cart: LocalCartItem[] = savedCart ? JSON.parse(savedCart) : []
      const existingItem = cart.find((item) => item.productId === productId)

      if (existingItem) {
        existingItem.quantity += qty
      } else {
        cart.push({ productId, quantity: qty })
      }

      localStorage.setItem(CART_KEY, JSON.stringify(cart))
      window.dispatchEvent(new Event('birdfire_cart_updated'))
      return
    } catch (error) {
      console.error('Error adding guest cart item:', error)
      throw error
    }
  }

  try {
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single()

    if (existing) {
      await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + qty })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity: qty,
        })
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
}
