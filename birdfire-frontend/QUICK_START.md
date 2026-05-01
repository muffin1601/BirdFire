# 🚀 Birdfire Auth System - Quick Start Guide

## ✅ Status: PHASE 3 COMPLETE

Your ecommerce app now has a full authentication system with:
- ✓ Google OAuth login
- ✓ Email/Password authentication  
- ✓ Phone/Password authentication
- ✓ localStorage cart/favorites (before login)
- ✓ Database cart/favorites (after login)
- ✓ Automatic data sync on login
- ✓ Logout functionality

---

## 🎯 IMMEDIATE NEXT STEPS

### 1️⃣ Update Checkout Page
Add this to your checkout component:

```tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import AuthModal from '@/components/AuthModal';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { isOpen, openAuthModal, closeAuthModal } = useAuthModal();

  const handleCheckout = async () => {
    if (!user) {
      openAuthModal(); // Shows login modal
      return;
    }
    // Proceed with payment
  };

  return (
    <div>
      <button onClick={handleCheckout}>Proceed to Payment</button>
      
      <AuthModal 
        isOpen={isOpen} 
        onClose={closeAuthModal}
        onAuthSuccess={() => {
          closeAuthModal();
          // Continue checkout after login
        }}
      />
    </div>
  );
}
```

### 2️⃣ Update Cart Operations
Replace any direct cart functions with the hook:

```tsx
'use client';
import { useCart } from '@/lib/useCart';

export default function ProductCard({ productId }) {
  const { addToCart } = useCart();

  return (
    <button onClick={() => addToCart(productId, 1)}>
      Add to Cart
    </button>
  );
}
```

### 3️⃣ Update Cart Count in Header
```tsx
const { getCartItemCount } = useCart();
const count = getCartItemCount();
```

### 4️⃣ Test the Full Flow
1. **As Guest:**
   - Add product to cart → stored in localStorage
   - Try checkout → AuthModal appears
   - Login with Google/Email/Phone → redirects to callback
   - Cart synced to database
   - Redirected to home

2. **As Logged-in User:**
   - Add product to cart → saved to database
   - Proceed to checkout → no modal, goes straight to payment
   - Logout → redirected to home

---

## 📦 What Was Created

### Contexts
| File | Purpose |
|------|---------|
| `AuthContext.tsx` | User auth state + all login methods |
| `CartContext.tsx` | localStorage cart/favorites management |
| `AuthModalContext.tsx` | Modal visibility state |

### Components
| File | Purpose |
|------|---------|
| `AuthModal.tsx` | Login/signup modal (Google, Email, Phone) |
| `AuthModal.module.css` | Modal styles |

### Hooks
| Hook | Use For |
|------|---------|
| `useAuth()` | Auth state, login/logout |
| `useUser()` | User profile, authentication check |
| `useCart()` | Cart operations (localStorage + DB) |
| `useFavorites()` | Favorites operations (localStorage + DB) |
| `useAuthModal()` | Show/hide modal |

### Updated Pages
| Page | What Changed |
|------|--------------|
| `/login` | Added Google, Email, Phone login/signup |
| `/(auth)/callback` | Enhanced data sync after login |
| `AccountSidebar` | Uses AuthContext logout |

---

## 🔐 Authentication Methods

### Google Login
```tsx
const { signInWithGoogle } = useAuth();
await signInWithGoogle(); // Opens Google consent, redirects to callback
```

### Email Login/Signup
```tsx
const { signInWithEmail, signUpWithEmail } = useAuth();
await signInWithEmail('user@example.com', 'password');
await signUpWithEmail('user@example.com', 'password');
```

### Phone Login/Signup
```tsx
const { signInWithPhone, signUpWithPhone } = useAuth();
// Phone format: any digits (e.g., "1234567890" or "123-456-7890")
await signInWithPhone('1234567890', 'password');
await signUpWithPhone('1234567890', 'password');
```

---

## 🛒 Cart & Favorites Flow

### Before Login (localStorage)
```tsx
const { addToCart, addToFavorites } = useCart();

// These work for guests
await addToCart(productId, qty);
await addToFavorites(productId);
// Data stored in: localStorage["birdfire_cart"]
// Data stored in: localStorage["birdfire_favorites"]
```

### After Login (database)
```tsx
// Same hooks, but now uses database
await addToCart(productId, qty);
// Data saved to: cart_items table
// Data saved to: favorites table
```

### Automatic Sync
When user logs in:
1. `/auth/callback` page receives auth code
2. Fetches localStorage cart & favorites
3. Syncs to database (merges with existing data)
4. Clears localStorage
5. Redirects user to home/checkout

---

## 🧪 Testing Checklist

- [ ] **Guest User Flow**
  - Add item to cart as guest
  - Add to favorites as guest  
  - Click checkout → AuthModal appears
  - Login with Google → redirected to callback
  - Verify cart synced to database
  - Verify favorites synced to database

- [ ] **Email Login**
  - Go to /login
  - Click "Sign up with Email"
  - Create account with email/password
  - Verify redirects to home

- [ ] **Phone Login**
  - Go to /login
  - Click "Sign up with Phone"
  - Create account with phone/password
  - Verify phone stored in user metadata

- [ ] **Returning User**
  - Login with existing email
  - Add to cart
  - Verify saves to database immediately
  - Logout
  - Verify redirects to home

- [ ] **Cart Persistence**
  - Add items as guest
  - Refresh page
  - Verify items still in cart (localStorage working)
  - Login
  - Verify items synced to database
  - Refresh page
  - Verify items still there (database working)

---

## 📚 Key Files to Reference

```
src/
├── contexts/
│   ├── AuthContext.tsx          ← Auth state, login methods
│   ├── CartContext.tsx          ← localStorage management
│   └── AuthModalContext.tsx     ← Modal state
├── components/
│   ├── AuthModal.tsx            ← Login/signup modal
│   └── AuthModal.module.css     ← Modal styles
├── lib/
│   ├── useUser.ts              ← User state hook
│   ├── useCart.ts              ← Cart hook (NEW)
│   ├── useFavorites.ts         ← Favorites hook (UPDATED)
│   └── supabaseClient.ts       ← Supabase config
└── app/
    ├── providers.tsx            ← Context wrapper
    ├── layout.tsx              ← Uses Providers
    ├── (auth)/
    │   ├── login/page.tsx      ← Multi-method login page
    │   └── callback/page.tsx   ← OAuth callback + sync
    └── checkout/page.tsx       ← Need to add AuthModal
```

---

## ⚙️ Configuration Checklist

- [ ] Supabase Google OAuth enabled
- [ ] Google OAuth credentials in `.env.local`
- [ ] Redirect URL set to: `http://localhost:3000/auth/callback`
- [ ] Database has `profiles`, `cart_items`, `favorites` tables
- [ ] RLS policies allow user operations

---

## 🆘 Troubleshooting

**"AuthContext not found"**
→ Make sure layout.tsx imports and uses `<Providers>` wrapper

**"Cart not syncing after login"**
→ Check Supabase RLS policies for cart_items table
→ Verify user_id matches auth user.id

**"Modal not showing at checkout"**
→ Import `useAuthModal` in checkout page
→ Call `openAuthModal()` when user is null

**"Google login not working"**
→ Check Google OAuth credentials in Supabase
→ Verify redirect URL matches exactly

---

## 📞 Need Help?

See `PHASE_3_IMPLEMENTATION_GUIDE.md` for code examples for all use cases.

---

## 🎉 Summary

Your app now has:
- ✅ Complete auth system (3 login methods)
- ✅ Guest cart functionality  
- ✅ Auto-sync on login
- ✅ Logout functionality
- ✅ Reusable hooks for all operations
- ✅ Responsive UI components

**Main Integration Point:** Update checkout page to use AuthModal!
