"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, User, Heart, ShoppingBag } from "lucide-react"
import "./Header.css"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 120)
    }

    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-inner">
          <div className="header-logo">
            <Link href="/">
              <img src="/LOGO.svg" alt="Birdfire" />
            </Link>
          </div>

          <nav className="header-nav">
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/collections">Collections</Link></li>
              <li><Link href="/products">Products</Link></li>
              <li><Link href="/pages">About</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>

          <div className="header-actions">
            <button className="icon-btn"><Search size={25} /></button>
            <button className="icon-btn"><User size={25} /></button>
            <button className="icon-btn"><Heart size={25} /></button>
            <button className="icon-btn cart-btn">
              <ShoppingBag size={22} />
              <span className="cart-count">1</span>
            </button>
          </div>
        </div>
      </header>

      {/* spacer to prevent jump */}
      <div className="header-spacer" />
    </>
  )
}
