"use client"

import { X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import "./AccountSidebar.css"

export default function AccountSidebar({ open, onClose }) {
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

  const isActive = (href) => pathname === href

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (data.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", data.user.id)
          .single()

        setProfile(profileData)
      }
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser()
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    onClose()
    window.location.href = "/login"
  }

  return (
    <>
      {open && <div className="account-backdrop" onClick={onClose} />}

      <aside className={`account-sidebar ${open ? "open" : ""}`}>
        <div className="account-header">
          <div className="header-logo">
            <Link href="/" onClick={onClose}>
              <img src="/LOGO.svg" alt="Birdfire" />
            </Link>
          </div>
          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {user && (
          <div className="account-user">
            <span>WELCOME</span>
            <strong>{profile?.full_name || "Customer"}</strong>
          </div>
        )}

        <div className="account-section">
          <h4>CUSTOMER ACCOUNT</h4>
          <ul>
            {!user && (
              <>
                <li className={isActive("/login") ? "active" : ""}>
                  <Link href="/login" onClick={onClose}>Login</Link>
                </li>
                <li className={isActive("/register") ? "active" : ""}>
                  <Link href="/register" onClick={onClose}>Register</Link>
                </li>
              </>
            )}

            {user && (
              <>
                {/* <li className={isActive("/account") ? "active" : ""}>
                  <Link href="/account" onClick={onClose}>My Account</Link>
                </li> */}
                <li className={isActive("/orders") ? "active" : ""}>
                  <Link href="/orders" onClick={onClose}>My Orders</Link>
                </li>
                <li className={isActive("/wishlist") ? "active" : ""}>
                  <Link href="/wishlist" onClick={onClose}>Wishlist</Link>
                </li>
                <li className={isActive("/cart") ? "active" : ""}>
                  <Link href="/cart" onClick={onClose}>My Cart</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="account-section">
          <h4>CUSTOMER CARE</h4>
          <ul>
            {/* <li><Link href="/faqs" onClick={onClose}>FAQs</Link></li>
            <li><Link href="/terms" onClick={onClose}>Terms of Service</Link></li> */}
            {/* <li><Link href="/privacy" onClick={onClose}>Privacy Policy</Link></li> */}
            <li><Link href="/contact" onClick={onClose}>Contact Us</Link></li>
            {/* <li><Link href="/gift-card" onClick={onClose}>Gift Card</Link></li> */}
          </ul>
        </div>

        {/* <div className="account-section">
          <h4>CURRENCY</h4>
          <select>
            <option>EUR €</option>
            <option>USD $</option>
          </select>
        </div>

        <div className="account-section">
          <h4>LANGUAGE</h4>
          <select>
            <option>English</option>
            <option>French</option>
          </select>
        </div> */}

        {user && (
          <button className="btnSubmit account-logout" onClick={logout}>
            <span>LOGOUT</span>
          </button>
        )}
      </aside>
    </>
  )
}