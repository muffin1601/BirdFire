import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const { data: product } = await supabaseServer
    .from('products')
    .select(`
      id,
      name,
      slug,
      short_description,
      description,
      price,
      compare_price,
      stock,
      availability_status,
      rating_average,
      rating_count,
      product_images (
        id,
        image_url,
        is_primary,
        sort_order
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(product)
}
