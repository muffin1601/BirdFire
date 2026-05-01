'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { toUserMessage } from '@/lib/auth'
import styles from './ResetPassword.module.css'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search)
        const authError = searchParams.get('error_description') || searchParams.get('error')
        const code = searchParams.get('code')

        if (authError) {
          throw new Error(authError)
        }

        if (code) {
          const { data: { session: initialSession } } = await supabase.auth.getSession()
          if (!initialSession) {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
            if (exchangeError) {
              // If it's already redeemed, it might be fine
              if (!exchangeError.message.includes('already been redeemed')) {
                throw exchangeError
              }
            }
          }
        }

        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) throw sessionError
          window.history.replaceState(null, document.title, window.location.pathname)
        }

        const { data } = await supabase.auth.getUser()
        if (!data.user) {
          setError('Reset link expired or invalid.')
        }
      } catch (err) {
        console.error('Reset session error:', err)
        setError(toUserMessage(err, 'Reset link expired or invalid.'))
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSubmitting(false)

    if (error) {
      setError(toUserMessage(error, 'Reset link expired or invalid.'))
      return
    }

    setMessage('Password updated successfully. Redirecting to login...')
    setTimeout(() => {
      window.location.href = '/login'
    }, 1500)
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>SET NEW PASSWORD</h1>
          <p className={styles.subtitle}>Checking your reset link...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>SET NEW PASSWORD</h1>
        <p className={styles.subtitle}>
          Enter a new password for your account.
        </p>

        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}

        {!error && (
          <form className={styles.form} onSubmit={handleReset}>
            <div className={styles.passwordField}>
              <input
                className={styles.input}
                type={showPassword ? 'text' : 'password'}
                placeholder="NEW PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
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

            <button className={styles.btnSubmit} disabled={submitting}>
              <span>{submitting ? 'UPDATING...' : 'UPDATE PASSWORD'}</span>
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
