"use client";

import Link from 'next/link'
import { useEffect, useRef, useState } from "react";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import styles from "./ProductsSlider.module.css";
import { supabase } from "@/lib/supabaseClient";

const PER_VIEW = 5;

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  primary_image: string | null;
  secondary_image: string | null;
  badge?: "new" | "hot";
};

export default function ProductsSlider() {
  const [products, setProducts] = useState<Product[]>([]);
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      const { data, error } = await supabase
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
            is_primary,
            sort_order
          )
        `)
        .eq("is_featured", true)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Featured products error:", error);
        return;
      }

      const normalized: Product[] =
        data?.map((p) => {
          const primary =
            p.product_images?.find((img: any) => img.id === p.primary_image_id) ??
            p.product_images?.find((img: any) => img.is_primary) ??
            p.product_images
              ?.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))?.[0];

          const secondary =
            p.product_images
              ?.filter((img: any) => img.id !== primary?.id)
              ?.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))?.[0];

          return {
            id: p.id,
            slug: p.slug,
            name: p.name,
            price: Number(p.price),
            primary_image: primary?.image_url ?? null,
            secondary_image: secondary?.image_url ?? null,
            badge: p.is_new ? "new" : p.is_featured ? "hot" : undefined,
          };
        }) ?? [];

      setProducts(normalized);
    }

    fetchFeaturedProducts();
  }, []);

  const maxIndex = Math.max(0, products.length - PER_VIEW);

  const next = () => setIndex((i) => Math.min(i + 1, maxIndex));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  if (!products.length) return null;

  return (
    <section className={styles.wrapper}>
    
      <div className={styles.header}>
        <h2 className={styles.title}>MOST POPULAR PRODUCTS</h2>

        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={prev}>←</button>

          <div className={styles.dots}>
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i === index ? styles.active : ""}`}
              />
            ))}
          </div>

          <button className={styles.navBtn} onClick={next}>→</button>
        </div>
      </div>

      
      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${index * (100 / PER_VIEW)}%)` }}
        >
          {products.map((p) => (
            <div key={p.id} className={styles.slide}>
              <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className={styles.cardLink}
              >
              <div className={styles.card}>
                {/* IMAGE */}
                <div className={styles.imageWrap}>
                  <img
                    src={p.primary_image || "/placeholder.png"}
                    alt={p.name}
                    className={styles.primaryImage}
                  />

                  {p.secondary_image && (
                    <img
                      src={p.secondary_image}
                      alt={`${p.name} alternate`}
                      className={styles.secondaryImage}
                    />
                  )}

                  {/* {p.badge && (
                    <span className={`${styles.badge} ${styles[p.badge]}`}>
                      {p.badge.toUpperCase()}
                    </span>
                  )} */}

                  <div className={styles.hoverIcons}>
                    <button className={styles.iconBtn}>
                      <Heart size={18} />
                    </button>
                    <button className={styles.iconBtn}>
                      <Eye size={18} />
                    </button>
                  </div>

                  <button className={styles.cartBtn}>
                    <ShoppingBag size={18} />
                  </button>
                </div>

                {/* INFO */}
                <div className={styles.stars}>★★★★☆</div>

                <h4 className={styles.productTitle}>{p.name}</h4>
                <span className={styles.price}>
                  ₹{p.price.toFixed(2)}
                </span>
              </div>
              </Link>
            </div>
            
          ))}
        </div>
      </div>
    </section>
  );
}
