'use client';

import { Suspense, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storeAuthRedirect, toUserMessage } from '@/lib/auth';
import styles from './Login.module.css';
import { Eye, EyeOff, Loader, Mail, Phone } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

type AuthMode = 'method-select' | 'email-login' | 'email-signup';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
  } = useAuth();
  const [mode, setMode] = useState<AuthMode>('method-select');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    phone: '', 
    password: '', 
    confirmPassword: '', 
    fullName: '',
  });
  const [error, setError] = useState(searchParams.get('error') ? 'Sign in could not be completed. Please try again.' : '');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const nextPath = searchParams.get('next') || '/';

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      storeAuthRedirect(nextPath);
      await signInWithGoogle();
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
      router.push(nextPath);
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
      const result = await signUpWithEmail(formData.email, formData.password, formData.fullName, formData.phone);
      if (result.needsEmailVerification) {
        router.push('/verify-email');
        return;
      }
      router.push(nextPath);
    } catch (err: unknown) {
      setError(toUserMessage(err, 'Email signup failed'));
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
    <div className={styles.page}>
      <div className={styles.card}>
        {mode === 'method-select' && (
          <>
            <h1 className={styles.title}>SIGN IN</h1>
            <p className={styles.subtitle}>Choose your preferred login method</p>

            <button className={styles.methodBtn} onClick={handleGoogleLogin} disabled={isLoading}>
              <svg className={styles.googleIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
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
          </>
        )}

        {mode === 'email-login' && (
          <>
            <h1 className={styles.title}>LOGIN WITH EMAIL</h1>
            <p className={styles.subtitle}>Enter your credentials</p>

            <form onSubmit={handleEmailLogin} className={styles.form}>
              <input
                className={styles.input}
                name="email"
                type="email"
                placeholder="ENTER YOUR EMAIL"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <div className={styles.passwordWrap}>
                <input
                  className={styles.input}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="PASSWORD"
                  value={formData.password}
                  onChange={handleInputChange}
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

              {error && <p className={styles.error}>{error}</p>}

              <a href="/forgot-password" className={styles.forgot}>
                Forgot your Password?
              </a>

              <button className={styles.btnSubmit} disabled={isLoading}>
                {isLoading ? <Loader size={18} className={styles.spinner} /> : <span>LOGIN</span>}
              </button>
            </form>

            <button className={styles.backBtn} onClick={() => setMode('method-select')}>
              &lt;- Back to Login Options
            </button>
          </>
        )}

        {mode === 'email-signup' && (
          <>
            <h1 className={styles.title}>CREATE ACCOUNT</h1>
            <p className={styles.subtitle}>Sign up with email</p>

            <form onSubmit={handleEmailSignup} className={styles.form}>
              <input
                className={styles.input}
                name="fullName"
                type="text"
                placeholder="FULL NAME"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />

              <input
                className={styles.input}
                name="email"
                type="email"
                placeholder="ENTER YOUR EMAIL"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <input
                className={styles.input}
                name="phone"
                type="tel"
                placeholder="PHONE NUMBER"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />

              <div className={styles.passwordWrap}>
                <input
                  className={styles.input}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="PASSWORD (min 6 chars)"
                  value={formData.password}
                  onChange={handleInputChange}
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

              <input
                className={styles.input}
                name="confirmPassword"
                type="password"
                placeholder="CONFIRM PASSWORD"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />

              {error && <p className={styles.error}>{error}</p>}

              <button className={styles.btnSubmit} disabled={isLoading}>
                {isLoading ? <Loader size={18} className={styles.spinner} /> : <span>SIGN UP</span>}
              </button>
            </form>

            <p className={styles.switch}>
              Already have an account?{' '}
              <button className={styles.link} onClick={() => setMode('email-login')}>
                Login Here
              </button>
            </p>

            <button className={styles.backBtn} onClick={() => setMode('method-select')}>
              &lt;- Back to Login Options
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className={styles.page} />}>
      <LoginPageContent />
    </Suspense>
  );
}
