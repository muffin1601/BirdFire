'use client'

import { supabase } from '@/lib/supabaseClient'
import styles from './Register.module.css'

export default function RegisterPage() {
  async function register(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = e.currentTarget
    const firstName = (form.first_name as HTMLInputElement).value
    const lastName = (form.last_name as HTMLInputElement).value
    const email = (form.email as HTMLInputElement).value
    const password = (form.password as HTMLInputElement).value

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/callback`,
        data: {
          full_name: `${firstName} ${lastName}`,
        },
      },
    })

    if (error) {
      alert(error.message)
      return
    }

    // if (data.user) {
    //   await supabase.from("profiles").upsert({
    //     id: data.user.id,
    //     email,
    //     full_name: `${firstName} ${lastName}`,
    //     role: "customer",
    //     is_active: true,
    //   })
    // }

    window.location.href = '/verify-email'
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

          <button className={styles.btnSubmit}>
            <span>REGISTER</span>
          </button>

          <p className={styles.switch}>
            If you have an account, please <a href="/login">Login Here</a>
          </p>
        </form>
      </div>
    </div>
  )
}