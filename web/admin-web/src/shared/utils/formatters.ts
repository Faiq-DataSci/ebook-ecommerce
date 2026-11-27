/**
 * Shared utility functions for formatting currency, dates, and percentages
 * Following Neo-Brutalism data presentation standards
 */

export function formatRupiah(amount: string | number): string {
  const num =
    typeof amount === 'string'
      ? parseInt(amount.replace(/\D/g, ''), 10)
      : amount
  if (Number.isNaN(num)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}
