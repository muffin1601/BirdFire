'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { AuthModalProvider } from '@/contexts/AuthModalContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <AuthModalProvider>
          {children}
        </AuthModalProvider>
      </CartProvider>
    </AuthProvider>
  );
}
