'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './ResetPassword.module.css';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError('Reset link expired or invalid.');
      return;
    }

    setMessage('Password updated successfully.');
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Set new password</h1>

        {error && <p className={styles.error}>• {error}</p>}
        {message && <p className={styles.success}>• {message}</p>}

        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="NEW PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">UPDATE PASSWORD</button>
        </form>
      </div>
    </div>
  );
}