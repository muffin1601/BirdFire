'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './Login.module.css';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    if (userData.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userData.user.id)
        .single();

      if (profileError) {
        await supabase.auth.signOut();
        alert('Unable to verify user role');
        setLoading(false);
        return;
      }

      if (profile.role === 'admin') {
        await supabase.auth.signOut();
        alert('Admins must login from admin panel');
        setLoading(false);
        return;
      }
    }

    window.location.href = '/';
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>SIGN IN</h1>
        <p className={styles.subtitle}>
          Insert your account information:
        </p>

        <form onSubmit={login} className={styles.form}>
          <input
            className={styles.input}
            name="email"
            type="email"
            placeholder="ENTER YOUR EMAIL"
            required
          />

          <div className={styles.passwordWrap}>
            <input
              className={styles.input}
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="PASSWORD"
              required
            />
            <button
              type="button"
              className={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <a href="/forgot-password" className={styles.forgot}>
            Forgot your Password ?
          </a>

          <button
            className={styles.btnSubmit}
            disabled={loading}
          >
            <span>LOGIN</span>
          </button>

          <p className={styles.switch}>
            If you don&apos;t have an account, please{' '}
            <a href="/register">Register Here</a>
          </p>
        </form>
      </div>
    </div>
  );
}