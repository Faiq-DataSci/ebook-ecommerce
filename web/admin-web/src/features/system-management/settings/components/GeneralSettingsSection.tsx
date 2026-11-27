export function GeneralSettingsSection() {
  return (
    <div className="sys-settings-grid">
      <section className="sys-settings-card">
        <div className="sys-card-head">
          <div>
            <h2 className="sys-card-title">Identitas Platform (Dokumentasi Resmi)</h2>
            <p className="sys-card-desc">
              Informasi platform yang telah ditetapkan pada sumber kebenaran proyek
              (<code>docs-proyek-ebook-ecommerce.md</code>).
            </p>
          </div>
          <span className="sys-tag is-info">READ-ONLY</span>
        </div>

        <div className="sys-kv-list">
          <div className="sys-kv-row">
            <span className="sys-kv-key">Nama Sistem</span>
            <span className="sys-kv-val">
              Sistem Informasi E-Commerce E-Book &amp; SPK (Metode SAW)
            </span>
          </div>
          <div className="sys-kv-row">
            <span className="sys-kv-key">Model Bisnis</span>
            <span className="sys-kv-val">
              Single-Seller B2C (ADR-0001 — satu toko resmi, bukan marketplace)
            </span>
          </div>
          <div className="sys-kv-row">
            <span className="sys-kv-key">Bahasa Antarmuka</span>
            <span className="sys-kv-val">Bahasa Indonesia (id-ID)</span>
          </div>
          <div className="sys-kv-row">
            <span className="sys-kv-key">Identitas &amp; Logo Final</span>
            <span className="sys-kv-val">
              Menunggu Keputusan Terbuka #8 (status [RENCANA])
            </span>
          </div>
        </div>
      </section>

      <section className="sys-settings-card">
        <div className="sys-card-head">
          <div>
            <h2 className="sys-card-title">Konfigurasi Profil Toko Dinamis</h2>
            <p className="sys-card-desc">
              Pengubahan nama toko, deskripsi singkat, dan email kontak publik.
            </p>
          </div>
          <span className="sys-tag is-warning">BELUM TERSEDIA DI BACKEND</span>
        </div>

        <div className="sys-security-note">
          <strong>Catatan Integrasi Backend:</strong> Skema database aktual (
          <code>backend/prisma/schema.prisma</code>) belum memiliki tabel{' '}
          <code>settings</code> maupun endpoint <code>GET/PUT /api/v1/admin/settings</code>.
          Form ubah profil toko sengaja tidak ditampilkan sebagai kontrol palsu agar
          setiap perubahan pada halaman Pengaturan memiliki dampak nyata pada sistem.
        </div>

        <div className="sys-kv-list">
          <div className="sys-kv-row">
            <span className="sys-kv-key">Kebutuhan Endpoint</span>
            <span className="sys-kv-val font-mono-nb">
              GET / PUT /api/v1/admin/settings
            </span>
          </div>
          <div className="sys-kv-row">
            <span className="sys-kv-key">Kebutuhan Schema</span>
            <span className="sys-kv-val font-mono-nb">
              Model StoreSetting / SystemConfig di Prisma
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
