"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AuthCallbackPage() {
  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error) {
        console.error(error.message)
        return
      }

      const user = data.user
      if (!user) return

      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name,
        role: "customer",
        is_active: true,
      })

      window.location.href = "/login"
    }

    handleCallback()
  }, [])

  return null
}