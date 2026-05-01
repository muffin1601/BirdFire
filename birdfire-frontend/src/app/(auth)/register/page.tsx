'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { toUserMessage } from '@/lib/auth'
import styles from './Register.module.css'

export default function RegisterPage() {
  const { signUpWithEmail } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function register(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const firstName = (form.first_name as HTMLInputElement).value
    const lastName = (form.last_name as HTMLInputElement).value
    const email = (form.email as HTMLInputElement).value
    const password = (form.password as HTMLInputElement).value

    try {
      const result = await signUpWithEmail(email, password, `${firstName} ${lastName}`.trim())
      window.location.href = result.needsEmailVerification ? '/verify-email' : '/'
    } catch (err) {
      setError(toUserMessage(err, 'Registration failed. Please try again.'))
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>REGISTER</h1>
        <p className={styles.subtitle}>Insert your account information:</p>

        <form className={styles.form} onSubmit={register}>
          <input
            className={styles.input}
            name="first_name"
            placeholder="FIRST NAME"
            required
          />

          <input
            className={styles.input}
            name="last_name"
            placeholder="LAST NAME"
          />

          <input
            className={styles.input}
            name="email"
            type="email"
            placeholder="EMAIL"
            required
          />

          <input
            className={styles.input}
            name="password"
            type="password"
            placeholder="PASSWORD"
            required
          />

          <label className={styles.checkbox}>
            <input type="checkbox" />
            <span>Sign up for our newsletter</span>
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.btnSubmit} disabled={loading}>
            <span>{loading ? 'REGISTERING...' : 'REGISTER'}</span>
          </button>

          <p className={styles.switch}>
            If you have an account, please <a href="/login">Login Here</a>
          </p>
        </form>
      </div>
    </div>
  )
}
