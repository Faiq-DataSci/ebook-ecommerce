import type { RefObject } from 'react'
import { SimulationBadge } from '../../../shared/components/ui'

interface CategoryPageHeaderProps {
  addButtonRef?: RefObject<HTMLButtonElement | null>
  onAddClick: () => void
}

export function CategoryPageHeader({
  addButtonRef,
  onAddClick,
}: CategoryPageHeaderProps) {
  return (
    <header className="catalog-page-header">
      <div className="catalog-title-group">
        <div className="catalog-header-title-row">
          <h1 className="catalog-page-title">Kategori &amp; Tag</h1>
          <SimulationBadge />
        </div>
        <p className="catalog-page-subtitle">
          Kelola taksonomi, label klasifikasi, dan status aktivasi kategori
          e-book.
        </p>
      </div>

      <button
        ref={addButtonRef}
        type="button"
        className="nb-btn catalog-primary-btn"
        onClick={onAddClick}
      >
        <span>Tambah Kategori</span>
      </button>
    </header>
  )
}
