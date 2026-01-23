'use client';

import { useState, useEffect } from 'react';
import styles from './Footer.module.css';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ArrowUp,
} from 'lucide-react';

export default function Footer() {
    const [showScroll, setShowScroll] = useState(false);


  useEffect(() => {
    const onScroll = () => {
      setShowScroll(window.scrollY > 200); // show after 200px scroll
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  return (
    <footer className={styles.footer}>
      {/* TOP */}
      <div className={styles.top}>
        {/* LEFT IMAGE AREA */}
        <div className={styles.left}>
          <div className={styles.brand}>
                      <img
                          src="/LOGO-W.png"
                          alt="BirdFire Logo"
                          className={styles.logo}
                      />
                  </div>

          <p className={styles.desc}>
            At BirdFire, we redefine modern interiors with furniture that blends bold design, premium comfort, and lasting quality. Our curated collections are crafted to complement contemporary lifestyles with style and purpose.
          </p>

          <div className={styles.socials}>
            <a><Facebook size={18} /></a>
            <a><Instagram size={18} /></a>
            <a><Twitter size={18} /></a>
            <a><Youtube size={18} /></a>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className={styles.right}>
          {/* NEWSLETTER */}
          <div className={styles.newsletter}>
            <h4>SUBSCRIBE NEWSLETTER</h4>
            <p>STAY UPDATED WITH THE LATEST TRENDS</p>

            <div className={styles.subscribe}>
              <input type="email" placeholder="ENTER YOUR EMAIL" />
              <button>SUBMIT</button>
            </div>
          </div>

          {/* LINKS */}
          <div className={styles.links}>
            <div>
              <h5>CUSTOMER CARE</h5>
              <a>FAQs</a>
              <a>Terms of Service</a>
              <a>Privacy Policy</a>
              <a>Contact Us</a>
              <a>Gift Card</a>
            </div>

            <div>
              <h5>HELP & SUPPORT</h5>
              <a>Shipping Info</a>
              <a>Returns</a>
              <a>How To Order</a>
              <a>How To Track</a>
              <a>Size Guide</a>
            </div>

            <div>
              <h5>COMPANY INFO</h5>
              <a>About Us</a>
              <a>Our Blog</a>
              <a>Careers</a>
              <a>Store Locations</a>
              <a>Testimonial</a>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className={styles.bottom}>
        <p>© 2026 BIRDFIRE. ALL RIGHTS RESERVED.</p>

        {/* <div className={styles.payments}>
          <img src="/paypal.png" />
          <img src="/mastercard.png" />
          <img src="/applepay.png" />
          <img src="/visa.png" />
          <img src="/amex.png" />
        </div> */}
      </div>

      {/* SCROLL TOP */}
      <button
        className={`${styles.scrollTop} ${
          showScroll ? styles.visible : ''
        }`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
}
