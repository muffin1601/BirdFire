"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SplitHero.module.css";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const data = [
  {
    eyebrow: "TIMELESS ELEGANCE",
    title: "SCANDINAVIAN BEDROOM SIMPLICITY & SERENITY",
    desc: "Create a peaceful retreat with Scandinavian-inspired bedroom furniture.",
    image: "https://nov-minicom.myshopify.com/cdn/shop/files/home2-accordion-1.jpg",
  },
  {
    eyebrow: "NATURALLY CRAFTED",
    title: "WOODEN ARMCHAIRS FOR EVERY CORNER",
    desc: "Bring warmth and character to your space.",
    image: "https://nov-minicom.myshopify.com/cdn/shop/files/home2-accordion-2.jpg",
  },
  {
    eyebrow: "PLANT POTS",
    title: "DECORATIVE PLANT POTS FOR MODERN SPACES",
    desc: "Elevate your greenery with curated plant pots.",
    image: "https://nov-minicom.myshopify.com/cdn/shop/files/home2-accordion-3.jpg",
  },
];

export default function SplitHero() {
  const [active, setActive] = useState(1);

  //  browser-safe timer type
  const timerRef = useRef<number | null>(null);

  //  stable refs
  const colsRef = useRef<HTMLDivElement[]>([]);

  const start = () => {
    stop();
    timerRef.current = window.setInterval(() => {
      setActive((p) => (p + 1) % data.length);
    }, 4000);
  };

  const stop = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    start();
    return stop;
  }, []);

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
            ref={(el) => {
              if (el) colsRef.current[i] = el;
            }}
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
                      Shop now →
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
