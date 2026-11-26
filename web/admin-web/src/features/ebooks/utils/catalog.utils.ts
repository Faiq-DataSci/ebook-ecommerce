export function getCategoryMeta(slug?: string): { icon: string; activeBg: string } {
  switch (slug) {
    case 'rekayasa-perangkat-lunak':
      return { icon: 'code', activeBg: 'var(--nb-blue)' }
    case 'sains-data-kecerdasan-buatan':
      return { icon: 'psychology', activeBg: 'var(--nb-lavender)' }
    case 'basis-data-cloud':
      return { icon: 'database', activeBg: '#FEF3C7' }
    case 'keamanan-siber':
      return { icon: 'security', activeBg: '#E0F2FE' }
    case 'desain-ui-ux':
      return { icon: 'palette', activeBg: '#D1FAE5' }
    default:
      return { icon: 'folder', activeBg: 'var(--nb-muted)' }
  }
}

export function formatRupiah(val: string | number): string {
  const num = typeof val === 'string' ? parseInt(val.replace(/\D/g, ''), 10) : val
  if (isNaN(num)) return 'Rp 0'
  return `Rp ${num.toLocaleString('id-ID')}`
}
