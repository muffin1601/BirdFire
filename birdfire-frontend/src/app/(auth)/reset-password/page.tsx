'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import styles from './ResetPassword.module.css'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        setError('Reset link expired or invalid.')
      }
      setLoading(false)
    }

    checkSession()
  }, [])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Reset link expired or invalid.')
      return
    }

    setMessage('Password updated successfully.')
    setTimeout(() => {
      window.location.href = '/login'
    }, 2000)
  }

  if (loading) return null

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>SET NEW PASSWORD</h1>
        <p className={styles.subtitle}>
          Enter a new password for your account.
        </p>

        {error && <p className={styles.error}>• {error}</p>}
        {message && <p className={styles.success}>• {message}</p>}

        {!error && (
          <form className={styles.form} onSubmit={handleReset}>
            <div className={styles.passwordField}>
              <input
                className={styles.input}
                type={showPassword ? 'text' : 'password'}
                placeholder="NEW PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className={styles.toggle}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>

            <button className={styles.btnSubmit}>
              <span>UPDATE PASSWORD</span>
            </button>

            <p className={styles.switch}>
              Remembered it? <a href="/login">Login here</a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}