import {
  CatalogKpiGrid,
  type CatalogKpiItem,
} from '../../../shared/components/ui'
import type {
  CategoryStatus,
  CategorySummaryMetrics,
} from '../types/category'

interface CategorySummaryCardsProps {
  metrics: CategorySummaryMetrics
  activeStatus: 'ALL' | CategoryStatus
  isLoading: boolean
  onSelectStatus: (status: 'ALL' | CategoryStatus) => void
}

export function CategorySummaryCards({
  metrics,
  activeStatus,
  isLoading,
  onSelectStatus,
}: CategorySummaryCardsProps) {
  const items: CatalogKpiItem[] = [
    {
      id: 'total-categories',
      label: 'Total Kategori',
      value: metrics.totalCategories,
      unit: 'kategori',
      subtext:
        metrics.emptyCategories > 0
          ? `${metrics.emptyCategories} kategori belum memiliki e-book`
          : 'Semua kategori sudah memiliki e-book',
      tone: 'yellow',
      isSelected: activeStatus === 'ALL',
      onClick: () => onSelectStatus('ALL'),
    },
    {
      id: 'active-categories',
      label: 'Kategori Aktif',
      value: metrics.activeCategories,
      unit: 'aktif',
      subtext: `${metrics.activePercentage}% tampil di katalog e-book`,
      tone: 'green',
      isSelected: activeStatus === 'AKTIF',
      onClick: () => onSelectStatus('AKTIF'),
    },
    {
      id: 'inactive-categories',
      label: 'Kategori Nonaktif',
      value: metrics.inactiveCategories,
      unit: 'nonaktif',
      subtext: 'Disembunyikan dari pilihan form e-book',
      tone: 'muted',
      isSelected: activeStatus === 'NONAKTIF',
      onClick: () => onSelectStatus('NONAKTIF'),
    },
    {
      id: 'linked-ebooks',
      label: 'Total E-Book Terkait',
      value: metrics.totalLinkedEbooks,
      unit: 'e-book',
      subtext: `Rata-rata ${metrics.avgEbooksPerCategory} e-book per kategori`,
      tone: 'blue',
    },
  ]

  return (
    <CatalogKpiGrid
      items={items}
      ariaLabel="Ringkasan metrik kategori dan tag"
      isLoading={isLoading}
    />
  )
}
