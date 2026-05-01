export const AUTH_REDIRECT_STORAGE_KEY = 'birdfire_auth_redirect_to';

const FALLBACK_URL = 'http://localhost:3000';

export function getSiteUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL?.replace(/^/, 'https://') ||
    FALLBACK_URL
  ).replace(/\/$/, '');
}

export function getAuthCallbackUrl() {
  return `${getSiteUrl()}/auth/callback`;
}

export function getPasswordResetUrl() {
  return `${getSiteUrl()}/reset-password`;
}

export function sanitizeRedirectPath(value: string | null | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/';
  }

  return value;
}

export function storeAuthRedirect(path: string | null | undefined) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(AUTH_REDIRECT_STORAGE_KEY, sanitizeRedirectPath(path));
}

export function consumeAuthRedirect() {
  if (typeof window === 'undefined') return '/';

  const stored = sessionStorage.getItem(AUTH_REDIRECT_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);

  return sanitizeRedirectPath(stored);
}

export function toUserMessage(err: unknown, fallback: string) {
  const raw =
    err instanceof Error
      ? err.message
      : typeof err === 'object' && err !== null && 'message' in err
        ? String(err.message)
        : fallback;

  const message = raw.toLowerCase();

  if (message.includes('invalid login credentials')) {
    return 'The email or password is incorrect.';
  }

  if (message.includes('email not confirmed')) {
    return 'Please verify your email before signing in.';
  }

  if (message.includes('already registered') || message.includes('already exists')) {
    return 'This account already exists. Please sign in instead.';
  }

  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Too many attempts. Please wait a few minutes and try again.';
  }

  if (message.includes('otp') || message.includes('token')) {
    return 'The verification code is invalid or expired.';
  }

  if (message.includes('unsupported phone provider')) {
    return 'Phone authentication is not yet configured in the project settings. Please use email or Google login for now.';
  }

  return raw || fallback;
}
