'use client'

import { Facebook, Instagram, Twitter, Music } from 'lucide-react'
import styles from './ContactSection.module.css'

export default function ContactSection() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.grid}>
        {/* LEFT FORM */}
        <div className={styles.formWrap}>
          <h2 className={styles.title}>Get In Touch</h2>
          <p className={styles.subtitle}>
            Please enter the details of your request. A member of our support staff
            will respond as soon as possible.
          </p>

          <form className={styles.form}>
            <div className={styles.row}>
              <input placeholder="Your Name" />
              <input placeholder="Your Email" />
            </div>

            <input placeholder="Phone Number" />

            <textarea placeholder="Your Message" rows={6} />

            <button type="submit" className={styles.btnSubmit}>
              <span>Submit Now</span>
            </button>
          </form>
        </div>


        <div className={styles.info}>
          <p>
            <strong>Address:</strong> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore non voluptas cupiditate placeat labore accusamus dicta cumque harum perspiciatis iusto culpa natus quasi, voluptates adipisci atque mollitia velit deleniti ipsam!
          </p>
          <p>New Delhi, India</p>

          <p>
            <strong>Email:</strong> support@birdfire.com
          </p>

          <p>
            <strong>Call Us:</strong> (012)-345-67890
          </p>

          <p>
            <strong>Opening time:</strong> Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, natus! Libero repellendus illum ipsum, et quo, voluptatem deleniti dolorem soluta autem non est dolores placeat vero perferendis eum alias omnis.,
             <strong>11am to 7pm</strong>
          </p>

          <div className={styles.socials}>
            <a><Facebook size={16} /></a>
            <a><Instagram size={16} /></a>
            <a><Twitter size={16} /></a>
            <a><Music size={16} /></a>
          </div>
        </div>
      </div>
    </section>
  )
}
