'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'

export function useFavorites(productId: string) {
  const { user } = useAuth()
  const userId = user?.id
  const { favorites, isFavorite: isLocalFavorite, addToFavorites: addLocalFavorite, removeFromFavorites: removeLocalFavorite } = useCart()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      
      if (!userId) {
        // Not authenticated, check localStorage
        const localFav = isLocalFavorite(productId)
        setIsFavorite(localFav)
        setLoading(false)
        return
      }

      // User is authenticated, check database
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', userId)
          .eq('product_id', productId)
          .maybeSingle()

        if (error) throw error

        setIsFavorite(!!data)
      } catch (error) {
        console.error('Error fetching favorite:', error)
        setIsFavorite(false)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [productId, userId, favorites, isLocalFavorite])

  const toggle = async () => {
    if (!user) {
      // Not authenticated, use localStorage
      if (isFavorite) {
        removeLocalFavorite(productId)
        setIsFavorite(false)
      } else {
        addLocalFavorite(productId)
        setIsFavorite(true)
      }
      return
    }

    // User is authenticated, use database
    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)

        setIsFavorite(false)
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: productId,
          })

        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  return { isFavorite, toggle, loading }
}
