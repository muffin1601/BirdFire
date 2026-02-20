'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './ForgotPassword.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError('Something went wrong. Please try again.');
      return;
    }

    setMessage('If an account exists, a reset email has been sent.');
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Reset your password</h1>
        <p>We will send you an email to reset your password.</p>

        {error && <p className={styles.error}>• {error}</p>}
        {message && <p className={styles.success}>• {message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className={styles.actions}>
            <button type="submit">SUBMIT</button>
            <a href="/login">CANCEL</a>
          </div>
        </form>
      </div>
    </div>
  );
}