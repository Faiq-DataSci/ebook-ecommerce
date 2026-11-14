import type { SidebarNavGroup, SidebarSubmenuItem } from '../types/admin'

export const ADMIN_NAVIGATION_GROUPS: SidebarNavGroup[] = [
  {
    id: 'group-utama',
    heading: 'UTAMA',
    entries: [
      {
        type: 'single',
        id: 'dashboard',
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: 'grid_view',
        breadcrumb: 'DASHBOARD',
        implemented: true,
      },
    ],
  },
  {
    id: 'group-operasional',
    heading: 'OPERASIONAL & TOKO',
    entries: [
      {
        type: 'dropdown',
        id: 'submenu-katalog',
        label: 'Katalog & Produk',
        icon: 'menu_book',
        hoverVariant: 'hover-amber',
        children: [
          {
            id: 'koleksi-ebook',
            label: 'Koleksi E-Book',
            path: '/admin/katalog/ebook',
            breadcrumb: 'KOLEKSI E-BOOK',
            badge: { text: '420', bgColor: '#FFD23F' },
            implemented: false,
          },
          {
            id: 'kategori-tag',
            label: 'Kategori & Tag',
            path: '/admin/katalog/kategori',
            breadcrumb: 'KATEGORI & TAG',
            implemented: false,
          },
          {
            id: 'penulis-penerbit',
            label: 'Penulis & Penerbit',
            path: '/admin/katalog/penulis',
            breadcrumb: 'PENULIS & PENERBIT',
            implemented: false,
          },
        ],
      },
      {
        type: 'dropdown',
        id: 'submenu-transaksi',
        label: 'Transaksi & Keuangan',
        icon: 'shopping_cart',
        hoverVariant: 'hover-sky',
        children: [
          {
            id: 'semua-pesanan',
            label: 'Semua Pesanan',
            path: '/admin/transaksi/pesanan',
            breadcrumb: 'SEMUA PESANAN',
            badge: { text: '142', bgColor: '#74B9FF' },
            implemented: false,
          },
          {
            id: 'verifikasi-bayar',
            label: 'Verifikasi Bayar',
            path: '/admin/transaksi/verifikasi',
            breadcrumb: 'VERIFIKASI BAYAR',
            badge: { text: '5', bgColor: '#FF6B6B' },
            implemented: false,
          },
          {
            id: 'laporan-omzet',
            label: 'Laporan Omzet',
            path: '/admin/transaksi/laporan',
            breadcrumb: 'LAPORAN OMZET',
            implemented: false,
          },
        ],
      },
    ],
  },
  {
    id: 'group-intelijen',
    heading: 'INTELIJEN & SISTEM',
    entries: [
      {
        type: 'single',
        id: 'analitik-bisnis',
        label: 'Analitik Bisnis',
        path: '/admin/analitik',
        icon: 'analytics',
        breadcrumb: 'ANALITIK BISNIS',
        implemented: false,
      },
      {
        type: 'dropdown',
        id: 'submenu-spk',
        label: 'SPK & Rekomendasi',
        icon: 'stars',
        hoverVariant: 'hover-purple',
        children: [
          {
            id: 'kriteria-bobot',
            label: 'Kriteria & Bobot',
            path: '/admin/spk/kriteria',
            breadcrumb: 'KRITERIA & BOBOT',
            implemented: false,
          },
          {
            id: 'matriks-saw',
            label: 'Matriks SAW',
            path: '/admin/spk/matriks',
            breadcrumb: 'MATRIKS SAW',
            badge: { text: 'v2.1', bgColor: '#88D498' },
            implemented: false,
          },
        ],
      },
      {
        type: 'dropdown',
        id: 'submenu-sistem',
        label: 'Manajemen Sistem',
        icon: 'tune',
        hoverVariant: 'hover-emerald',
        children: [
          {
            id: 'pelanggan-user',
            label: 'Pelanggan & User',
            path: '/admin/sistem/pelanggan',
            breadcrumb: 'PELANGGAN & USER',
            badge: { text: '3.8k', bgColor: '#B8A9FA' },
            implemented: false,
          },
          {
            id: 'lisensi-drm',
            label: 'Lisensi & DRM',
            path: '/admin/sistem/drm',
            breadcrumb: 'LISENSI & DRM',
            implemented: false,
          },
          {
            id: 'pengaturan',
            label: 'Pengaturan',
            path: '/admin/sistem/pengaturan',
            breadcrumb: 'PENGATURAN',
            implemented: false,
          },
        ],
      },
    ],
  },
]

export interface ResolvedRouteMeta {
  id: string
  label: string
  path: string
  breadcrumb: string
  parentDropdownId?: string
  parentLabel?: string
  implemented: boolean
}

export function resolveRouteMeta(pathname: string): ResolvedRouteMeta {
  const normalized =
    pathname === '/' || pathname === '/admin' ? '/admin/dashboard' : pathname

  for (const group of ADMIN_NAVIGATION_GROUPS) {
    for (const entry of group.entries) {
      if (entry.type === 'single' && entry.path === normalized) {
        return {
          id: entry.id,
          label: entry.label,
          path: entry.path,
          breadcrumb: entry.breadcrumb,
          implemented: entry.implemented,
        }
      }
      if (entry.type === 'dropdown') {
        const match: SidebarSubmenuItem | undefined = entry.children.find(
          (child) => child.path === normalized,
        )
        if (match) {
          return {
            id: match.id,
            label: match.label,
            path: match.path,
            breadcrumb: match.breadcrumb,
            parentDropdownId: entry.id,
            parentLabel: entry.label,
            implemented: match.implemented,
          }
        }
      }
    }
  }

  return {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
    breadcrumb: 'DASHBOARD',
    implemented: true,
  }
}
