import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseServer } from '@/lib/supabaseServer'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: { schema: 'public' }
  }
)

export async function POST(req: Request) {
  try {
    console.log('--- CREATE PAYMENT INTENT START ---')

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!stripeKey || !supabaseUrl || !supabaseServiceKey) {
      const missing = [];
      if (!stripeKey) missing.push('STRIPE_SECRET_KEY');
      if (!supabaseUrl) missing.push('SUPABASE_URL');
      if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
      
      console.error('CRITICAL: Missing environment variables:', missing.join(', '));
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: `Missing: ${missing.join(', ')}` 
      }, { status: 500 });
    }

    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      console.error('Unauthorized: No auth header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    const {
      data: { user },
      error: authError
    } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      console.error('Supabase auth error:', authError)
      return NextResponse.json({ error: 'Invalid user session' }, { status: 401 })
    }

    console.log('User identified:', user.id);

    const { data: cartItems, error: cartError } = await supabaseServer
      .from('cart_items')
      .select(`
        quantity,
        product:products (
          id,
          price
        )
      `)
      .eq('user_id', user.id)

    if (cartError) {
      console.error('Cart fetch error:', cartError)
      return NextResponse.json({ error: 'Failed to fetch cart items' }, { status: 500 })
    }

    if (!cartItems || cartItems.length === 0) {
      console.warn('Empty cart for user:', user.id);
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Filter and validate products
    const validItems = cartItems.filter((item: any) => {
      const hasProduct = !!item.product;
      const hasPrice = hasProduct && item.product.price !== null && item.product.price !== undefined;
      return hasPrice;
    });

    if (validItems.length === 0) {
      console.error('No valid products found in cart for user:', user.id);
      return NextResponse.json({ error: 'No valid products in cart' }, { status: 400 })
    }

    const total = validItems.reduce(
      (sum: number, item: any) => {
        const price = Number(item.product.price);
        return sum + (isNaN(price) ? 0 : price) * item.quantity;
      },
      0
    )

    console.log('Calculated total:', total);

    if (total <= 0) {
      return NextResponse.json({ error: 'Invalid order total' }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
      metadata: {
        user_id: user.id,
        user_email: user.email || ''
      }
    })

    console.log('Payment intent created successfully');

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    })
  } catch (error: any) {
    console.error('CRITICAL ERROR in create-payment-intent:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}