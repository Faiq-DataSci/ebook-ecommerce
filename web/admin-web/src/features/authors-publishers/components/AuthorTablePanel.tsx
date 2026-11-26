import {
  EmptyState,
  FilterChipGroup,
  Pagination,
  SearchInput,
  StatusBadge,
  TableSkeleton,
} from '../../../shared/components/ui'
import type {
  AuthorListItem,
  AuthorStatus,
  AuthorTableFilters,
} from '../types/authorPublisher'

interface AuthorTablePanelProps {
  authors: AuthorListItem[]
  filteredAuthors: AuthorListItem[]
  paginatedAuthors: AuthorListItem[]
  authorFilters: AuthorTableFilters
  totalAuthorPages: number
  isLoading: boolean
  setAuthorFilters: React.Dispatch<React.SetStateAction<AuthorTableFilters>>
  onSort: (column: 'name' | 'ebookCount' | 'createdAt') => void
  onOpenAdd: () => void
  onOpenEdit: (author: AuthorListItem) => void
  onDelete: (author: AuthorListItem) => void
  onRefresh: () => void
}

export function AuthorTablePanel({
  authors,
  filteredAuthors,
  paginatedAuthors,
  authorFilters,
  totalAuthorPages,
  isLoading,
  setAuthorFilters,
  onSort,
  onOpenAdd,
  onOpenEdit,
  onDelete,
  onRefresh,
}: AuthorTablePanelProps) {
  return (
    <div
      id="panel-authors"
      role="tabpanel"
      aria-labelledby="tab-authors"
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {/* Filter Bar Penulis */}
      <div className="catalog-filter-bar">
        <div className="catalog-filter-left">
          <SearchInput
            value={authorFilters.search}
            onChange={(search) =>
              setAuthorFilters((prev) => ({ ...prev, search, page: 1 }))
            }
            onClear={() =>
              setAuthorFilters((prev) => ({ ...prev, search: '', page: 1 }))
            }
            placeholder="Cari nama, afiliasi, atau email..."
            ariaLabel="Cari penulis"
          />

          <FilterChipGroup
            label="Status:"
            icon="tune"
            value={authorFilters.status}
            onChange={(val) =>
              setAuthorFilters((prev) => ({
                ...prev,
                status: val as 'ALL' | AuthorStatus,
                page: 1,
              }))
            }
            options={[
              {
                value: 'ALL',
                label: 'Semua Status',
                count: authors.length,
                icon: 'apps',
                activeBg: 'var(--nb-yellow)',
              },
              {
                value: 'AKTIF',
                label: 'Aktif',
                count: authors.filter((a) => a.isActive).length,
                icon: 'check_circle',
                activeBg: 'var(--nb-green)',
              },
              {
                value: 'NONAKTIF',
                label: 'Nonaktif',
                count: authors.filter((a) => !a.isActive).length,
                icon: 'do_not_disturb_on',
                activeBg: 'var(--nb-muted)',
              },
            ]}
          />
        </div>

        <div className="catalog-filter-right">
          <button
            type="button"
            className="nb-btn nb-page-btn"
            onClick={onRefresh}
            title="Segarkan data tabel penulis"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              refresh
            </span>
          </button>
        </div>
      </div>

      {/* Active Filter Strip Penulis */}
      {(authorFilters.search || authorFilters.status !== 'ALL') && (
        <div className="nb-active-filter-strip">
          <div className="nb-active-tags">
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              Filter Aktif:
            </span>
            {authorFilters.search && (
              <span className="nb-active-tag-badge">
                <span>Cari: &ldquo;{authorFilters.search}&rdquo;</span>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() =>
                    setAuthorFilters((prev) => ({ ...prev, search: '', page: 1 }))
                  }
                  aria-label="Hapus filter pencarian"
                >
                  ×
                </button>
              </span>
            )}
            {authorFilters.status !== 'ALL' && (
              <span className="nb-active-tag-badge">
                <span>
                  Status: {authorFilters.status === 'AKTIF' ? 'Aktif' : 'Nonaktif'}
                </span>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() =>
                    setAuthorFilters((prev) => ({ ...prev, status: 'ALL', page: 1 }))
                  }
                  aria-label="Hapus filter status"
                >
                  ×
                </button>
              </span>
            )}
            <span style={{ color: 'var(--nb-text-muted)', fontSize: 12 }}>
              (Ditemukan {filteredAuthors.length} penulis)
            </span>
          </div>

          <button
            type="button"
            className="nb-btn nb-reset-filters-btn"
            onClick={() =>
              setAuthorFilters((prev) => ({
                ...prev,
                search: '',
                status: 'ALL',
                page: 1,
              }))
            }
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              close
            </span>
            <span>Reset Filter</span>
          </button>
        </div>
      )}

      {/* Tabel Penulis */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : filteredAuthors.length === 0 ? (
        <EmptyState
          title="Tidak Ada Penulis Ditemukan"
          description={
            authorFilters.search || authorFilters.status !== 'ALL'
              ? 'Tidak ada profil penulis yang cocok dengan kriteria pencarian.'
              : 'Belum ada profil penulis terdaftar. Tambahkan penulis pertama sekarang.'
          }
          icon="person"
          actionLabel="+ Tambah Penulis Pertama"
          onAction={onOpenAdd}
        />
      ) : (
        <div className="nb-table-container">
          <table className="nb-table">
            <caption className="visually-hidden">Daftar Penulis Buku Digital</caption>
            <thead>
              <tr>
                <th scope="col" style={{ width: 60, textAlign: 'center' }}>
                  Profil
                </th>
                <th
                  scope="col"
                  className="is-sortable"
                  onClick={() => onSort('name')}
                  aria-sort={
                    authorFilters.sortBy === 'name'
                      ? authorFilters.sortOrder === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <div className="nb-th-inner">
                    <span>Nama Penulis</span>
                    <span className="material-symbols-outlined nb-sort-icon">
                      {authorFilters.sortBy === 'name'
                        ? authorFilters.sortOrder === 'asc'
                          ? 'arrow_upward'
                          : 'arrow_downward'
                        : 'unfold_more'}
                    </span>
                  </div>
                </th>
                <th scope="col">Afiliasi & Keahlian</th>
                <th scope="col">Email Kontak</th>
                <th
                  scope="col"
                  className="is-sortable"
                  style={{ textAlign: 'right', width: 130 }}
                  onClick={() => onSort('ebookCount')}
                  aria-sort={
                    authorFilters.sortBy === 'ebookCount'
                      ? authorFilters.sortOrder === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <div className="nb-th-inner" style={{ justifyContent: 'flex-end' }}>
                    <span>E-Book Ditulis</span>
                    <span className="material-symbols-outlined nb-sort-icon">
                      {authorFilters.sortBy === 'ebookCount'
                        ? authorFilters.sortOrder === 'asc'
                          ? 'arrow_upward'
                          : 'arrow_downward'
                        : 'unfold_more'}
                    </span>
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
              {paginatedAuthors.map((author) => {
                const cleanName = author.name.replace('DATA SIMULASI — ', '')
                const initials = cleanName.slice(0, 2).toUpperCase()

                return (
                  <tr key={author.id}>
                    <td data-label="Profil" style={{ textAlign: 'center', width: 60 }}>
                      <div className="nb-entity-avatar">{initials}</div>
                    </td>
                    <td data-label="Nama Penulis">
                      <span className="font-heading" style={{ fontWeight: 700 }}>
                        {author.name}
                      </span>
                      {author.bio && (
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
                          {author.bio}
                        </div>
                      )}
                    </td>
                    <td data-label="Afiliasi & Keahlian">{author.affiliation}</td>
                    <td data-label="Email Kontak" className="nb-td-mono">
                      {author.email}
                    </td>
                    <td
                      data-label="E-Book Ditulis"
                      className="nb-td-mono nb-td-right"
                      style={{ fontWeight: 700 }}
                    >
                      {author.ebookCount}
                    </td>
                    <td data-label="Status">
                      {author.isActive ? (
                        <StatusBadge
                          status="Aktif"
                          fill="var(--nb-green)"
                          icon="check_circle"
                        />
                      ) : (
                        <StatusBadge
                          status="Nonaktif"
                          fill="var(--nb-muted)"
                          icon="do_not_disturb_on"
                        />
                      )}
                    </td>
                    <td data-label="Aksi">
                      <div className="nb-action-btn-group">
                        <button
                          type="button"
                          className="nb-btn nb-table-action-btn"
                          onClick={() => onOpenEdit(author)}
                          aria-label={`Ubah profil ${author.name}`}
                          title="Ubah profil penulis"
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 18 }}
                            aria-hidden="true"
                          >
                            edit
                          </span>
                        </button>
                        <button
                          type="button"
                          className="nb-btn nb-table-action-btn is-danger"
                          onClick={() => onDelete(author)}
                          aria-label={`Hapus profil ${author.name}`}
                          title="Hapus profil penulis"
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 18 }}
                            aria-hidden="true"
                          >
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <Pagination
            currentPage={authorFilters.page}
            totalPages={totalAuthorPages}
            totalItems={filteredAuthors.length}
            pageSize={authorFilters.limit}
            onPageChange={(page) => setAuthorFilters((prev) => ({ ...prev, page }))}
            labelItemName="penulis"
          />
        </div>
      )}
    </div>
  )
}
