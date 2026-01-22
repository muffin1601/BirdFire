"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SplitHero.module.css";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const data = [
  {
    eyebrow: "TIMELESS ELEGANCE",
    title: "SCANDINAVIAN BEDROOM SIMPLICITY & SERENITY",
    desc:
      "Create a peaceful retreat with Scandinavian-inspired bedroom furniture. Clean lines, natural textures, and cozy aesthetics bring harmony and warmth to your space.",
    image:
      "https://nov-minicom.myshopify.com/cdn/shop/files/home2-accordion-1.jpg",
  },
  {
    eyebrow: "NATURALLY CRAFTED",
    title: "WOODEN ARMCHAIRS FOR EVERY CORNER",
    desc:
      "Bring warmth and character to your space with our beautifully crafted wooden armchairs—perfectly blending comfort, durability, and timeless design.",
    image:
      "https://nov-minicom.myshopify.com/cdn/shop/files/home2-accordion-2.jpg",
  },
  {
    eyebrow: "PLANT POTS",
    title: "DECORATIVE PLANT POTS FOR MODERN SPACES",
    desc:
      "Elevate your greenery with our curated plant pots—designed to complement any room with natural charm and contemporary aesthetics.",
    image:
      "https://nov-minicom.myshopify.com/cdn/shop/files/home2-accordion-3.jpg",
  },
];


export default function SplitHero() {
  const [active, setActive] = useState(1);

  //  stable refs
  const panelsRef = useRef<HTMLDivElement[]>([]);
  const startX = useRef(0);

  /* Auto play */
  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((p) => (p + 1) % data.length);
    }, 5000);

    return () => clearInterval(id);
  }, []);

  /* Accordion animation */
  useEffect(() => {
    panelsRef.current.forEach((el, i) => {
      if (!el) return;

      gsap.to(el, {
        flex: i === active ? 3 : 1,
        duration: 1.2,
        ease: "power3.out",
      });
    });
  }, [active]);

  /* Swipe support */
  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const diff = startX.current - e.clientX;
    if (Math.abs(diff) > 60) {
      setActive((p) =>
        diff > 0
          ? (p + 1) % data.length
          : (p - 1 + data.length) % data.length
      );
    }
  };

  return (
    <section className={styles.hero}>
      {/* LEFT CONTENT */}
      <div className={styles.left}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className={styles.text}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.eyebrow}>
              {data[active].eyebrow}
            </span>
            <h1>{data[active].title}</h1>
            <p>{data[active].desc}</p>

             <a href="/shop" className="btn hero-btn">
                            <span>Shop now</span>
                            <i className="zmdi zmdi-long-arrow-right"></i>
                        </a>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* RIGHT ACCORDION */}
      <div
        className={styles.panels}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {data.map((item, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) panelsRef.current[i] = el;
            }}
            className={`${styles.panel} ${
              active === i ? styles.active : ""
            }`}
            onClick={() => setActive(i)}
          >
            <img src={item.image} alt={item.title} />
          </div>
        ))}
      </div>
    </section>
  );
}
