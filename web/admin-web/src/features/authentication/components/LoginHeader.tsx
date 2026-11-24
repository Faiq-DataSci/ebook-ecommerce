import type { FC } from 'react'

export const LoginHeader: FC = () => {
  return (
    <div className="login-brand-panel">
      <div className="login-brand-top">
        <div className="login-badge-admin">
          <span className="login-badge-dot" aria-hidden="true" />
          <span>PORTAL ADMINISTRATOR</span>
        </div>

        <h1 className="login-brand-title">BUKU KITA</h1>
        <p className="login-brand-tagline">
          Konsol Manajemen Toko E-Book & Sistem Pendukung Keputusan (SAW)
        </p>
      </div>

      <div className="login-geometric-showcase" aria-hidden="true">
        <div className="geometric-box geometric-box-1">
          <span className="material-symbols-outlined geometric-icon">shield_person</span>
          <span className="geometric-label">RBAC ADMIN</span>
        </div>
        <div className="geometric-box geometric-box-2">
          <span className="material-symbols-outlined geometric-icon">calculate</span>
          <span className="geometric-label">SPK SAW</span>
        </div>
        <div className="geometric-box geometric-box-3">
          <span className="material-symbols-outlined geometric-icon">lock</span>
          <span className="geometric-label">SUPABASE</span>
        </div>
      </div>

      <div className="login-security-notice">
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}
          aria-hidden="true"
        >
          info
        </span>
        <p className="login-security-text">
          Area terbatas. Hanya akun terdaftar dengan peran <strong>ADMIN</strong> yang diizinkan masuk. Seluruh interaksi diaudit di backend.
        </p>
      </div>
    </div>
  )
}
