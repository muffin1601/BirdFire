/**
 * PHASE 3 IMPLEMENTATION GUIDE
 * Complete Auth System with Multiple Login Methods
 * 
 * This file documents how to use the new auth system in your components
 */

// ============================================
// 1. PROTECTING CHECKOUT WITH AUTH MODAL
// ============================================

// In your checkout page component:
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useCart } from '@/lib/useCart';
import AuthModal from '@/components/AuthModal';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { isOpen, openAuthModal, closeAuthModal } = useAuthModal();
  const { cart } = useCart();

  const handleCheckout = async () => {
    if (!user) {
      openAuthModal(); // Show login modal
      return;
    }

    // Proceed with checkout
    console.log('User authenticated, proceeding with checkout');
  };

  return (
    <div>
      {/* Your checkout form */}
      <button onClick={handleCheckout}>Proceed to Payment</button>

      {/* Auth Modal - shows when needed */}
      <AuthModal 
        isOpen={isOpen} 
        onClose={closeAuthModal}
        onAuthSuccess={() => {
          closeAuthModal();
          // Handle post-login logic
          handleCheckout();
        }}
      />
    </div>
  );
}

// ============================================
// 2. ADDING TO CART (Works without login)
// ============================================

'use client';

import { useCart } from '@/lib/useCart';
import { useAuth } from '@/contexts/AuthContext';

export default function ProductCard({ productId }: { productId: string }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    // Works for both logged-in and non-logged-in users
    // Stores in localStorage if not logged in
    // Stores in database if logged in
    await addToCart(productId, 1);
    alert('Added to cart!');
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}

// ============================================
// 3. FAVORITES (Works without login)
// ============================================

'use client';

import { useFavorites } from '@/lib/useFavorites';
import { Heart } from 'lucide-react';

export default function FavoriteButton({ productId }: { productId: string }) {
  const { isFavorite, toggle, loading } = useFavorites(productId);

  return (
    <button 
      onClick={toggle} 
      disabled={loading}
      className={isFavorite ? 'active' : ''}
    >
      <Heart fill={isFavorite ? 'red' : 'none'} />
    </button>
  );
}

// ============================================
// 4. CHECKING USER AUTHENTICATION STATUS
// ============================================

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/lib/useUser';

export default function UserProfile() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUser();

  if (authLoading || profileLoading) return <div>Loading...</div>;

  if (!user) {
    return <div>Please login to view profile</div>;
  }

  return (
    <div>
      <p>Welcome, {profile?.full_name || user.email}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}

// ============================================
// 5. LOGGING OUT
// ============================================

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}

// ============================================
// 6. USING AUTH HOOKS
// ============================================

// 6.1 Google Login
const { signInWithGoogle } = useAuth();
await signInWithGoogle(); // Redirects to Google, then to callback page

// 6.2 Email Login
const { signInWithEmail } = useAuth();
await signInWithEmail('user@example.com', 'password123');

// 6.3 Email Signup
const { signUpWithEmail } = useAuth();
await signUpWithEmail('user@example.com', 'password123');

// 6.4 Phone Login
const { signInWithPhone } = useAuth();
await signInWithPhone('1234567890', 'password123');

// 6.5 Phone Signup
const { signUpWithPhone } = useAuth();
await signUpWithPhone('1234567890', 'password123');

// ============================================
// 7. CART OPERATIONS
// ============================================

const { 
  cart,
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  getCartItemCount,
  getCartTotalAmount,
  isAuthenticated 
} = useCart();

// Add to cart
await addToCart(productId, 2); // quantity 2

// Update quantity
await updateQuantity(productId, 5);

// Remove from cart
await removeFromCart(productId);

// Clear entire cart
await clearCart();

// Get cart count
const itemCount = getCartItemCount();

// Get total price
const total = getCartTotalAmount();

// ============================================
// 8. FAVORITE OPERATIONS
// ============================================

const { isFavorite, toggle, loading } = useFavorites(productId);

// Check if favorited
if (isFavorite) {
  console.log('This product is in favorites');
}

// Toggle favorite
await toggle(); // Adds or removes from favorites

// ============================================
// 9. DATA SYNC AFTER LOGIN
// ============================================

// Automatic:
// When user logs in via callback page:
// 1. User data saved to profiles table
// 2. localStorage cart synced to cart_items table
// 3. localStorage favorites synced to favorites table
// 4. localStorage cleared
// 5. User redirected to home

// ============================================
// 10. AUTH STATE IN COMPONENTS
// ============================================

export default function Header() {
  const { user } = useAuth();

  return (
    <header>
      {user ? (
        <p>Logged in as: {user.email}</p>
      ) : (
        <p>Not logged in</p>
      )}
    </header>
  );
}

// ============================================
// FLOW SUMMARY
// ============================================

/*
GUEST USER FLOW:
1. User adds products to cart → stored in localStorage
2. User adds to favorites → stored in localStorage
3. User proceeds to checkout
4. Modal opens asking for login
5. User logs in (Google/Email/Phone)
6. Redirected to callback page
7. Cart & favorites synced to database
8. User redirected to home/checkout
9. All subsequent actions use database

RETURNING USER FLOW:
1. User clicks "Add to Cart"
2. Cart saves to database (via useCart hook)
3. User clicks "Add to Favorites"
4. Favorites saves to database (via useFavorites hook)
5. User proceeds to checkout
6. No modal shown (already authenticated)
7. Checkout completes normally
*/
