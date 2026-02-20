'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallbackPage() {
  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      )

      if (error) {
        console.error(error.message)
      }

      window.location.href = '/login'
    }

    handleCallback()
  }, [])

  return null
}