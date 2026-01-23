"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, User, Heart, ShoppingBag } from "lucide-react"
import "./Header.css"

export const categories = [
  { label: "Dining & Bar Chairs", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/lamp.svg", link: "#" },
  { label: "Tables", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/coffee-table.svg", link: "#" },
  { label: "Lounging", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/potted-plant.svg", link: "#" },
  { label: "Lounge Chairs", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/armchair_beeb15d0-e4cd-4f7f-a928-00873880baed.svg", link: "#" },
  { label: "Beach Chairs", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/armchair_beeb15d0-e4cd-4f7f-a928-00873880baed.svg", link: "#" },
  { label: "Iconics", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/potted-plant.svg", link: "#" },
  { label: "Side Tables", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/coffee-table.svg", link: "#" },
  { label: "Lighting Accessories", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/lamp.svg", link: "#" },
  { label: "Accessories", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/shelf.svg", link: "#" },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120)
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

              <li className="nav-item has-mega">
                <Link href="/collections">Collections</Link>

                <div className="mega-menu">
                  <div className="mega-menu-2">
                  <div className="grid-icons">
                    {categories.map((cat, i) => (
                      <Link key={i} href={cat.link} className="mega-card">
                        <img src={cat.icon} alt={cat.label} />
                        <span>{cat.label}</span>
                      </Link>
                    ))}
                  </div>
                  </div>
                </div>
              </li>

              <li><Link href="/products">Products</Link></li>
              <li><Link href="/pages">About</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>

          <div className="header-actions">
            <button className="icon-btn"><Search size={22} /></button>
            <button className="icon-btn"><User size={22} /></button>
            <button className="icon-btn"><Heart size={22} /></button>
            <button className="icon-btn cart-btn">
              <ShoppingBag size={20} />
              <span className="cart-count">1</span>
            </button>
          </div>
        </div>
      </header>

      <div className="header-spacer" />
    </>
  )
}
