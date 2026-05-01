'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getAuthCallbackUrl, getPasswordResetUrl } from '@/lib/auth';
import type { Session, User } from '@supabase/supabase-js';

interface CartItem {
  productId: string;
  quantity: number;
}

interface FavoriteItem {
  productId: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName?: string, phone?: string) => Promise<{ needsEmailVerification: boolean }>;
  signInWithPhone: (phone: string, password: string) => Promise<void>;
  signUpWithPhone: (phone: string, password: string, fullName?: string) => Promise<{ session: Session | null }>;
  sendPhoneOtp: (phone: string) => Promise<void>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  ensureUserProfile: (profileUser?: User | null) => Promise<void>;
  syncCartAfterLogin: (localCart: CartItem[], userId?: string) => Promise<void>;
  syncFavoritesAfterLogin: (localFavorites: FavoriteItem[], userId?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef<User | null>(null);
  const lastSyncedUserId = useRef<string | null>(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const ensureUserProfile = useCallback(async (profileUser?: User | null) => {
    const targetUser = profileUser ?? userRef.current;
    if (!targetUser) {
      console.log('ensureUserProfile: No user to process');
      return;
    }

    // Prevent redundant syncs if the user ID hasn't changed and we just synced
    if (lastSyncedUserId.current === targetUser.id) {
      return;
    }
    lastSyncedUserId.current = targetUser.id;

    const name = 
      targetUser.user_metadata?.full_name ||
      targetUser.user_metadata?.name ||
      targetUser.user_metadata?.display_name ||
      '';

    console.log('ensureUserProfile: Processing user', {
      id: targetUser.id,
      email: targetUser.email,
      metadata: targetUser.user_metadata,
      extractedName: name
    });

    const extractedPhone = 
      targetUser.user_metadata?.phone_number || 
      targetUser.phone || 
      (targetUser.email?.endsWith('@phone-auth.com') ? targetUser.email.split('@')[0] : null);

    const displayEmail = targetUser.email?.endsWith('@phone-auth.com') ? null : targetUser.email;

    // First, check if profile exists to preserve the role
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', targetUser.id)
      .single();

    const { error } = await supabase.from('profiles').upsert(
      {
        id: targetUser.id,
        email: displayEmail,
        phone: extractedPhone,
        full_name: name,
        role: existingProfile?.role || 'customer',
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.error('Profile upsert error:', error);
    } else {
      console.log('Profile successfully upserted');
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);

        const { data: userData } = await supabase.auth.getUser();
        setUser(userData.user);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (event === 'SIGNED_IN' && currentUser) {
          // Run in background to avoid blocking the main auth flow
          ensureUserProfile(currentUser);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [ensureUserProfile]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAuthCallbackUrl(),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName = '', phone = '') => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getAuthCallbackUrl(),
          data: {
            full_name: fullName,
            phone_number: phone,
          },
        },
      });

      if (error) throw error;
      return { needsEmailVerification: !data.session };
    } catch (error) {
      console.error('Email sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithPhone = async (phone: string, password: string) => {
    try {
      setLoading(true);
      const cleanPhone = phone.replace(/\D/g, '');
      const shadowEmail = `${cleanPhone}@phone-auth.com`;
      
      const { error } = await supabase.auth.signInWithPassword({
        email: shadowEmail,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Phone sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithPhone = async (phone: string, password: string, fullName = '') => {
    try {
      setLoading(true);
      const cleanPhone = phone.replace(/\D/g, '');
      const shadowEmail = `${cleanPhone}@phone-auth.com`;
      
      const { data, error } = await supabase.auth.signUp({
        email: shadowEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            phone_number: phone,
          },
        },
      });

      if (error) throw error;
      return { session: data.session };
    } catch (error) {
      console.error('Phone sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendPhoneOtp = async (phone: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Phone OTP error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOtp = async (phone: string, token: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });

      if (error) throw error;
    } catch (error) {
      console.error('Phone OTP verification error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordForEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getPasswordResetUrl(),
    });

    if (error) throw error;
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const syncCartAfterLogin = useCallback(async (localCart: CartItem[], userId = userRef.current?.id) => {
    if (!userId) {
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id;
    }

    if (!userId) return;

    try {
      for (const item of localCart) {
        // Check if item already exists in database
        const { data: existingItems } = await supabase
          .from('cart_items')
          .select('id, quantity')
          .eq('user_id', userId)
          .eq('product_id', item.productId);

        const existing = existingItems && existingItems.length > 0 ? existingItems[0] : null;

        if (existing) {
          // Update quantity
          await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + item.quantity })
            .eq('id', existing.id);
        } else {
          // Insert new cart item
          await supabase
            .from('cart_items')
            .insert({
              user_id: userId,
              product_id: item.productId,
              quantity: item.quantity,
            });
        }
      }
    } catch (error) {
      console.error('Cart sync error:', error);
      throw error;
    }
  }, []);

  const syncFavoritesAfterLogin = useCallback(async (localFavorites: FavoriteItem[], userId = userRef.current?.id) => {
    if (!userId) {
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id;
    }

    if (!userId) return;

    try {
      for (const item of localFavorites) {
        // Check if already favorited
        const { data: existingItems } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', userId)
          .eq('product_id', item.productId);

        const existing = existingItems && existingItems.length > 0 ? existingItems[0] : null;

        // Only insert if not already favorited
        if (!existing) {
          await supabase
            .from('favorites')
            .insert({
              user_id: userId,
              product_id: item.productId,
            });
        }
      }
    } catch (error) {
      console.error('Favorites sync error:', error);
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signInWithPhone,
      signUpWithPhone,
      sendPhoneOtp,
      verifyPhoneOtp,
      resetPasswordForEmail,
      signOut,
      ensureUserProfile,
      syncCartAfterLogin,
      syncFavoritesAfterLogin,
    }),
    [user, session, loading, ensureUserProfile, syncCartAfterLogin, syncFavoritesAfterLogin]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
