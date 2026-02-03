"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./CategoryMarquee.module.css";
import { supabase } from "@/lib/supabaseClient";

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  image_alt: string | null;
}

export default function CategoryMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, image_url, image_alt")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Supabase error:", error);
      }

      if (data) setCategories(data);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  if (loading || !categories.length) return null;

  const scroll = (direction: number) => {
    trackRef.current?.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.marqueeSection}>
      <div className={styles.marqueeHeader}>
        <h2 className={styles.sectionTitle}>SHOP BY CATEGORY</h2>

        <div className={styles.navButtons}>
          <button className={styles.navBtn} onClick={() => scroll(-1)}>
            <ArrowLeft size={24} />
          </button>
          <button className={`${styles.navBtn} ${styles.active}`} onClick={() => scroll(1)}>
            <ArrowRight size={24} />
          </button>
        </div>
      </div>

      <div ref={trackRef} className={styles.marqueeViewport}>
        <div className={styles.marqueeTrack}>
          {[...categories, ...categories].map((cat, index) => (
            <div key={`${cat.id}-${index}`} className={styles.categoryCard}>
              <div className={styles.cardImage}>
                <img src={cat.image_url} alt={cat.image_alt || cat.name} />
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.cardTitle}>{cat.name}</span>

                <Link
                  href={`/category/products/${cat.slug}`}
                  className={styles.arrowButton}
                >
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
