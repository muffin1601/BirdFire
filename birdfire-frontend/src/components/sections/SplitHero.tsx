"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SplitHero.module.css";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const data = [
  {
    eyebrow: "TIMELESS ELEGANCE",
    title: "SCANDINAVIAN BEDROOM SIMPLICITY & SERENITY",
    desc: "Create a peaceful retreat with Scandinavian-inspired bedroom furniture. Clean lines, natural textures, and cozy aesthetics bring harmony and warmth to your space.",
    image: "https://nov-minicom.myshopify.com/cdn/shop/files/home2-accordion-1.jpg",
  },
  {
    eyebrow: "NATURALLY CRAFTED",
    title: "WOODEN ARMCHAIRS FOR EVERY CORNER",
    desc: "Bring warmth and character to your space with our beautifully crafted wooden armchairs—perfectly blending comfort, durability, and timeless design.",
    image: "https://nov-minicom.myshopify.com/cdn/shop/files/home2-accordion-2.jpg",
  },
  {
    eyebrow: "PLANT POTS",
    title: "DECORATIVE PLANT POTS FOR MODERN SPACES",
    desc: "Elevate your greenery with our curated plant pots—designed to complement any room with natural charm and contemporary aesthetics.",
    image: "https://nov-minicom.myshopify.com/cdn/shop/files/home2-accordion-3.jpg",
  },
];

export default function SplitHero() {
  const [active, setActive] = useState(1);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const colsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    start();
    return stop;
  }, []);

  const start = () => {
    stop();
    timer.current = setInterval(() => {
      setActive((p) => (p + 1) % data.length);
    }, 4000);
  };

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
  };

  useEffect(() => {
    colsRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        flex: i === active ? 3 : 1,
        duration: 0.9,
        ease: "power3.out",
      });
    });
  }, [active]);

  return (
    <section
      className={styles.hero}
      onMouseEnter={stop}
      onMouseLeave={start}
    >
      <div className={styles.panels}>
        {data.map((item, i) => (
          <div
            key={i}
            ref={(el) => (colsRef.current[i] = el)}
            className={`${styles.panel} ${
              active === i ? styles.active : ""
            }`}
                onClick={() => {
                    setActive(i);
                    start();
                }}
          >
            <img src={item.image} alt={item.title} />

            {active === i && (
              <div className={styles.overlay}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    className={styles.content}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <span className={styles.eyebrow}>
                      {item.eyebrow}
                    </span>

                    <h1>{item.title}</h1>
                    <p>{item.desc}</p>

                    <a href="/shop" className="btn hero-btn">
                      <span>Shop now</span> <i className="zmdi zmdi-long-arrow-right"></i>
                    </a>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

