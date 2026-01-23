'use client';

import { useState } from 'react';
import {
  MessageCircle,
  Phone,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import styles from './FAQSection.module.css';

const faqs = [
  {
    question: 'WHAT SHIPPING METHODS DOES BIRDFIRE OFFER?',
    answer:
      'Birdfire partners with premium logistics providers to ensure secure and careful delivery of our luxury furniture. Shipping methods vary based on product type, size, and destination to guarantee the highest level of protection.',
  },
  {
    question: 'HOW LONG WILL DELIVERY TAKE?',
    answer:
      'Orders are typically processed within 1–2 business days. Delivery timelines depend on your location and the nature of the product, with most Birdfire orders arriving within 7–14 business days.',
  },
  {
    question: 'WHERE ARE BIRDFIRE PRODUCTS SHIPPED FROM?',
    answer:
      'All Birdfire pieces are shipped from our curated warehouses and trusted manufacturing partners, ensuring consistent quality, craftsmanship, and safe handling.',
  },
  {
    question: "WHY CAN’T I ACCESS MY BIRDFIRE ACCOUNT?",
    answer:
      'Please confirm that your login details are correct. If you’ve forgotten your password, use the “Forgot Password” option to reset it, or contact Birdfire Customer Care for personalized assistance.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        {/* LEFT */}
        <div className={styles.left}>
          <h2 className={styles.heading}>FREQUENTLY ASKED QUESTIONS</h2>

          <p className={styles.description}>
            Explore our Frequently Asked Questions to find helpful answers and
            solutions to common inquiries. We've gathered the information you
            need to assist you quickly and efficiently.
          </p>

          <div className={styles.actions}>
            <div className={styles.actionItem}>
              <MessageCircle size={18} />
              <span>VIEW ALL FAQS</span>
            </div>

            <div className={styles.actionItem}>
              <Phone size={18} />
              <span>CONTACT US</span>
            </div>

            <div className={styles.actionItem}>
              <MapPin size={18} />
              <span>STORE LOCATIONS</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          {faqs.map((item, i) => (
            <div
              key={i}
              className={`${styles.faqItem} ${
                open === i ? styles.active : ''
              }`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className={styles.question}>
                <span>{item.question}</span>
                <ChevronDown
                  className={styles.icon}
                  size={18}
                />
              </div>

              <div className={styles.answer}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
