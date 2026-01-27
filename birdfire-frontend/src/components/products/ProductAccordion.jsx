"use client";

import { useState } from "react";
// import { ChevronDown } from "lucide-react";
import styles from "./ProductAccordion.module.css";

const accordionData = [
  {
    title: "Description",
    content: (
      <ul>
        <li>Designed for refined outdoor living, Birdfire furniture blends modern aesthetics with enduring comfort.</li>
        <li>Crafted using premium weather-resistant materials suited for patios, terraces, gardens, and poolside spaces.</li>
        <li>Minimalist silhouettes inspired by contemporary European outdoor design.</li>
        <li>Engineered for long-lasting performance in both residential and commercial environments.</li>
        <li>Perfect balance of form, function, and outdoor luxury.</li>
      </ul>
    )
  },
  {
    title: "Delivery policy",
    content:
      "Birdfire products are carefully packed and shipped to ensure they arrive in perfect condition. Delivery timelines vary by location and product availability. Our team will coordinate with you post-purchase to confirm delivery schedules and access requirements."
  },
  {
    title: "Shipping & Return",
    content:
      "We offer nationwide shipping through trusted logistics partners. Returns are accepted only in cases of manufacturing defects or transit damage, reported within 48 hours of delivery. As our products are crafted to order, general returns are not applicable."
  },
  {
    title: "Custom Tab",
    content:
      "Looking for bespoke outdoor solutions? Birdfire offers customization options for select collections, including finishes, fabrics, and configurations. Contact our team to create outdoor furniture tailored to your space."
  }
];


export default function ProductAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className={styles.accordion}>
      {/* TAB HEADERS ROW */}
      <div className={styles.tabs}>
        {accordionData.map((item, index) => (
          <button
            key={index}
            className={`${styles.tab} ${
              openIndex === index ? styles.active : ""
            }`}
            onClick={() => setOpenIndex(index)}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        {accordionData[openIndex].content}
      </div>
    </div>
  );
}

