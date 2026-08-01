'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase-browser.js'

function Field({ label, hint, ...props }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs font-semibold text-ink-muted uppercase tracking-wide">{label}</label>
        {hint && <span className="text-xs text-ink-faint">{hint}</span>}
      </div>
      <input
        {...props}
        className="w-full bg-surface-2 border border-line rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ice focus:ring-1 focus:ring-ice transition-colors"
      />
    </div>
  )
}

export default function AuthModal({ initialTab = 'signin', onClose }) {
  const [tab, setTab] = useState(initialTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sent, setSent] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function switchTab(t) {
    setTab(t)
    setError(null)
    setSent(false)
  }

  async function handleSignIn(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else { onClose() }
  }

  async function handleSignUp(e) {
    e.preventDefault()
    if (zipCode && !/^\d{5}$/.test(zipCode)) {
      setError('Enter a valid 5-digit US zip code.')
      return
    }
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { zip_code: zipCode || null },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) { setError(error.message); setLoading(false) }
    else { setSent(true); setLoading(false) }
  }

  async function handleForgotPassword() {
    if (!email) { setError('Enter your email address first.'); return }
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account/reset-password`,
    })
    setLoading(false)
    if (error) setError(error.message)
    else setError('Password reset email sent — check your inbox.')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-surface border border-line rounded-2xl w-full max-w-sm shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="font-display font-bold text-lg text-ink">
            {tab === 'signin' ? 'Sign in' : 'Create account'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-ink-faint hover:text-ink transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mx-6 mb-5 bg-surface-2 rounded-xl p-1 gap-1">
          {[{ key: 'signin', label: 'Sign in' }, { key: 'signup', label: 'Create account' }].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              className={`flex-1 text-sm py-1.5 rounded-lg font-medium transition-colors ${
                tab === key
                  ? 'bg-surface text-ink shadow-sm'
                  : 'text-ink-faint hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="px-6 pb-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-3xl mb-3">📬</div>
              <div className="font-display font-bold text-ink mb-1">Check your email</div>
              <p className="text-sm text-ink-muted">
                We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
              </p>
            </div>
          ) : (
            <form onSubmit={tab === 'signin' ? handleSignIn : handleSignUp} className="flex flex-col gap-4">
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
              <Field
                label="Password"
                hint={tab === 'signup' ? 'Min 8 characters' : undefined}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
              />

              {tab === 'signup' && (
                <Field
                  label="Zip code"
                  hint="Optional"
                  type="text"
                  inputMode="numeric"
                  value={zipCode}
                  onChange={e => setZipCode(e.target.value)}
                  placeholder="98101"
                  maxLength={5}
                />
              )}

              {tab === 'signup' && (
                <p className="text-xs text-ink-faint -mt-2">
                  Your zip code is used only to estimate drive distance to each resort.
                </p>
              )}

              {error && (
                <div className="text-xs text-bad bg-bad-bg border border-bad-border rounded-xl px-4 py-2.5">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-navy hover:bg-navy-soft disabled:opacity-50 text-white font-display font-bold text-sm py-2.5 rounded-xl transition-colors"
              >
                {loading ? '…' : tab === 'signin' ? 'Sign in' : 'Create account'}
              </button>

              {tab === 'signin' && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-ink-faint hover:text-ink-muted text-center transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
