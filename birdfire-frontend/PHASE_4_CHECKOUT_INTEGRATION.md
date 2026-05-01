# Phase 4: Checkout Integration with Auth Modal

## Overview

Phase 4 completes the authentication and checkout integration, enabling a seamless guest-to-login flow and full checkout protection. Users can now browse and add items as guests, then authenticate during checkout with automatic cart synchronization.

---

## 🎯 What's New

### ✅ Checkout Page Enhancement
- **Smart Cart Loading**: Loads cart from localStorage for guests, from Supabase for logged-in users
- **Auth Modal Trigger**: Shows authentication modal instead of redirecting
- **Error Handling**: Graceful handling of empty carts and checkout errors
- **Guest Checkout Support**: Full product details loaded for guest carts
- **Responsive States**: Loading, error, and authentication states

### ✅ Checkout Form Improvements
- **Auth Prompts**: Clear messaging for guests
- **Disabled Payment**: Button disabled until user is authenticated
- **Processing State**: Visual feedback during payment processing
- **Error Display**: Inline error messages for failed operations
- **Price Display**: Shows total dynamically

### ✅ Header Cart Count
- **Dual Source**: Shows guest cart (localStorage) or user cart (Supabase)
- **Real-time Updates**: Updates when items are added/removed
- **User Context**: Switches between guest and user cart automatically on login

### ✅ Auth Modal Global Access
- **Checkout Integration**: AuthModal displayed on checkout page
- **Accessible Anywhere**: Can be triggered from any component via `useAuthModal()` hook

---

## 🔄 User Flows

### Flow 1: Guest Checkout
```
1. User browses products
2. Adds items to cart (stored in localStorage)
3. Cart count appears in header
4. Clicks "Proceed to Checkout"
5. Sees cart summary with guest items
6. Prompted to sign in
7. Opens AuthModal (can use any auth method)
8. Successfully logs in
9. Cart syncs to Supabase via syncCartAfterLogin()
10. Can proceed to payment
```

### Flow 2: Logged-in Checkout
```
1. User logged in (user context available)
2. Adds items to cart (automatically synced to Supabase)
3. Clicks checkout
4. Cart loads from Supabase
5. Payment intent created with user auth
6. Can proceed directly to payment
7. Completes Stripe payment
8. Redirected to success page
```

### Flow 3: Authentication During Checkout
```
1. Guest attempts checkout
2. AuthModal opens automatically
3. Can choose:
   - Google OAuth login/signup
   - Email/password login
   - Email/password signup
   - Phone/password login
   - Phone/password signup
4. Successfully authenticates
5. Cart automatically syncs
6. Modal closes automatically
7. Payment form ready
```

---

## 📁 Updated Files

### 1. **src/app/checkout/page.tsx**
Complete rewrite with:
- AuthContext integration (`useAuth`)
- AuthModalContext integration (`useAuthModal`)
- CartContext integration (`useCart`)
- Guest cart loading from localStorage
- User cart loading from Supabase
- Error handling for empty carts
- Loading states and error messages
- AuthModal display for guest users

**Key Features:**
```tsx
- Handles both authenticated and guest users
- Loads appropriate cart data based on user state
- Creates payment intents with or without auth
- Shows auth prompts to guests
- Syncs cart after login
```

### 2. **src/app/checkout/CheckoutForm.tsx**
Enhanced with:
- User prop to track authentication state
- useAuthModal hook for modal control
- Processing state with loading indicator
- Error display and handling
- Auth prompts in the form
- Disabled payment button when not authenticated
- Clear messaging about login requirement

**Key Features:**
```tsx
- Visual feedback during payment processing
- Prevents payment without authentication
- Shows helpful prompts for guests
- Handles payment errors gracefully
- Dynamic price calculation
```

### 3. **src/app/checkout/Checkout.module.css**
New styles for:
- Loading states (`.loadingMessage`)
- Error containers (`.errorContainer`, `.errorAlert`)
- Auth prompts (`.authPrompt`, `.authPromptContainer`, `.btnAuthPrompt`)
- Processing states (`.spinner`)
- Primary and secondary buttons
- Guest text with links
- Auth notes and messages
- Empty cart state (`.emptyCart`)
- Responsive design

**Key Styles:**
```css
- Error alert with red left border
- Spinner animation for processing
- Auth prompt background styling
- Primary button with gradient animation
- Secondary button for navigation
```

### 4. **src/components/layout/Header.tsx**
Updated to:
- Use AuthContext for user state
- Use CartContext for guest cart count
- Load cart count based on authentication
- Listen for Supabase changes for logged-in users
- Show localStorage cart for guests
- Auto-update cart display

**Key Features:**
```tsx
- Shows correct cart count for guests and users
- Real-time updates from Supabase (logged-in)
- Responsive cart badge display
- Switches seamlessly on login/logout
```

---

## 🚀 How to Use

### Using Auth Modal in Components

```tsx
import { useAuthModal } from '@/contexts/AuthModalContext';

export function MyComponent() {
  const { isOpen, openAuthModal, closeAuthModal } = useAuthModal();
  
  const handleRequireAuth = () => {
    openAuthModal(); // Shows the modal
  };
  
  return (
    <>
      <button onClick={handleRequireAuth}>Login</button>
      <AuthModal isOpen={isOpen} onClose={closeAuthModal} />
    </>
  );
}
```

### Getting Cart Count

```tsx
import { useCart } from '@/lib/useCart';

export function CartBadge() {
  const { getCartCount } = useCart();
  
  const count = getCartCount();
  
  return <span className="badge">{count}</span>;
}
```

### Using Auth Context

```tsx
import { useAuth } from '@/contexts/AuthContext';

export function AccountMenu() {
  const { user, signOut, syncCartAfterLogin } = useAuth();
  
  if (!user) {
    return <p>Not logged in</p>;
  }
  
  return (
    <>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Logout</button>
    </>
  );
}
```

---

## 🔧 Configuration

### Environment Variables Required

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Supabase Setup

Ensure these tables exist:
- `cart_items` - Stores user cart items
- `products` - Product information
- `product_images` - Product images

---

## 🧪 Testing Checklist

### Guest Checkout Flow
- [ ] Add items as guest (check localStorage)
- [ ] Cart count appears in header
- [ ] Click checkout → AuthModal appears
- [ ] Login with any auth method
- [ ] Cart syncs to Supabase
- [ ] Payment form is ready
- [ ] Can see cart items from Supabase

### Logged-in Checkout Flow
- [ ] Login first
- [ ] Add items to cart
- [ ] Items appear in Supabase
- [ ] Click checkout
- [ ] Cart loads from Supabase
- [ ] Can proceed to payment
- [ ] Items display correctly

### Error Handling
- [ ] Empty cart shows error
- [ ] Network errors handled gracefully
- [ ] Payment errors displayed
- [ ] Invalid products handled

### Cart Sync
- [ ] Guest cart persists in localStorage
- [ ] Login syncs all items to Supabase
- [ ] No duplicate items after sync
- [ ] Quantities preserved

### Header Display
- [ ] Guest cart count shows in header
- [ ] Updates when items added/removed
- [ ] User cart count shows when logged in
- [ ] Real-time updates for user cart
- [ ] Cart icon links to /cart

---

## 🔐 Security Features

### Protected Checkout
- Payment disabled until authenticated
- Authorization headers sent with payment requests
- User ID validated on backend

### Cart Synchronization
- Guest cart validated before sync
- Supabase RLS ensures user isolation
- Unauthorized access prevented

### Payment Processing
- Stripe client secret required
- User authentication checked
- Payment intent tied to user session

---

## 🐛 Troubleshooting

### Cart Count Not Updating
**Issue**: Guest cart count doesn't update when items added
**Solution**: Ensure CartContext is wrapping your app in providers.tsx and useCart() is called

### AuthModal Not Appearing
**Issue**: Modal doesn't show when trying to login
**Solution**: Ensure AuthModalContext is provided and AuthModal component is rendered on the page

### Cart Not Syncing
**Issue**: Guest cart not syncing to Supabase after login
**Solution**: Check that syncCartAfterLogin() is called in AuthContext after successful login

### Payment Intent Creation Fails
**Issue**: Error creating payment intent
**Solution**: Verify NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local and backend has working /api/create-payment-intent

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│          Guest User Checkout Flow                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Browse Products                                 │
│     ↓                                               │
│  2. Add to Cart → localStorage (CartContext)        │
│     ↓                                               │
│  3. Header shows count (getCartCount)               │
│     ↓                                               │
│  4. Click Checkout                                  │
│     ↓                                               │
│  5. Load from localStorage & Supabase (products)    │
│     ↓                                               │
│  6. Show AuthModal prompt                           │
│     ↓                                               │
│  7. User authenticates                              │
│     ↓                                               │
│  8. syncCartAfterLogin() transfers to Supabase      │
│     ↓                                               │
│  9. Create payment intent (with user auth)          │
│     ↓                                               │
│  10. Proceed to payment                             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📝 Next Steps

### Phase 5: Polish & Testing
- [ ] E2E tests for checkout flow
- [ ] Payment success handling
- [ ] Email confirmation
- [ ] Order history display

### Phase 6: Advanced Features
- [ ] Coupon/discount codes
- [ ] Saved payment methods
- [ ] Order tracking
- [ ] Wishlist → Cart

---

## 💡 Tips & Best Practices

### Best Practice: Always Check User State
```tsx
const { user, loading } = useAuth();

if (loading) return <LoadingSpinner />;
if (!user) return <AuthPrompt />;
// User authenticated - proceed
```

### Best Practice: Handle Cart Errors
```tsx
try {
  const cartItems = getLocalCart();
  if (cartItems.length === 0) {
    setError('Cart is empty');
    return;
  }
  // Process checkout
} catch (error) {
  console.error('Cart error:', error);
  setError('Failed to load cart');
}
```

### Best Practice: Show Loading States
```tsx
const [loading, setLoading] = useState(false);

const handlePayment = async () => {
  setLoading(true);
  try {
    // Process payment
  } finally {
    setLoading(false);
  }
};
```

---

## 🎓 Key Concepts

### Cart Duality
- **Guest Cart**: Stored in browser localStorage
- **User Cart**: Stored in Supabase database
- **Sync Point**: Happens during login via `syncCartAfterLogin()`

### Auth Modal Context
- Global state for modal visibility
- Can be triggered from any component
- Automatically closes on successful auth

### Payment Intent
- Created by backend `/api/create-payment-intent`
- Required before Stripe payment
- Can be created with or without user auth

---

## 📞 Support

For issues or questions about Phase 4 integration:

1. Check the troubleshooting section above
2. Review the data flow diagram
3. Ensure all files are updated correctly
4. Check browser console for errors
5. Verify environment variables are set

---

## ✅ Completion

Phase 4 is complete when:
- ✅ Checkout page loads cart correctly for guests and users
- ✅ AuthModal appears and works for guests
- ✅ Cart syncs to Supabase on login
- ✅ Header shows correct cart count
- ✅ Payment form is protected and shows auth prompts
- ✅ All error states handled gracefully
- ✅ Full flow tested end-to-end

**Status**: 🟢 Phase 4 Ready for Testing
