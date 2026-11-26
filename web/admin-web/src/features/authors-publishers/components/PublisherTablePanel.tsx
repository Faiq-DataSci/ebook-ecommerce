import {
  EmptyState,
  FilterChipGroup,
  Pagination,
  SearchInput,
  StatusBadge,
  TableSkeleton,
} from '../../../shared/components/ui'
import type {
  PublisherListItem,
  PublisherStatus,
  PublisherTableFilters,
} from '../types/authorPublisher'

interface PublisherTablePanelProps {
  publishers: PublisherListItem[]
  filteredPublishers: PublisherListItem[]
  paginatedPublishers: PublisherListItem[]
  publisherFilters: PublisherTableFilters
  totalPublisherPages: number
  isLoading: boolean
  setPublisherFilters: React.Dispatch<React.SetStateAction<PublisherTableFilters>>
  onSort: (column: 'name' | 'city' | 'ebookCount' | 'createdAt') => void
  onOpenAdd: () => void
  onOpenEdit: (publisher: PublisherListItem) => void
  onDelete: (publisher: PublisherListItem) => void
  onRefresh: () => void
}

export function PublisherTablePanel({
  publishers,
  filteredPublishers,
  paginatedPublishers,
  publisherFilters,
  totalPublisherPages,
  isLoading,
  setPublisherFilters,
  onSort,
  onOpenAdd,
  onOpenEdit,
  onDelete,
  onRefresh,
}: PublisherTablePanelProps) {
  return (
    <div
      id="panel-publishers"
      role="tabpanel"
      aria-labelledby="tab-publishers"
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {/* Filter Bar Penerbit */}
      <div className="catalog-filter-bar">
        <div className="catalog-filter-left">
          <SearchInput
            value={publisherFilters.search}
            onChange={(search) =>
              setPublisherFilters((prev) => ({ ...prev, search, page: 1 }))
            }
            onClear={() =>
              setPublisherFilters((prev) => ({ ...prev, search: '', page: 1 }))
            }
            placeholder="Cari penerbit, kota, atau email..."
            ariaLabel="Cari penerbit"
          />

          <FilterChipGroup
            label="Status:"
            value={publisherFilters.status}
            onChange={(val) =>
              setPublisherFilters((prev) => ({
                ...prev,
                status: val as 'ALL' | PublisherStatus,
                page: 1,
              }))
            }
            options={[
              {
                value: 'ALL',
                label: 'Semua Status',
                count: publishers.length,
                activeBg: 'var(--nb-yellow)',
              },
              {
                value: 'AKTIF',
                label: 'Aktif',
                count: publishers.filter((p) => p.isActive).length,
                activeBg: 'var(--nb-green)',
              },
              {
                value: 'NONAKTIF',
                label: 'Nonaktif',
                count: publishers.filter((p) => !p.isActive).length,
                activeBg: 'var(--nb-muted)',
              },
            ]}
          />
        </div>

        <div className="catalog-filter-right">
          <button
            type="button"
            className="nb-btn nb-page-btn"
            style={{ width: 'auto', padding: '0 14px', fontSize: 13 }}
            onClick={onRefresh}
            title="Segarkan data tabel penerbit"
          >
            Segarkan
          </button>
        </div>
      </div>

      {/* Active Filter Strip Penerbit */}
      {(publisherFilters.search || publisherFilters.status !== 'ALL') && (
        <div className="nb-active-filter-strip">
          <div className="nb-active-tags">
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              Filter Aktif:
            </span>
            {publisherFilters.search && (
              <span className="nb-active-tag-badge">
                <span>Cari: &ldquo;{publisherFilters.search}&rdquo;</span>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() =>
                    setPublisherFilters((prev) => ({ ...prev, search: '', page: 1 }))
                  }
                  aria-label="Hapus filter pencarian"
                >
                  ×
                </button>
              </span>
            )}
            {publisherFilters.status !== 'ALL' && (
              <span className="nb-active-tag-badge">
                <span>
                  Status: {publisherFilters.status === 'AKTIF' ? 'Aktif' : 'Nonaktif'}
                </span>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() =>
                    setPublisherFilters((prev) => ({ ...prev, status: 'ALL', page: 1 }))
                  }
                  aria-label="Hapus filter status"
                >
                  ×
                </button>
              </span>
            )}
            <span style={{ color: 'var(--nb-text-muted)', fontSize: 12 }}>
              (Ditemukan {filteredPublishers.length} penerbit)
            </span>
          </div>

          <button
            type="button"
            className="nb-btn nb-reset-filters-btn"
            onClick={() =>
              setPublisherFilters((prev) => ({
                ...prev,
                search: '',
                status: 'ALL',
                page: 1,
              }))
            }
          >
            <span>Reset Filter</span>
          </button>
        </div>
      )}

      {/* Tabel Penerbit */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : filteredPublishers.length === 0 ? (
        <EmptyState
          title="Tidak Ada Penerbit Ditemukan"
          description={
            publisherFilters.search || publisherFilters.status !== 'ALL'
              ? 'Tidak ada mitra penerbit yang cocok dengan kriteria pencarian.'
              : 'Belum ada mitra penerbit terdaftar. Tambahkan penerbit pertama sekarang.'
          }
          actionLabel="Tambah Penerbit Pertama"
          onAction={onOpenAdd}
        />
      ) : (
        <div className="nb-table-container">
          <table className="nb-table">
            <caption className="visually-hidden">Daftar Mitra Penerbit Buku</caption>
            <thead>
              <tr>
                <th scope="col" style={{ width: 60, textAlign: 'center' }}>
                  Logo
                </th>
                <th
                  scope="col"
                  className="is-sortable"
                  onClick={() => onSort('name')}
                  aria-sort={
                    publisherFilters.sortBy === 'name'
                      ? publisherFilters.sortOrder === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <div className="nb-th-inner">
                    <span>Nama Penerbit</span>
                  </div>
                </th>
                <th
                  scope="col"
                  className="is-sortable"
                  onClick={() => onSort('city')}
                  aria-sort={
                    publisherFilters.sortBy === 'city'
                      ? publisherFilters.sortOrder === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <div className="nb-th-inner">
                    <span>Kota Asal</span>
                  </div>
                </th>
                <th scope="col">Website & Kontak</th>
                <th
                  scope="col"
                  className="is-sortable"
                  style={{ textAlign: 'right', width: 130 }}
                  onClick={() => onSort('ebookCount')}
                  aria-sort={
                    publisherFilters.sortBy === 'ebookCount'
                      ? publisherFilters.sortOrder === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <div className="nb-th-inner" style={{ justifyContent: 'flex-end' }}>
                    <span>E-Book Terbitan</span>
                  </div>
                </th>
                <th scope="col" style={{ width: 110 }}>
                  Status
                </th>
                <th scope="col" style={{ width: 90 }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedPublishers.map((pub) => {
                const cleanName = pub.name.replace('DATA SIMULASI — ', '')
                const initials = cleanName.slice(0, 2).toUpperCase()

                return (
                  <tr key={pub.id}>
                    <td data-label="Logo" style={{ textAlign: 'center', width: 60 }}>
                      <div className="nb-entity-avatar is-publisher">{initials}</div>
                    </td>
                    <td data-label="Nama Penerbit">
                      <span className="font-heading" style={{ fontWeight: 700 }}>
                        {pub.name}
                      </span>
                      {pub.description && (
                        <div
                          style={{
                            fontSize: 12,
                            color: 'var(--nb-text-muted)',
                            marginTop: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {pub.description}
                        </div>
                      )}
                    </td>
                    <td data-label="Kota Asal">{pub.city}</td>
                    <td data-label="Website & Kontak" className="nb-td-mono">
                      {pub.website ? (
                        <a
                          href={pub.website}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: 'var(--nb-focus)', textDecoration: 'underline' }}
                        >
                          {pub.website.replace('https://', '')}
                        </a>
                      ) : pub.contactEmail ? (
                        pub.contactEmail
                      ) : (
                        <span className="nb-td-muted-italic">—</span>
                      )}
                    </td>
                    <td
                      data-label="E-Book Terbitan"
                      className="nb-td-mono nb-td-right"
                      style={{ fontWeight: 700 }}
                    >
                      {pub.ebookCount}
                    </td>
                    <td data-label="Status">
                      {pub.isActive ? (
                        <StatusBadge status="Aktif" fill="var(--nb-green)" />
                      ) : (
                        <StatusBadge status="Nonaktif" fill="var(--nb-muted)" />
                      )}
                    </td>
                    <td data-label="Aksi">
                      <div className="nb-action-btn-group">
                        <button
                          type="button"
                          className="nb-btn nb-table-action-btn"
                          onClick={() => onOpenEdit(pub)}
                          aria-label={`Edit penerbit ${pub.name}`}
                          title="Edit data penerbit"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="nb-btn nb-table-action-btn is-danger"
                          onClick={() => onDelete(pub)}
                          aria-label={`Hapus penerbit ${pub.name}`}
                          title="Hapus mitra penerbit"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <Pagination
            currentPage={publisherFilters.page}
            totalPages={totalPublisherPages}
            totalItems={filteredPublishers.length}
            pageSize={publisherFilters.limit}
            onPageChange={(page) => setPublisherFilters((prev) => ({ ...prev, page }))}
            labelItemName="penerbit"
          />
        </div>
      )}
    </div>
  )
}
