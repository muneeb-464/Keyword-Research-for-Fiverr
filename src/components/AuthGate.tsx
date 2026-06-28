import { useState } from "react"
import { X } from "lucide-react"
import { supabase } from "../lib/supabase"

interface Props {
  open: boolean
  onClose: () => void
}

const inputStyle: React.CSSProperties = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: 8,
  color: "#e2e8f0",
  fontSize: 14,
  padding: "10px 12px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
}

export function AuthModal({ open, onClose }: Props) {
  const [mode, setMode]         = useState<"login" | "signup">("login")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  if (!open) return null

  const signInWithGoogle = async () => {
    setError("")
    setGoogleLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      })
      if (error) throw error
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in failed")
      setGoogleLoading(false)
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        else {
          setError("")
          // Show confirmation hint for signup
          alert("Check your email to confirm your account, then sign in.")
          setMode("login")
          setLoading(false)
          return
        }
      }
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Auth failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#131929", border: "1px solid #1e293b", borderRadius: 16,
          padding: "28px 24px", width: 360, maxWidth: "92vw", position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 14,
            background: "none", border: "none", cursor: "pointer",
            color: "#475569", display: "flex", padding: 4,
          }}
        >
          <X size={16} />
        </button>

        <p style={{ color: "#3b82f6", fontWeight: 900, fontSize: 18, marginBottom: 4 }}>
          KeywordPulse
        </p>
        <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 20 }}>
          {mode === "login" ? "Sign in to save your data" : "Create account to save your data"}
        </p>

        {/* Google */}
        <button
          onClick={signInWithGoogle}
          disabled={googleLoading}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, background: "#fff", color: "#1e293b", border: "none",
            borderRadius: 8, padding: "10px 0", fontWeight: 600, fontSize: 14,
            cursor: googleLoading ? "not-allowed" : "pointer", opacity: googleLoading ? 0.7 : 1,
            marginBottom: 16,
          }}
        >
          {/* Google logo SVG */}
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
          </svg>
          {googleLoading ? "Redirecting…" : "Continue with Google"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
          <span style={{ color: "#475569", fontSize: 11 }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
        </div>

        {/* Email form */}
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          {error && (
            <p style={{ color: "#f87171", fontSize: 12, margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#3b82f6", color: "#fff", border: "none",
              borderRadius: 8, padding: "10px 0", fontWeight: 700,
              fontSize: 14, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1, marginTop: 2,
            }}
          >
            {loading ? "…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p style={{ color: "#64748b", fontSize: 12, textAlign: "center", marginTop: 14, marginBottom: 0 }}>
          {mode === "login" ? "No account? " : "Already have one? "}
          <button
            onClick={() => { setMode(m => m === "login" ? "signup" : "login"); setError("") }}
            style={{
              background: "none", border: "none", color: "#3b82f6",
              cursor: "pointer", fontSize: 12, padding: 0, fontWeight: 600,
            }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  )
}
