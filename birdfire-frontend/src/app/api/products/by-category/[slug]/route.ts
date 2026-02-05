import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data: category } = await supabaseServer
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!category) {
    return NextResponse.json([]);
  }

  const { data: products } = await supabaseServer
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      is_new,
      is_featured,
      primary_image_id,
      secondary_image_id,
      product_images (
        id,
        image_url,
        alt_text
      )
    `)
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const result =
    products?.map((p) => {
      const primary = p.product_images?.find(
        (img: any) => img.id === p.primary_image_id
      );

      const secondary = p.product_images?.find(
        (img: any) => img.id === p.secondary_image_id
      );

      return {
        id: p.id,
        handle: p.slug,
        title: p.name,
        price: Number(p.price),
        featured_image: primary?.image_url ?? null,
        secondary_image: secondary?.image_url ?? null,
        badge: p.is_new ? "new" : p.is_featured ? "hot" : undefined,
      };
    }) ?? [];

  return NextResponse.json(result);
}
