import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabaseServer
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      compare_price,
      is_new,
      is_featured,
      availability_status,
      primary_image_id,
      secondary_image_id,
      product_images (
        id,
        image_url,
        alt_text,
        is_primary,
        sort_order
      )
    `)
    .eq("is_active", true)
    .ilike("name", `%${q}%`)
    .order("created_at", { ascending: false })
    .limit(24);

  if (error || !data) {
    return NextResponse.json([]);
  }

  return NextResponse.json(data);
}
