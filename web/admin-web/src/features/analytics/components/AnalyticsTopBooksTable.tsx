import {
  EmptyState,
  Pagination,
  SearchInput,
  TableSkeleton,
} from '../../../shared/components/ui'
import type { TopPerformingEbook } from '../types/analytics'

interface AnalyticsTopBooksTableProps {
  topBooksTab: 'ALL' | 'GROWTH' | 'REVENUE' | 'SAW'
  searchQuery: string
  paginatedBooks: TopPerformingEbook[]
  filteredBooksCount: number
  isLoading: boolean
  currentPage: number
  totalPages: number
  pageSize: number
  setTopBooksTab: (tab: 'ALL' | 'GROWTH' | 'REVENUE' | 'SAW') => void
  setSearchQuery: (query: string) => void
  setCurrentPage: (page: number) => void
}

export function AnalyticsTopBooksTable({
  topBooksTab,
  searchQuery,
  paginatedBooks,
  filteredBooksCount,
  isLoading,
  currentPage,
  totalPages,
  pageSize,
  setTopBooksTab,
  setSearchQuery,
  setCurrentPage,
}: AnalyticsTopBooksTableProps) {
  return (
    <div className="analytics-table-card">
      <div className="analytics-table-controls">
        <div
          className="analytics-table-tabs"
          role="tablist"
          aria-label="Tab Pilihan Performa E-Book"
        >
          {(
            [
              { key: 'ALL', label: 'Semua E-Book' },
              { key: 'GROWTH', label: 'Pertumbuhan Tertinggi (Velocity)' },
              { key: 'REVENUE', label: 'Omzet Terbesar' },
              { key: 'SAW', label: 'Rekomendasi Teratas SAW' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={topBooksTab === tab.key}
              className={`analytics-tab-btn ${topBooksTab === tab.key ? 'is-active' : ''}`}
              onClick={() => {
                setTopBooksTab(tab.key)
                setCurrentPage(1)
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ width: '100%', maxWidth: 320 }}>
          <SearchInput
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val)
              setCurrentPage(1)
            }}
            onClear={() => setSearchQuery('')}
            placeholder="Cari judul, penulis, atau kategori..."
            ariaLabel="Cari tabel performa e-book"
          />
        </div>
      </div>

      {/* Tabel Data Padat */}
      {isLoading ? (
        <TableSkeleton rows={pageSize} cols={8} />
      ) : filteredBooksCount === 0 ? (
        <EmptyState
          icon="menu_book"
          title="Tidak ada e-book yang cocok"
          description={`Tidak ditemukan data performa e-book untuk kriteria pencarian "${searchQuery}".`}
          actionLabel="Reset Pencarian"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="nb-table-container">
          <table className="analytics-table" aria-label="Tabel Matriks Performa E-Book">
            <thead>
              <tr>
                <th scope="col" style={{ width: 60, textAlign: 'center' }}>
                  Rank
                </th>
                <th scope="col">Judul E-Book</th>
                <th scope="col" style={{ width: 180 }}>
                  Kategori & Penulis
                </th>
                <th scope="col" style={{ width: 110, textAlign: 'right' }}>
                  Harga Satuan
                </th>
                <th scope="col" style={{ width: 100, textAlign: 'right' }}>
                  Terjual
                </th>
                <th scope="col" style={{ width: 130, textAlign: 'right' }}>
                  Total Omzet
                </th>
                <th scope="col" style={{ width: 110, textAlign: 'center' }}>
                  Pertumbuhan
                </th>
                <th scope="col" style={{ width: 120, textAlign: 'center' }}>
                  Skor SAW
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedBooks.map((book) => (
                <tr key={book.id}>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      className={`analytics-rank-badge ${
                        book.sawRank === 1
                          ? 'rank-1'
                          : book.sawRank === 2
                            ? 'rank-2'
                            : book.sawRank === 3
                              ? 'rank-3'
                              : ''
                      }`}
                    >
                      #{book.sawRank}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{
                        fontWeight: 700,
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--nb-black)',
                      }}
                    >
                      {book.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 14, color: '#F59E0B' }}
                      >
                        star
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {book.rating}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--nb-text-muted)' }}>
                        • Konversi: {book.conversionRate}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{book.category}</div>
                    <div style={{ fontSize: 11, color: 'var(--nb-text-muted)', marginTop: 2 }}>
                      {book.author.replace('DATA SIMULASI — ', '')}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {book.price}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                    {book.unitsSold.toLocaleString('id-ID')}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      color: '#065F46',
                    }}
                  >
                    {book.totalRevenue}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="analytics-kpi-pill is-positive">
                      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
                        trending_up
                      </span>
                      <span>+{book.growthRate}%</span>
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      className="analytics-saw-score-chip"
                      title={`Skor SPK Simple Additive Weighting: ${book.sawScore}`}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 13, color: '#4338CA' }}
                      >
                        stars
                      </span>
                      <span>{book.sawScore.toFixed(3)}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginasi Footer */}
      {filteredBooksCount > 0 && (
        <div style={{ borderTop: 'var(--nb-border-2)', paddingTop: 14 }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredBooksCount}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}
