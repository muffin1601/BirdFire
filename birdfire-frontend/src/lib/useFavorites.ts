'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function useFavorites(productId: string) {
  const [userId, setUserId] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      setUserId(user.id)

      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

      setIsFavorite(!!data)
      setLoading(false)
    }

    load()
  }, [productId])

  const toggle = async () => {
    if (!userId) {
      window.location.href = '/login'
      return
    }

    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)

      setIsFavorite(false)
    } else {
      await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          product_id: productId,
        })

      setIsFavorite(true)
    }
  }

  return { isFavorite, toggle, loading }
}