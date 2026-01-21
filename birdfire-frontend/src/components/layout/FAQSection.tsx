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
    question: 'WHAT SHIPPING METHODS ARE AVAILABLE?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pharetra cursus eleifend. Maecenas sit amet libero nibh. Donec blandit arcu pharetra, venenatis mi quis, maximus lacus.',
  },
  {
    question: 'HOW LONG WILL IT TAKE TO GET MY PACKAGE?',
    answer:
      'Orders are usually processed within 1–2 business days. Delivery time depends on your location and chosen shipping method.',
  },
  {
    question: 'WHERE ARE YOUR PRODUCTS SENT FROM?',
    answer:
      'All products are shipped from our central warehouse and partner fulfillment centers.',
  },
  {
    question: "WHY CAN'T I LOG INTO MY ACCOUNT?",
    answer:
      'Please ensure your credentials are correct or reset your password using the forgot password option.',
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
