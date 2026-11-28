import 'dotenv/config'
import { prisma, disconnectDatabase } from '../src/config/prisma.js'
import { getSupabaseAdmin } from '../src/config/supabase.js'
import { env } from '../src/config/env.js'
import { createPrivatePdfSignedUrl } from '../src/integrations/storage/supabase-storage.js'
import { createXenditDynamicQris } from '../src/integrations/payment/xendit.client.js'

interface VerificationReport {
  database: { success: boolean; details: any }
  auth: { success: boolean; details: any }
  storage: { success: boolean; details: any }
  paymentGateway: { success: boolean; details: any }
}

async function verifyAll(): Promise<VerificationReport> {
  const report: VerificationReport = {
    database: { success: false, details: null },
    auth: { success: false, details: null },
    storage: { success: false, details: null },
    paymentGateway: { success: false, details: null },
  }

  console.log('\n======================================================')
  console.log('   VERIFIKASI INTEGRASI LAYANAN CLOUD PRODUKSI / DEV  ')
  console.log('======================================================\n')

  // 1. PostgreSQL Supabase
  try {
    console.log('[1/4] Menguji Database PostgreSQL Supabase...')
    const [userCount, ebookCount, categoryCount, orderCount] = await Promise.all([
      prisma.user.count(),
      prisma.ebook.count(),
      prisma.category.count(),
      prisma.order.count(),
    ])
    report.database = {
      success: true,
      details: {
        totalUsers: userCount,
        totalEbooks: ebookCount,
        totalCategories: categoryCount,
        totalOrders: orderCount,
      },
    }
    console.log('  -> BERHASIL: PostgreSQL Supabase terhubung & responsif.')
    console.log('     Data terhitung:', JSON.stringify(report.database.details))
  } catch (err: any) {
    report.database = { success: false, details: err.message }
    console.error('  -> GAGAL pada Database:', err.message)
  }

  // 2. Supabase Auth Admin
  try {
    console.log('\n[2/4] Menguji Supabase Auth Admin API...')
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 5 })
    if (error) {
      throw error
    }
    report.auth = {
      success: true,
      details: {
        totalRegisteredUsersInAuth: data.users.length,
        sampleEmails: data.users.map((u) => u.email),
      },
    }
    console.log('  -> BERHASIL: Supabase Auth Admin API valid.')
    console.log('     Pengguna terdaftar di Auth:', data.users.length)
  } catch (err: any) {
    report.auth = { success: false, details: err.message }
    console.error('  -> GAGAL pada Supabase Auth:', err.message)
  }

  // 3. Supabase Storage Privat
  try {
    console.log('\n[3/4] Menguji Supabase Storage Bucket Privat...')
    const supabase = getSupabaseAdmin()
    const bucketName = env.SUPABASE_EBOOK_BUCKET

    // Cek daftar bucket
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    if (listError) {
      throw listError
    }

    let targetBucket = buckets?.find((b) => b.name === bucketName)
    if (!targetBucket) {
      console.log(`  -> Bucket "${bucketName}" belum ada. Mencoba membuat bucket privat...`)
      const { data: newBucket, error: createError } = await supabase.storage.createBucket(
        bucketName,
        {
          public: false,
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: ['application/pdf'],
        },
      )
      if (createError) {
        throw new Error(`Gagal membuat bucket "${bucketName}": ${createError.message}`)
      }
      targetBucket = { name: bucketName, public: false } as any
      console.log(`  -> Bucket privat "${bucketName}" berhasil dibuat!`)
    }

    console.log(`  -> Status Bucket "${bucketName}": public = ${targetBucket?.public}`)

    // Buat file dummy PDF minimal
    const dummyPdfContent =
      '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n190\n%%EOF'
    const testPath = `test-verifications/verify-${Date.now()}.pdf`

    // Upload ke bucket privat
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(testPath, Buffer.from(dummyPdfContent, 'utf-8'), {
        contentType: 'application/pdf',
        upsert: true,
      })
    if (uploadError) {
      throw uploadError
    }
    console.log(`  -> Berkas PDF uji coba terunggah ke: ${testPath}`)

    // Buat Signed URL (TTL 60 detik)
    const signedUrl = await createPrivatePdfSignedUrl(testPath, 60)
    console.log(`  -> Signed URL berhasil diterbitkan: TTL 60 detik.`)

    // Validasi akses via Signed URL (Wajib HTTP 200)
    const signedRes = await fetch(signedUrl)
    const signedOk = signedRes.status === 200

    // Validasi penolakan via Public URL (Wajib HTTP bukan 200, karena privat)
    const publicUrl = `${env.SUPABASE_URL}/storage/v1/object/public/${bucketName}/${testPath}`
    const publicRes = await fetch(publicUrl)
    const isStrictlyPrivate = publicRes.status !== 200

    // Cleanup berkas uji coba
    await supabase.storage.from(bucketName).remove([testPath])
    console.log(`  -> Berkas PDF uji coba telah dibersihkan dari storage.`)

    report.storage = {
      success: signedOk && isStrictlyPrivate,
      details: {
        bucketName,
        isPrivate: !targetBucket?.public,
        signedUrlAccessStatus: signedRes.status,
        publicUrlAccessStatus: publicRes.status,
        strictlyPrivateEnforced: isStrictlyPrivate,
      },
    }
    console.log(
      `  -> BERHASIL: Storage privat valid (Signed URL = ${signedRes.status}, Akses Publik = ${publicRes.status} Ditahan).`,
    )
  } catch (err: any) {
    report.storage = { success: false, details: err.message }
    console.error('  -> GAGAL pada Supabase Storage:', err.message)
  }

  // 4. Payment Gateway Test Mode (Xendit Dynamic QRIS)
  try {
    console.log('\n[4/4] Menguji Payment Gateway (XENDIT Dynamic QRIS Test Mode)...')
    const serverKey = env.PAYMENT_GATEWAY_SERVER_KEY
    if (!serverKey) {
      throw new Error('PAYMENT_GATEWAY_SERVER_KEY belum dikonfigurasi')
    }

    const testOrderId = `VERIFY-${Date.now()}`
    const qris = await createXenditDynamicQris({
      referenceId: testOrderId,
      amount: 15000,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    })

    report.paymentGateway = {
      success: true,
      details: {
        provider: 'xendit',
        qrId: qris.qrId,
        referenceId: qris.referenceId,
        status: qris.status,
        amount: qris.amount,
        currency: qris.currency,
        channelCode: qris.channelCode,
        hasQrString: Boolean(qris.qrString),
      },
    }
    console.log('  -> BERHASIL: Xendit Dynamic QRIS Test Mode berhasil dibuat.')
    console.log(
      `     Reference ID: ${qris.referenceId}, QR ID: ${qris.qrId}, Status: ${qris.status}, QR Dihasilkan: ${Boolean(qris.qrString)}`,
    )
  } catch (err: any) {
    report.paymentGateway = { success: false, details: err.message }
    console.error('  -> GAGAL pada Payment Gateway:', err.message)
  } finally {
    await disconnectDatabase()
  }

  console.log('\n======================================================')
  console.log('                 RINGKASAN HASIL UJI                  ')
  console.log('======================================================')
  console.log(JSON.stringify(report, null, 2))
  console.log('======================================================\n')

  return report
}

verifyAll().catch((e) => {
  console.error('Fatal verification error:', e)
  process.exit(1)
})
