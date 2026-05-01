"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  X,
  Menu,
  Armchair,
  Lamp,
  Table,
  Sofa,
  Palmtree,
  Flame,
  Gem,
  Shapes,
  Package
} from "lucide-react"
import AccountSidebar from "./AccountSidebar"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import "./Header.css"
import { supabase } from '@/lib/supabaseClient'

export const categories = [
  { label: "Dining & Bar Chairs", icon: Armchair, link: "/category/products/dining-and-bar-chairs" },
  { label: "Tables", icon: Table, link: "/category/products/tables" },
  { label: "Lounging", icon: Sofa, link: "/category/products/lounging" },
  { label: "Lounge Chairs", icon: Armchair, link: "/category/products/lounge-chairs" },
  { label: "Beach Chairs", icon: Palmtree, link: "/category/products/beach-chairs" },
  { label: "Iconics", icon: Gem, link: "/category/products/iconics" },
  { label: "Side Tables", icon: Table, link: "/category/products/side-tables" },
  { label: "Lighting Accessories", icon: Lamp, link: "/category/products/lighting-accessories" },
  { label: "Accessories", icon: Package, link: "/category/products/accessories" },
  { label: "Ethanol Fireplaces", icon: Flame, link: "/category/products/ethanol-fireplaces" },
  { label: "Gas Fireplaces", icon: Flame, link: "/category/products/gas-fireplaces" },
  { label: "Electric Fireplaces", icon: Flame, link: "/category/products/electric-fireplaces" },
  { label: "Wood Fireplaces", icon: Flame, link: "/category/products/wood-fireplaces" },
  { label: "Metal Sculptures", icon: Shapes, link: "/category/products/metal-sculptures" },
]

export default function Header() {
  const { user } = useAuth()
  const userId = user?.id
  const { cart } = useCart()
  
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    let isMounted = true

    const loadCartCount = async () => {
      if (userId) {
        // User is logged in - load from Supabase
        const { data, error } = await supabase
          .from('cart_items')
          .select('quantity')
          .eq('user_id', userId)

        if (error) {
          console.error('Cart count error:', error)
          return
        }

        const count = data?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
        if (isMounted) setCartCount(count)
      } else {
        // Guest user - get count from context
        const count = cart.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(count)
      }
    }

    loadCartCount()

    if (userId) {
      const channel = supabase
        .channel(`cart-count-${userId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'cart_items', filter: `user_id=eq.${userId}` },
          () => loadCartCount()
        )
        .subscribe()

      return () => {
        isMounted = false
        supabase.removeChannel(channel)
      }
    }

    return () => {
      isMounted = false
    }
  }, [userId, cart])


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = searchOpen || accountOpen || mobileNavOpen ? "hidden" : ""
  }, [searchOpen, accountOpen, mobileNavOpen])

  useEffect(() => {
    if (!mobileNavOpen) return

    const onResize = () => {
      if (window.innerWidth > 900) {
        setMobileNavOpen(false)
        setMobileProductsOpen(false)
      }
    }

    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [mobileNavOpen])

  return (
    <>
      {searchOpen && <div className="search-backdrop" onClick={() => setSearchOpen(false)} />}
      {mobileNavOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => {
            setMobileNavOpen(false)
            setMobileProductsOpen(false)
          }}
        />
      )}

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

          <nav
            className={`header-nav ${mobileNavOpen ? "open" : ""}`}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) {
                setMobileNavOpen(false)
                setMobileProductsOpen(false)
              }
            }}
          >
            <ul>
              <li><Link href="/">Home</Link></li>

              <li className={`nav-item has-mega ${mobileProductsOpen ? "open" : ""}`}>
                <button
                  type="button"
                  className="products-toggle"
                  aria-expanded={mobileProductsOpen}
                  onClick={() => setMobileProductsOpen((open) => !open)}
                >
                  Products <span className="nav-arrow" />
                </button>
                <div className="mega-menu">
                  <div className="mega-menu-2">
                    <div className="grid-icons">
                      {categories.map((cat, i) => (
                        <Link key={i} href={cat.link} className="mega-card">
                          <cat.icon size={28} strokeWidth={1.5} />
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

            <div className="mobile-menu-actions">
              <button
                type="button"
                className="mobile-action"
                onClick={() => {
                  setMobileNavOpen(false)
                  setSearchOpen(true)
                }}
              >
                <Search size={18} />
                <span>Search</span>
              </button>
              <button
                type="button"
                className="mobile-action"
                onClick={() => {
                  setMobileNavOpen(false)
                  setAccountOpen(true)
                }}
              >
                <User size={18} />
                <span>Account</span>
              </button>
              <button
                type="button"
                className="mobile-action"
                onClick={() => window.location.href = '/wishlist'}
              >
                <Heart size={18} />
                <span>Wishlist</span>
              </button>
              <button
                type="button"
                className="mobile-action"
                onClick={() => window.location.href = '/cart'}
              >
                <ShoppingBag size={18} />
                <span>Cart</span>
                {cartCount > 0 && <span className="mobile-cart-count">{cartCount}</span>}
              </button>
            </div>
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
            <button
              className="icon-btn menu-btn"
              aria-label="Open menu"
              aria-expanded={mobileNavOpen}
              onClick={() => {
                setMobileNavOpen((open) => {
                  if (open) setMobileProductsOpen(false)
                  return !open
                })
              }}
            >
              {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <div className="header-spacer" />

      <AccountSidebar open={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  )
}
