'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { storeAuthRedirect, toUserMessage } from '@/lib/auth';
import { X, Eye, EyeOff, Loader, Mail, Phone } from 'lucide-react';
import styles from './AuthModal.module.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

type AuthMode = 'method-select' | 'email-login' | 'email-signup' | 'google';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, syncCartAfterLogin, syncFavoritesAfterLogin } = useAuth();
  const { getLocalCart, getLocalFavorites, clearCart, clearFavorites } = useCart();
  const [mode, setMode] = useState<AuthMode>('method-select');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setMode('method-select');
    setFormData({ email: '', password: '', confirmPassword: '' });
    setError('');
    setMessage('');
    onClose();
  };

  const syncGuestData = async () => {
    try {
      const localCart = getLocalCart();
      const localFavorites = getLocalFavorites();

      if (localCart.length > 0) {
        await syncCartAfterLogin(localCart);
        clearCart();
      }

      if (localFavorites.length > 0) {
        await syncFavoritesAfterLogin(localFavorites);
        clearFavorites();
      }
    } catch (err) {
      console.error('Error syncing guest data:', err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      storeAuthRedirect(window.location.pathname + window.location.search);
      await signInWithGoogle();
      // Google redirect handles the callback and sync
      onAuthSuccess?.();
    } catch (err: unknown) {
      setError(toUserMessage(err, 'Google login failed'));
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter email and password');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await signInWithEmail(formData.email, formData.password);
      await syncGuestData();
      handleClose();
      onAuthSuccess?.();
    } catch (err: unknown) {
      setError(toUserMessage(err, 'Email login failed'));
      setIsLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const result = await signUpWithEmail(formData.email, formData.password);
      if (result.needsEmailVerification) {
        setMessage('Please check your email to verify your account.');
        return;
      }
      await syncGuestData();
      handleClose();
      onAuthSuccess?.();
    } catch (err: unknown) {
      setError(toUserMessage(err, 'Email signup failed'));
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setMessage('');
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose}>
          <X size={24} />
        </button>

        {mode === 'method-select' && (
          <div className={styles.container}>
            <h1 className={styles.title}>Sign In to Continue</h1>
            <p className={styles.subtitle}>Choose your preferred login method</p>

            <button className={styles.methodBtn} onClick={handleGoogleLogin} disabled={isLoading}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className={styles.divider}>
              <span>Or</span>
            </div>

            <button className={styles.methodBtn} onClick={() => setMode('email-login')}>
              <Mail className={styles.methodIcon} size={18} aria-hidden="true" />
              Login with Email
            </button>

            <p className={styles.switchText}>
              Don&apos;t have an account?{' '}
              <button className={styles.link} onClick={() => setMode('email-signup')}>
                Sign up with Email
              </button>
            </p>
          </div>
        )}

        {mode === 'email-login' && (
          <div className={styles.container}>
            <h1 className={styles.title}>Login with Email</h1>
            <form onSubmit={handleEmailLogin} className={styles.form}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
              <div className={styles.passwordWrap}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && <p className={styles.error}>{error}</p>}
              {message && <p className={styles.success}>{message}</p>}

              <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                {isLoading ? <Loader size={18} className={styles.spinner} /> : 'Login'}
              </button>
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <a href="/forgot-password" onClick={onClose} style={{ fontSize: '0.875rem', color: '#666', textDecoration: 'underline' }}>
                  Forgot Password?
                </a>
              </div>
            </form>

            <button className={styles.backBtn} onClick={() => setMode('method-select')}>
              &lt;- Back
            </button>
          </div>
        )}

        {mode === 'email-signup' && (
          <div className={styles.container}>
            <h1 className={styles.title}>Create Email Account</h1>
            <form onSubmit={handleEmailSignup} className={styles.form}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
              <div className={styles.passwordWrap}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password (min 6 chars)"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={styles.input}
                required
              />

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                {isLoading ? <Loader size={18} className={styles.spinner} /> : 'Sign Up'}
              </button>
            </form>

            <button className={styles.backBtn} onClick={() => setMode('method-select')}>
              &lt;- Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
