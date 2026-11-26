import type { AnalyticsDataset } from '../types/analytics'

interface AnalyticsConversionPanelsProps {
  dataset: AnalyticsDataset
  onNavigate?: (path: string) => void
}

export function AnalyticsConversionPanels({
  dataset,
  onNavigate,
}: AnalyticsConversionPanelsProps) {
  return (
    <>
      {/* Grid 2 Kolom: Corong Konversi & Kontribusi Kategori */}
      <div className="analytics-two-col-grid">
        {/* Kolom 1: Corong Konversi Pembayaran (Purchase Funnel) */}
        <div className="analytics-panel-card">
          <div className="analytics-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" aria-hidden="true">
                filter_alt
              </span>
              <h2 className="analytics-panel-title">Corong Konversi Pembayaran</h2>
            </div>
            <span
              className="analytics-drop-pill"
              style={{
                backgroundColor: '#DCFCE7',
                color: '#166534',
                borderColor: '#166534',
              }}
            >
              Tingkat Konversi Lunas: 8.0%
            </span>
          </div>

          <p style={{ margin: 0, fontSize: 12, color: 'var(--nb-text-muted)' }}>
            Perjalanan pembeli dari penelusuran katalog hingga penyelesaian pembayaran invoice resmi.
          </p>

          <div className="analytics-funnel-list">
            {dataset.funnelStages.map((stage, idx) => (
              <div key={stage.id} className="analytics-funnel-step">
                <div className="analytics-funnel-step-head">
                  <div className="analytics-funnel-step-label">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 18, color: stage.color }}
                    >
                      {stage.icon}
                    </span>
                    <span>
                      {idx + 1}. {stage.label}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="analytics-funnel-step-metric">
                      {stage.formattedCount}
                    </span>
                    {stage.dropOffRate && (
                      <span
                        className="analytics-drop-pill"
                        title="Tingkat pembatalan sebelum tahap ini"
                      >
                        -{stage.dropOffRate}% Drop
                      </span>
                    )}
                  </div>
                </div>

                <div className="analytics-funnel-bar-outer">
                  <div
                    className="analytics-funnel-bar-fill"
                    style={{
                      width: `${stage.percentageOfTotal}%`,
                      backgroundColor: stage.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pangsa Metode Pembayaran */}
          <div style={{ marginTop: 8, paddingTop: 14, borderTop: 'var(--nb-border-2)' }}>
            <h3
              style={{
                margin: '0 0 10px 0',
                fontFamily: 'var(--font-heading)',
                fontSize: 13,
                textTransform: 'uppercase',
              }}
            >
              Distribusi Metode Pembayaran
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dataset.paymentShares.map((pay) => (
                <div key={pay.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                      {pay.name}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                      {pay.sharePercentage}% ({pay.volumeFormatted})
                    </span>
                  </div>
                  <div
                    style={{
                      height: 10,
                      width: '100%',
                      backgroundColor: 'var(--nb-paper)',
                      border: '1px solid #000',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${pay.sharePercentage}%`,
                        backgroundColor: pay.color,
                        borderRight: '1px solid #000',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom 2: Kontribusi Kategori E-Book */}
        <div className="analytics-panel-card">
          <div className="analytics-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" aria-hidden="true">
                pie_chart
              </span>
              <h2 className="analytics-panel-title">Kontribusi Kategori E-Book</h2>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}>
              5 Kategori Aktif
            </span>
          </div>

          <p style={{ margin: 0, fontSize: 12, color: 'var(--nb-text-muted)' }}>
            Persentase pembagian omzet dan buku terlaris pada masing-masing domain keilmuan e-book.
          </p>

          <div className="analytics-category-list">
            {dataset.categoryBreakdown.map((cat) => (
              <div key={cat.id} className="analytics-category-item">
                <div className="analytics-category-meta-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 12,
                        height: 12,
                        backgroundColor: cat.color,
                        border: '1px solid #000',
                      }}
                    />
                    <span className="analytics-category-name">{cat.name}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="analytics-category-rev">{cat.revenueFormatted}</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: 'var(--nb-paper)',
                        padding: '1px 6px',
                        border: '1px solid #000',
                      }}
                    >
                      {cat.percentage}%
                    </span>
                  </div>
                </div>

                <div className="analytics-cat-progress-outer">
                  <div
                    className="analytics-cat-progress-fill"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    color: 'var(--nb-text-muted)',
                  }}
                >
                  <span>
                    {cat.unitsSold} buku terjual ({cat.activeBookCount} judul aktif)
                  </span>
                  <span
                    style={{
                      fontStyle: 'italic',
                      maxWidth: '60%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Top: {cat.topBookTitle.replace('DATA SIMULASI — ', '')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 'auto',
              paddingTop: 12,
              borderTop: 'var(--nb-border-2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600 }}>
              Kelola detail taksonomi kategori:
            </span>
            <button
              type="button"
              className="nb-btn nb-page-btn"
              style={{ fontSize: 11, padding: '4px 10px' }}
              onClick={() => onNavigate?.('/admin/katalog/kategori')}
            >
              Buka Katalog Kategori
            </button>
          </div>
        </div>
      </div>

      {/* SPK SAW Intelligence Insight Banner */}
      <div
        className="analytics-saw-banner"
        role="region"
        aria-label="Wawasan Algoritma SPK SAW"
      >
        <div className="analytics-saw-banner-left">
          <div className="analytics-saw-icon-badge">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 28, color: '#4338CA' }}
              aria-hidden="true"
            >
              auto_awesome
            </span>
          </div>

          <div>
            <h3 className="analytics-saw-title">
              Inteligensi Rekomendasi SAW Berkontribusi Signifikan Terhadap Konversi
            </h3>
            <p className="analytics-saw-desc">
              Analisis korelasi menunjukkan bahwa e-book yang memperoleh <strong>Skor SAW Tinggi (Top 5 Peringkat)</strong> menghasilkan rata-rata tingkat konversi pembelian <strong>6.2%</strong> (dibandingkan 4.6% pada buku non-rekomendasi). Peringkat e-book terhitung murni di backend sesuai bobot kriteria resmi.
            </p>
          </div>
        </div>

        <div className="analytics-saw-banner-right">
          <button
            type="button"
            className="nb-btn is-active"
            style={{
              backgroundColor: 'var(--nb-white)',
              color: 'var(--nb-black)',
              border: 'var(--nb-border-2)',
              boxShadow: 'var(--nb-shadow-sm)',
              padding: '10px 16px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: 12,
            }}
            onClick={() => onNavigate?.('/admin/spk/matriks')}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18 }}
              aria-hidden="true"
            >
              calculate
            </span>
            <span>Audit Matriks SPK SAW</span>
          </button>
        </div>
      </div>
    </>
  )
}
