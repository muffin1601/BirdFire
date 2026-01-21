"use client"

import Link from "next/link"
import {
  Search,
  User,
  Heart,
  ShoppingBag,
} from "lucide-react"
import "./Header.css"

export default function Header() {
  return (
    <header className="site-header">
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
            <li><Link href="/pages">Pages</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </ul>
        </nav>

        <div className="header-actions">
          <button className="icon-btn" aria-label="Search">
            <Search size={25} strokeWidth={1.8} />
          </button>

          <button className="icon-btn" aria-label="Account">
            <User size={25} strokeWidth={1.8} />
          </button>

          <button className="icon-btn" aria-label="Wishlist">
            <Heart size={25} strokeWidth={1.8} />
          </button>

          <button className="icon-btn cart-btn" aria-label="Cart">
            <ShoppingBag size={22} strokeWidth={1.8} />
            <span className="cart-count">1</span>
          </button>
        </div>

      </div>
    </header>
  )
}
