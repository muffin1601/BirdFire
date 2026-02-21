import { supabase } from '@/lib/supabaseClient'

export async function addToCart(productId: string, qty = 1) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    window.location.href = '/login'
    return
  }

  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single()

  if (existing) {
    await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + qty })
      .eq('id', existing.id)
  } else {
    await supabase
      .from('cart_items')
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity: qty,
      })
  }
}