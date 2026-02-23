"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, User, Heart, ShoppingBag, X } from "lucide-react"
import AccountSidebar from "./AccountSidebar"
import "./Header.css"
import { supabase } from '@/lib/supabaseClient'

export const categories = [
  { label: "Dining & Bar Chairs", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/lamp.svg", link: "/category/products/dining-and-bar-chairs" },
  { label: "Tables", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/coffee-table.svg", link: "/category/products/tables" },
  { label: "Lounging", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/potted-plant.svg", link: "/category/products/lounging" },
  { label: "Lounge Chairs", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/armchair_beeb15d0-e4cd-4f7f-a928-00873880baed.svg", link: "/category/products/lounge-chairs" },
  { label: "Beach Chairs", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/armchair_beeb15d0-e4cd-4f7f-a928-00873880baed.svg", link: "/category/products/beach-chairs" },
  { label: "Iconics", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/potted-plant.svg", link: "/category/products/iconics" },
  { label: "Side Tables", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/coffee-table.svg", link: "/category/products/side-tables" },
  { label: "Lighting Accessories", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/lamp.svg", link: "/category/products/lighting-accessories" },
  { label: "Accessories", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/shelf.svg", link: "/category/products/accessories" },
]


export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const loadCartCount = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setCartCount(0)
        return
      }

      const { data } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id)

      const count =
        data?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

      setCartCount(count)
    }

    loadCartCount()

    const channel = supabase
      .channel('cart-count')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cart_items' },
        () => loadCartCount()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = searchOpen || accountOpen ? "hidden" : ""
  }, [searchOpen, accountOpen])

  return (
    <>
      {searchOpen && <div className="search-backdrop" onClick={() => setSearchOpen(false)} />}

      <div className={`search-overlay ${searchOpen ? "open" : ""}`}>
        <div className="search-bar">
          <input
            type="text"
            placeholder="SEARCH PRODUCTS"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(query)}`
                setSearchOpen(false)
              }
            }}
            autoFocus={searchOpen}
          />
          <button className="search-submit">
            <Search size={18} />
          </button>
          <button className="search-close" onClick={() => setSearchOpen(false)}>
            <X size={22} />
          </button>
        </div>
      </div>

      <header className={`site-header fixed ${scrolled ? "scrolled" : ""}`}>
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
                <Link href="#">Products <span className="nav-arrow" /></Link>
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

              <li><Link href="/collections">Collections</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>

          <div className="header-actions">
            <button className="icon-btn" onClick={() => setSearchOpen(true)}>
              <Search size={22} />
            </button>
            <button className="icon-btn" onClick={() => setAccountOpen(true)}>
              <User size={22} />
            </button>
            <button className="icon-btn" onClick={() => window.location.href = '/wishlist'}>
              <Heart size={22} />
            </button>
            <button
              className="icon-btn cart-btn"
              onClick={() => window.location.href = '/cart'}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="header-spacer" />

      <AccountSidebar open={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  )
}