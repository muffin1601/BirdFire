"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { consumeAuthRedirect, sanitizeRedirectPath, toUserMessage } from "@/lib/auth"

import { motion, AnimatePresence } from "framer-motion"

type CallbackStatus = "loading" | "error"

export default function AuthCallbackHandler() {
  const router = useRouter()
  const hasHandledCallback = useRef(false)
  const [status, setStatus] = useState<CallbackStatus>("loading")
  const [message, setMessage] = useState("Completing sign in...")
  const [showManualLink, setShowManualLink] = useState(false)

  useEffect(() => {
    // Safety timeout to show a manual link if things take too long
    const timeout = setTimeout(() => {
      setShowManualLink(true)
    }, 8000)

    const handleCallback = async () => {
      if (hasHandledCallback.current) return
      hasHandledCallback.current = true

      const searchParams = new URLSearchParams(window.location.search)

      try {
        console.log("Auth callback: starting process")
        const callbackError = searchParams.get("error_description") || searchParams.get("error")
        if (callbackError) throw new Error(callbackError)

        const code = searchParams.get("code")
        
        // First check if the library already exchanged the code and we have a session
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        
        if (initialSession) {
          console.log("Auth callback: session already exists (possibly auto-exchanged)")
        } else if (code) {
          console.log("Auth callback: exchanging code for session...")
          setMessage("Securing your session...")
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            console.error("Auth callback: exchangeCodeForSession error:", error)
            // If it's a "code already redeemed" error, we might already have a session
            if (!error.message?.includes("already been redeemed")) {
              throw error
            }
          }
          console.log("Auth callback: code exchange handled")
        }

        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""))
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")

        if (accessToken && refreshToken) {
          console.log("Auth callback: setting session from hash...")
          setMessage("Restoring your session...")
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            console.error("Auth callback: setSession error:", error)
            throw error
          }
          console.log("Auth callback: setSession successful")
          window.history.replaceState(null, document.title, window.location.pathname)
        }

        console.log("Auth callback: getting session...")
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Auth callback: getSession error:", sessionError)
          throw sessionError
        }
        
        console.log("Auth callback: session result:", session ? "Session found" : "No session")
        
        if (!session && code) {
          console.log("Auth callback: no session yet, waiting 500ms...")
          await new Promise(resolve => setTimeout(resolve, 500))
          const { data: { session: secondTrySession } } = await supabase.auth.getSession()
          if (!secondTrySession) {
             console.warn("Auth callback: Still no session after wait")
          }
        }

        const nextParam = searchParams.get("next")
        const nextPath = nextParam ? sanitizeRedirectPath(nextParam) : consumeAuthRedirect()
        const finalRedirect = nextPath || "/"

        console.log("Auth callback: redirecting to", finalRedirect)
        setMessage("Signed in. Redirecting...")
        
        window.location.href = finalRedirect
      } catch (error) {
        console.error("Auth callback caught error:", error)
        setStatus("error")
        setMessage(toUserMessage(error, "Sign in could not be completed. Please try again."))
      }
    }

    handleCallback()
    return () => clearTimeout(timeout)
  }, [router])

  return (
    <main
      style={{
        display: "grid",
        minHeight: "100vh",
        placeItems: "center",
        background: "#ffffff",
        color: "#000000",
        padding: 24,
        textAlign: "center",
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{ maxWidth: 400, width: "100%" }}
      >
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
          {status === "loading" && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: 40,
                height: 40,
                border: "3px solid #f3f3f3",
                borderTop: "3px solid #ec9d35",
                borderRadius: "50%",
              }}
            />
          )}
          {status === "error" && (
            <div style={{ color: "#ff4b4b", fontSize: 48 }}>
              <i className="zmdi zmdi-alert-circle-o" />
            </div>
          )}
        </div>

        <h1 style={{ 
          color: "#000000", 
          fontSize: 28, 
          fontWeight: 800, 
          marginBottom: 12,
          letterSpacing: '-0.02em'
        }}>
          {status === "error" ? "Sign in failed" : "Please wait"}
        </h1>
        
        <p style={{ 
          color: "#666666", 
          marginBottom: 32, 
          fontSize: 16,
          lineHeight: 1.5 
        }}>
          {message}
        </p>
        
        <AnimatePresence>
          {(status === "error" || showManualLink) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <Link 
                href="/" 
                className="btn-2"
                style={{ 
                  background: "#000000", 
                  color: "#000000ff",
                  width: '100%',
                  padding: '20px 32px',
                  borderRadius: '0px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                <span>Go to Homepage</span>
                <i className="zmdi zmdi-arrow-right" style={{ marginLeft: 8 }} />
              </Link>
              
              <Link 
                href="/login" 
                style={{ 
                  color: "#000000", 
                  fontSize: '14px', 
                  fontWeight: 500,
                  textDecoration: "underline",
                  marginTop: 8
                }}
              >
                Back to login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  )
}
