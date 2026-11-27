export type PageSkeletonVariant =
  | 'dashboard'
  | 'table'
  | 'tabs-table'
  | 'analytics'
  | 'spk'
  | 'settings'
  | 'form'

export function resolveSkeletonVariant(pathname: string): PageSkeletonVariant {
  if (
    pathname === '/admin/dashboard' ||
    pathname === '/admin' ||
    pathname === '/'
  ) {
    return 'dashboard'
  }
  if (pathname === '/admin/katalog/tambah') {
    return 'form'
  }
  if (
    pathname.startsWith('/admin/transaksi/') ||
    pathname.startsWith('/admin/keuangan/')
  ) {
    return 'tabs-table'
  }
  if (pathname === '/admin/analitik') {
    return 'analytics'
  }
  if (pathname.startsWith('/admin/spk/')) {
    return 'spk'
  }
  if (pathname === '/admin/sistem/pengaturan') {
    return 'settings'
  }
  return 'table'
}
