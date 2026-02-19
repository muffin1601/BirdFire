"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SplitHero.module.css";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const data = [
  {
    eyebrow: "AMBIENT LIGHTING",
    title: "DESIGNER LIGHTING ACCESSORIES FOR ELEGANT SPACES",
    desc:
      "Enhance your interiors with our curated lighting accessories—crafted to create warm ambience, highlight architectural details, and elevate modern living spaces.",
    image:
      "https://www.gandiablasco.com/wp-content/uploads/2025/10/aria-collection-grid-1.jpg",
  },
  {
    eyebrow: "RELAXED LUXURY",
    title: "LOUNGE CHAIRS DESIGNED FOR COMFORT & STYLE",
    desc:
      "Discover beautifully designed lounge chairs that blend ergonomic comfort with refined aesthetics—perfect for living rooms, patios, and statement corners.",
    image:
      "https://www.gandiablasco.com/wp-content/uploads/2023/04/lademadera-collection-grid.jpg",
  },
  {
    eyebrow: "DECOR ACCENTS",
    title: "DECORATIVE PLANT POTS FOR MODERN INTERIORS",
    desc:
      "Add a touch of nature to your space with decorative plant pots—thoughtfully designed to complement contemporary interiors and outdoor settings.",
    image:
      "https://www.ethimo.com/assets/images/collections/xSEEDS_800X600.png.pagespeed.ic.aqW4vQix1Z.webp",
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
