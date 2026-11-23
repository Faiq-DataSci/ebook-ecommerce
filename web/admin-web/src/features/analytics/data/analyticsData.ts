import type {
  AnalyticsDataset,
  AnalyticsPeriod,
  CategoryBreakdownItem,
  FunnelStage,
  PaymentMethodShare,
  TimeSeriesPoint,
  TopPerformingEbook,
} from '../types/analytics'

// Helper formatter
const formatRupiah = (val: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val)
}

// ============================================================================
// DATA SIMULASI: Seri Waktu Harian (30 Hari Terakhir)
// ============================================================================
export const MOCK_DAILY_SERIES: TimeSeriesPoint[] = [
  {
    date: '2026-10-25',
    label: '25 Okt',
    revenue: 1450000,
    revenueFormatted: 'Rp 1.450.000',
    units: 18,
    orders: 16,
    sawInfluencedUnits: 7,
  },
  {
    date: '2026-10-26',
    label: '26 Okt',
    revenue: 1850000,
    revenueFormatted: 'Rp 1.850.000',
    units: 24,
    orders: 21,
    sawInfluencedUnits: 10,
  },
  {
    date: '2026-10-27',
    label: '27 Okt',
    revenue: 2100000,
    revenueFormatted: 'Rp 2.100.000',
    units: 26,
    orders: 22,
    sawInfluencedUnits: 12,
  },
  {
    date: '2026-10-28',
    label: '28 Okt',
    revenue: 1600000,
    revenueFormatted: 'Rp 1.600.000',
    units: 20,
    orders: 18,
    sawInfluencedUnits: 8,
  },
  {
    date: '2026-10-29',
    label: '29 Okt',
    revenue: 2450000,
    revenueFormatted: 'Rp 2.450.000',
    units: 31,
    orders: 27,
    sawInfluencedUnits: 15,
  },
  {
    date: '2026-10-30',
    label: '30 Okt',
    revenue: 2900000,
    revenueFormatted: 'Rp 2.900.000',
    units: 36,
    orders: 32,
    sawInfluencedUnits: 18,
  },
  {
    date: '2026-10-31',
    label: '31 Okt',
    revenue: 3400000,
    revenueFormatted: 'Rp 3.400.000',
    units: 42,
    orders: 38,
    sawInfluencedUnits: 22,
  },
  {
    date: '2026-11-01',
    label: '01 Nov',
    revenue: 3800000,
    revenueFormatted: 'Rp 3.800.000',
    units: 48,
    orders: 41,
    sawInfluencedUnits: 25,
  },
  {
    date: '2026-11-02',
    label: '02 Nov',
    revenue: 2700000,
    revenueFormatted: 'Rp 2.700.000',
    units: 33,
    orders: 29,
    sawInfluencedUnits: 16,
  },
  {
    date: '2026-11-03',
    label: '03 Nov',
    revenue: 2250000,
    revenueFormatted: 'Rp 2.250.000',
    units: 28,
    orders: 25,
    sawInfluencedUnits: 13,
  },
  {
    date: '2026-11-04',
    label: '04 Nov',
    revenue: 2600000,
    revenueFormatted: 'Rp 2.600.000',
    units: 32,
    orders: 28,
    sawInfluencedUnits: 15,
  },
  {
    date: '2026-11-05',
    label: '05 Nov',
    revenue: 3100000,
    revenueFormatted: 'Rp 3.100.000',
    units: 39,
    orders: 35,
    sawInfluencedUnits: 19,
  },
  {
    date: '2026-11-06',
    label: '06 Nov',
    revenue: 2950000,
    revenueFormatted: 'Rp 2.950.000',
    units: 37,
    orders: 33,
    sawInfluencedUnits: 18,
  },
  {
    date: '2026-11-07',
    label: '07 Nov',
    revenue: 3550000,
    revenueFormatted: 'Rp 3.550.000',
    units: 44,
    orders: 39,
    sawInfluencedUnits: 23,
  },
  {
    date: '2026-11-08',
    label: '08 Nov',
    revenue: 4100000,
    revenueFormatted: 'Rp 4.100.000',
    units: 52,
    orders: 45,
    sawInfluencedUnits: 28,
  },
  {
    date: '2026-11-09',
    label: '09 Nov',
    revenue: 2800000,
    revenueFormatted: 'Rp 2.800.000',
    units: 35,
    orders: 31,
    sawInfluencedUnits: 17,
  },
  {
    date: '2026-11-10',
    label: '10 Nov',
    revenue: 2400000,
    revenueFormatted: 'Rp 2.400.000',
    units: 30,
    orders: 26,
    sawInfluencedUnits: 14,
  },
  {
    date: '2026-11-11',
    label: '11 Nov',
    revenue: 5250000,
    revenueFormatted: 'Rp 5.250.000',
    units: 68,
    orders: 58,
    sawInfluencedUnits: 38,
  },
  {
    date: '2026-11-12',
    label: '12 Nov',
    revenue: 3300000,
    revenueFormatted: 'Rp 3.300.000',
    units: 41,
    orders: 36,
    sawInfluencedUnits: 21,
  },
  {
    date: '2026-11-13',
    label: '13 Nov',
    revenue: 3150000,
    revenueFormatted: 'Rp 3.150.000',
    units: 39,
    orders: 34,
    sawInfluencedUnits: 20,
  },
  {
    date: '2026-11-14',
    label: '14 Nov',
    revenue: 3750000,
    revenueFormatted: 'Rp 3.750.000',
    units: 46,
    orders: 40,
    sawInfluencedUnits: 24,
  },
  {
    date: '2026-11-15',
    label: '15 Nov',
    revenue: 4400000,
    revenueFormatted: 'Rp 4.400.000',
    units: 55,
    orders: 48,
    sawInfluencedUnits: 30,
  },
  {
    date: '2026-11-16',
    label: '16 Nov',
    revenue: 3200000,
    revenueFormatted: 'Rp 3.200.000',
    units: 40,
    orders: 35,
    sawInfluencedUnits: 19,
  },
  {
    date: '2026-11-17',
    label: '17 Nov',
    revenue: 2900000,
    revenueFormatted: 'Rp 2.900.000',
    units: 36,
    orders: 32,
    sawInfluencedUnits: 18,
  },
  {
    date: '2026-11-18',
    label: '18 Nov',
    revenue: 3600000,
    revenueFormatted: 'Rp 3.600.000',
    units: 45,
    orders: 39,
    sawInfluencedUnits: 24,
  },
  {
    date: '2026-11-19',
    label: '19 Nov',
    revenue: 4050000,
    revenueFormatted: 'Rp 4.050.000',
    units: 50,
    orders: 44,
    sawInfluencedUnits: 27,
  },
  {
    date: '2026-11-20',
    label: '20 Nov',
    revenue: 3850000,
    revenueFormatted: 'Rp 3.850.000',
    units: 48,
    orders: 42,
    sawInfluencedUnits: 25,
  },
  {
    date: '2026-11-21',
    label: '21 Nov',
    revenue: 4600000,
    revenueFormatted: 'Rp 4.600.000',
    units: 58,
    orders: 50,
    sawInfluencedUnits: 32,
  },
  {
    date: '2026-11-22',
    label: '22 Nov',
    revenue: 4900000,
    revenueFormatted: 'Rp 4.900.000',
    units: 62,
    orders: 53,
    sawInfluencedUnits: 34,
  },
  {
    date: '2026-11-23',
    label: '23 Nov (Hari Ini)',
    labelShort: 'Hari Ini',
    revenue: 3100000,
    revenueFormatted: 'Rp 3.100.000',
    units: 38,
    orders: 34,
    sawInfluencedUnits: 21,
  } as TimeSeriesPoint & { labelShort?: string },
]

// ============================================================================
// DATA SIMULASI: Breakdown Kategori E-Book
// ============================================================================
export const MOCK_CATEGORY_BREAKDOWN: CategoryBreakdownItem[] = [
  {
    id: 'cat-rpl',
    name: 'Rekayasa Perangkat Lunak',
    slug: 'rekayasa-perangkat-lunak',
    color: '#74B9FF', // nb-blue
    revenue: 34250000,
    revenueFormatted: 'Rp 34.250.000',
    percentage: 36.8,
    unitsSold: 428,
    activeBookCount: 14,
    topBookTitle: 'DATA SIMULASI — Arsitektur Microservices Modern',
  },
  {
    id: 'cat-data-ai',
    name: 'Sains Data & Kecerdasan Buatan',
    slug: 'sains-data-kecerdasan-buatan',
    color: '#B8A9FA', // nb-lavender
    revenue: 26800000,
    revenueFormatted: 'Rp 26.800.000',
    percentage: 28.8,
    unitsSold: 320,
    activeBookCount: 9,
    topBookTitle: 'DATA SIMULASI — Machine Learning Terapan dengan Python',
  },
  {
    id: 'cat-cloud',
    name: 'Basis Data & Cloud',
    slug: 'basis-data-cloud',
    color: '#FFEAA7', // nb-yellow
    revenue: 15400000,
    revenueFormatted: 'Rp 15.400.000',
    percentage: 16.5,
    unitsSold: 198,
    activeBookCount: 8,
    topBookTitle: 'DATA SIMULASI — PostgreSQL High Availability & Replication',
  },
  {
    id: 'cat-security',
    name: 'Keamanan Siber',
    slug: 'keamanan-siber',
    color: '#FF7675', // nb-pink
    revenue: 10250000,
    revenueFormatted: 'Rp 10.250.000',
    percentage: 11.0,
    unitsSold: 115,
    activeBookCount: 5,
    topBookTitle: 'DATA SIMULASI — Panduan Praktis Penetration Testing',
  },
  {
    id: 'cat-uiux',
    name: 'Desain UI/UX & Produk',
    slug: 'desain-ui-ux',
    color: '#88D498', // nb-green
    revenue: 6400000,
    revenueFormatted: 'Rp 6.400.000',
    percentage: 6.9,
    unitsSold: 84,
    activeBookCount: 6,
    topBookTitle: 'DATA SIMULASI — Desain Sistem Antarmuka Neubrutalisme',
  },
]

// ============================================================================
// DATA SIMULASI: Corong Konversi Pembayaran (Conversion Funnel)
// ============================================================================
export const MOCK_FUNNEL_STAGES: FunnelStage[] = [
  {
    id: 'stage-views',
    label: 'Eksplorasi Katalog',
    count: 14250,
    formattedCount: '14.250 Kunjungan',
    percentageOfTotal: 100,
    icon: 'menu_book',
    color: '#74B9FF',
    description: 'Pengunjung aktif menelusuri etalase e-book dan detail buku.',
  },
  {
    id: 'stage-cart',
    label: 'Tambah ke Keranjang',
    count: 3420,
    formattedCount: '3.420 Item',
    percentageOfTotal: 24.0,
    dropOffRate: 76.0,
    icon: 'add_shopping_cart',
    color: '#FFEAA7',
    description: 'Pengunjung memasukkan e-book ke daftar pesanan siap beli.',
  },
  {
    id: 'stage-checkout',
    label: 'Inisiasi Checkout',
    count: 1560,
    formattedCount: '1.560 Invoice',
    percentageOfTotal: 10.9,
    dropOffRate: 54.4,
    icon: 'receipt_long',
    color: '#B8A9FA',
    description: 'Pembuatan kode tagihan resmi & pemilihan metode pembayaran.',
  },
  {
    id: 'stage-paid',
    label: 'Pembayaran Terverifikasi (Lunas)',
    count: 1145,
    formattedCount: '1.145 Transaksi',
    percentageOfTotal: 8.0,
    dropOffRate: 26.6,
    icon: 'verified',
    color: '#88D498',
    description: 'Webhook gateway terkonfirmasi, lisensi DRM & EbookAccess terbit.',
  },
]

// ============================================================================
// DATA SIMULASI: Pangsa Metode Pembayaran
// ============================================================================
export const MOCK_PAYMENT_SHARES: PaymentMethodShare[] = [
  {
    id: 'pay-qris',
    name: 'QRIS (GoPay, ShopeePay, Dana, BCA Mobile)',
    category: 'QRIS',
    sharePercentage: 54.2,
    transactionCount: 620,
    volumeFormatted: 'Rp 50.450.000',
    successRate: 97.4,
    color: '#88D498',
  },
  {
    id: 'pay-va',
    name: 'Virtual Account (BCA, Mandiri, BNI, BRI)',
    category: 'VIRTUAL_ACCOUNT',
    sharePercentage: 33.6,
    transactionCount: 385,
    volumeFormatted: 'Rp 31.280.000',
    successRate: 91.2,
    color: '#74B9FF',
  },
  {
    id: 'pay-card',
    name: 'Kartu Kredit / Debit Visa & Mastercard',
    category: 'CREDIT_CARD',
    sharePercentage: 12.2,
    transactionCount: 140,
    volumeFormatted: 'Rp 11.370.000',
    successRate: 88.6,
    color: '#FFEAA7',
  },
]

// ============================================================================
// DATA SIMULASI: Matriks Performa E-Book Teratas
// ============================================================================
export const MOCK_TOP_EBOOKS: TopPerformingEbook[] = [
  {
    id: 'eb-01',
    title: 'DATA SIMULASI — Arsitektur Microservices Modern dengan Node.js & Go',
    author: 'DATA SIMULASI — Budi Raharjo & Tim',
    category: 'Rekayasa Perangkat Lunak',
    coverUrl: null,
    price: 'Rp 120.000',
    unitsSold: 185,
    totalRevenue: 'Rp 22.200.000',
    revenueNumeric: 22200000,
    conversionRate: '6.4%',
    rating: '4.92',
    sawScore: 0.948,
    sawRank: 1,
    growthRate: 24.5,
  },
  {
    id: 'eb-02',
    title: 'DATA SIMULASI — Machine Learning Terapan dengan Python dan Scikit-Learn',
    author: 'DATA SIMULASI — Dr. Eng. Rian Pratama',
    category: 'Sains Data & AI',
    coverUrl: null,
    price: 'Rp 95.000',
    unitsSold: 154,
    totalRevenue: 'Rp 14.630.000',
    revenueNumeric: 14630000,
    conversionRate: '5.8%',
    rating: '4.88',
    sawScore: 0.912,
    sawRank: 2,
    growthRate: 18.2,
  },
  {
    id: 'eb-03',
    title: 'DATA SIMULASI — PostgreSQL High Availability, Replication, & Tuning',
    author: 'DATA SIMULASI — Hendra Kusuma',
    category: 'Basis Data & Cloud',
    coverUrl: null,
    price: 'Rp 85.000',
    unitsSold: 128,
    totalRevenue: 'Rp 10.880.000',
    revenueNumeric: 10880000,
    conversionRate: '5.1%',
    rating: '4.85',
    sawScore: 0.885,
    sawRank: 3,
    growthRate: 14.0,
  },
  {
    id: 'eb-04',
    title: 'DATA SIMULASI — Panduan Lengkap Clean Code & Refactoring di TypeScript',
    author: 'DATA SIMULASI — Budi Raharjo',
    category: 'Rekayasa Perangkat Lunak',
    coverUrl: null,
    price: 'Rp 75.000',
    unitsSold: 110,
    totalRevenue: 'Rp 8.250.000',
    revenueNumeric: 8250000,
    conversionRate: '4.6%',
    rating: '4.78',
    sawScore: 0.854,
    sawRank: 4,
    growthRate: 9.8,
  },
  {
    id: 'eb-05',
    title: 'DATA SIMULASI — Panduan Praktis Penetration Testing & Web Security',
    author: 'DATA SIMULASI — Ahmad Fauzi',
    category: 'Keamanan Siber',
    coverUrl: null,
    price: 'Rp 90.000',
    unitsSold: 92,
    totalRevenue: 'Rp 8.280.000',
    revenueNumeric: 8280000,
    conversionRate: '4.3%',
    rating: '4.75',
    sawScore: 0.832,
    sawRank: 5,
    growthRate: 11.4,
  },
  {
    id: 'eb-06',
    title: 'DATA SIMULASI — Desain Sistem Antarmuka Neubrutalisme untuk Web Modern',
    author: 'DATA SIMULASI — Siti Sarah',
    category: 'Desain UI/UX',
    coverUrl: null,
    price: 'Rp 70.000',
    unitsSold: 84,
    totalRevenue: 'Rp 5.880.000',
    revenueNumeric: 5880000,
    conversionRate: '3.9%',
    rating: '4.80',
    sawScore: 0.796,
    sawRank: 6,
    growthRate: 16.7,
  },
  {
    id: 'eb-07',
    title: 'DATA SIMULASI — Deep Learning & Computer Vision untuk Pemula',
    author: 'DATA SIMULASI — Dr. Eng. Rian Pratama',
    category: 'Sains Data & AI',
    coverUrl: null,
    price: 'Rp 110.000',
    unitsSold: 76,
    totalRevenue: 'Rp 8.360.000',
    revenueNumeric: 8360000,
    conversionRate: '3.7%',
    rating: '4.72',
    sawScore: 0.784,
    sawRank: 7,
    growthRate: 8.3,
  },
  {
    id: 'eb-08',
    title: 'DATA SIMULASI — Panduan DevSecOps & Otomasi CI/CD Pipeline',
    author: 'DATA SIMULASI — Ahmad Fauzi & Hendra Kusuma',
    category: 'Keamanan Siber',
    coverUrl: null,
    price: 'Rp 85.000',
    unitsSold: 65,
    totalRevenue: 'Rp 5.525.000',
    revenueNumeric: 5525000,
    conversionRate: '3.4%',
    rating: '4.68',
    sawScore: 0.762,
    sawRank: 8,
    growthRate: 5.2,
  },
]

// ============================================================================
// DATASET GENERATOR SESUAI PERIODE
// ============================================================================
export function getAnalyticsDataset(
  period: AnalyticsPeriod,
  customStart?: string,
  customEnd?: string,
): AnalyticsDataset {
  let periodLabel = ''
  let seriesSlice: TimeSeriesPoint[] = []
  let multiplier = 1

  switch (period) {
    case '7D':
      periodLabel = '7 Hari Terakhir (17 Nov - 23 Nov 2026)'
      seriesSlice = MOCK_DAILY_SERIES.slice(-7)
      multiplier = 0.28
      break
    case '30D':
      periodLabel = '30 Hari Terakhir (25 Okt - 23 Nov 2026)'
      seriesSlice = MOCK_DAILY_SERIES
      multiplier = 1.0
      break
    case '90D':
      periodLabel = 'Triwulan Ini (Sep - Nov 2026)'
      // Agregasi 12 minggu
      seriesSlice = MOCK_DAILY_SERIES
      multiplier = 2.65
      break
    case 'YTD':
      periodLabel = 'Tahun Berjalan (1 Jan - 23 Nov 2026)'
      seriesSlice = MOCK_DAILY_SERIES
      multiplier = 8.4
      break
    case 'CUSTOM':
      periodLabel = `Rentang Kustom (${customStart || 'Awal'} s/d ${customEnd || 'Hari Ini'})`
      seriesSlice = MOCK_DAILY_SERIES.slice(-14)
      multiplier = 0.55
      break
  }

  // Hitung total agregasi dari series
  const totalRev = seriesSlice.reduce((acc, p) => acc + p.revenue, 0) * (period === '90D' || period === 'YTD' ? multiplier : 1)
  const totalUnits = Math.round(seriesSlice.reduce((acc, p) => acc + p.units, 0) * (period === '90D' || period === 'YTD' ? multiplier : 1))
  const totalOrders = Math.round(seriesSlice.reduce((acc, p) => acc + p.orders, 0) * (period === '90D' || period === 'YTD' ? multiplier : 1))
  const aov = totalOrders > 0 ? Math.round(totalRev / totalOrders) : 0

  return {
    period,
    periodLabel,
    kpis: [
      {
        id: 'kpi-revenue',
        title: 'Total Pendapatan Bersih',
        value: formatRupiah(totalRev),
        numericValue: totalRev,
        comparisonText: 'vs. periode sebelumnya',
        growthPercentage: 14.8,
        isPositive: true,
        accentColor: 'var(--nb-yellow)',
        icon: 'payments',
        helpTooltip: 'Akumulasi seluruh transaksi terkonfirmasi PAID via webhook gateway resmi.',
      },
      {
        id: 'kpi-units',
        title: 'Volume E-Book Terjual',
        value: `${totalUnits.toLocaleString('id-ID')}`,
        numericValue: totalUnits,
        unit: 'eksemplar',
        comparisonText: 'vs. periode sebelumnya',
        growthPercentage: 11.2,
        isPositive: true,
        accentColor: 'var(--nb-blue)',
        icon: 'menu_book',
        helpTooltip: 'Jumlah salinan e-book yang berhasil diterbitkan ke EbookAccess pembeli.',
      },
      {
        id: 'kpi-aov',
        title: 'Nilai Rata-rata Pesanan (AOV)',
        value: formatRupiah(aov),
        numericValue: aov,
        comparisonText: 'vs. periode sebelumnya',
        growthPercentage: 3.5,
        isPositive: true,
        accentColor: 'var(--nb-green)',
        icon: 'point_of_sale',
        helpTooltip: 'Rata-rata pengeluaran per keranjang transaksi lunas.',
      },
      {
        id: 'kpi-success-rate',
        title: 'Tingkat Pembayaran Sukses',
        value: '94.6%',
        numericValue: 94.6,
        comparisonText: '+1.4% dari bulan lalu',
        growthPercentage: 1.4,
        isPositive: true,
        accentColor: 'var(--nb-green)',
        icon: 'verified',
        helpTooltip: 'Persentase invoice yang dilunasi sebelum batas waktu kedaluwarsa.',
      },
      {
        id: 'kpi-saw-impact',
        title: 'Efektivitas Algoritma SAW',
        value: '+34.8%',
        numericValue: 34.8,
        comparisonText: 'konversi lebih tinggi',
        growthPercentage: 34.8,
        isPositive: true,
        accentColor: 'var(--nb-lavender)',
        icon: 'auto_awesome',
        helpTooltip: 'Peningkatan tingkat pembelian e-book yang masuk peringkat Top 5 SAW.',
      },
    ],
    timeSeries: seriesSlice,
    categoryBreakdown: MOCK_CATEGORY_BREAKDOWN.map((c) => ({
      ...c,
      revenue: Math.round(c.revenue * (multiplier === 1 ? 1 : multiplier * 0.35)),
      revenueFormatted: formatRupiah(Math.round(c.revenue * (multiplier === 1 ? 1 : multiplier * 0.35))),
      unitsSold: Math.round(c.unitsSold * (multiplier === 1 ? 1 : multiplier * 0.35)),
    })),
    funnelStages: MOCK_FUNNEL_STAGES.map((s) => ({
      ...s,
      count: Math.round(s.count * multiplier),
      formattedCount: `${Math.round(s.count * multiplier).toLocaleString('id-ID')} ${s.label}`,
    })),
    paymentShares: MOCK_PAYMENT_SHARES.map((p) => ({
      ...p,
      transactionCount: Math.round(p.transactionCount * multiplier),
    })),
    topBooks: MOCK_TOP_EBOOKS.map((b) => ({
      ...b,
      unitsSold: Math.round(b.unitsSold * multiplier),
      revenueNumeric: Math.round(b.revenueNumeric * multiplier),
      totalRevenue: formatRupiah(Math.round(b.revenueNumeric * multiplier)),
    })),
    sawCorrelation: {
      topSawAvgConversion: '6.2%',
      regularAvgConversion: '4.6%',
      upliftPercentage: '+34.8%',
      avgSawScore: 0.884,
    },
  }
}

// ============================================================================
// GENERATOR CSV RESMI UNTUK EKSPOR LAPORAN BISNIS
// ============================================================================
export function generateAnalyticsCsv(dataset: AnalyticsDataset): string {
  const lines: string[] = []

  lines.push(`"LAPORAN ANALITIK BISNIS & INTELIGENSI PENJUALAN"`)
  lines.push(`"Periode","${dataset.periodLabel}"`)
  lines.push(`"Dibuat Pada","${new Date().toLocaleString('id-ID')}"`)
  lines.push(`"Integritas Data","DATA SIMULASI RESMI"`)
  lines.push('')

  // 1. Ringkasan KPI
  lines.push(`"1. RINGKASAN EKSEKUTIF KPI"`)
  lines.push(`"Indikator","Nilai","Pertumbuhan","Keterangan"`)
  dataset.kpis.forEach((kpi) => {
    lines.push(`"${kpi.title}","${kpi.value}","${kpi.growthPercentage}%","${kpi.comparisonText}"`)
  })
  lines.push('')

  // 2. Seri Waktu Penjualan
  lines.push(`"2. TREN PENJUALAN BERKALA"`)
  lines.push(`"Tanggal","Label","Pendapatan (IDR)","Unit Terjual","Jumlah Transaksi","Unit Rekomendasi SAW"`)
  dataset.timeSeries.forEach((pt) => {
    lines.push(`"${pt.date}","${pt.label}","${pt.revenue}","${pt.units}","${pt.orders}","${pt.sawInfluencedUnits}"`)
  })
  lines.push('')

  // 3. Kontribusi Kategori
  lines.push(`"3. KONTRIBUSI KATEGORI E-BOOK"`)
  lines.push(`"Kategori","Kontribusi (%)","Total Omzet (IDR)","Unit Terjual","Buku Aktif","Buku Terlaris"`)
  dataset.categoryBreakdown.forEach((cat) => {
    lines.push(`"${cat.name}","${cat.percentage}%","${cat.revenue}","${cat.unitsSold}","${cat.activeBookCount}","${cat.topBookTitle}"`)
  })
  lines.push('')

  // 4. Performa E-Book Teratas
  lines.push(`"4. PERFORMA E-BOOK TERATAS"`)
  lines.push(`"Peringkat SAW","Judul E-Book","Kategori","Penulis","Harga Satuan","Unit Terjual","Total Omzet","Conversion Rate","Rating","Skor SAW"`)
  dataset.topBooks.forEach((book) => {
    lines.push(`"${book.sawRank}","${book.title}","${book.category}","${book.author}","${book.price}","${book.unitsSold}","${book.totalRevenue}","${book.conversionRate}","${book.rating}","${book.sawScore}"`)
  })

  return lines.join('\n')
}
