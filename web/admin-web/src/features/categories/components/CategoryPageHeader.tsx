import type { RefObject } from 'react'
import { SimulationBadge } from '../../../shared/components/ui'

interface CategoryPageHeaderProps {
  addButtonRef?: RefObject<HTMLButtonElement | null>
  isSimulation?: boolean
  onAddClick: () => void
}

export function CategoryPageHeader({
  addButtonRef,
  isSimulation = false,
  onAddClick,
}: CategoryPageHeaderProps) {
  return (
    <header className="catalog-page-header">
      <div className="catalog-title-group">
        <div className="catalog-header-title-row">
          <h1 className="catalog-page-title">Kategori &amp; Tag</h1>
          {isSimulation && <SimulationBadge />}
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
