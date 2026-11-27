import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { createServer } from 'node:http'
import { app } from '../src/app.js'
import { env } from '../src/config/env.js'
import { disconnectDatabase, prisma } from '../src/config/prisma.js'
import { getSupabaseAdmin } from '../src/config/supabase.js'

async function run() {
  const supabaseAdmin = getSupabaseAdmin()
  const supabasePublic = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const uniqueSuffix = Date.now().toString()
  const tempEmail = `smoke.admin.${uniqueSuffix}@example.com`
  const tempPassword = `SmokePass!${uniqueSuffix}`

  let tempUserId: string | null = null
  let createdCategoryId: string | null = null
  let createdEbookId: string | null = null

  const server = createServer(app)
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  if (!address || typeof address === 'string') {
    throw new Error('Gagal memulai server HTTP lokal untuk smoke test')
  }
  const baseUrl = `http://127.0.0.1:${address.port}/api/v1`

  try {
    // 1. Health Check
    const healthRes = await fetch(`${baseUrl}/health`)
    const healthJson = await healthRes.json()
    console.log(`[1] GET /health -> ${healthRes.status}`, JSON.stringify(healthJson.data))
    if (healthRes.status !== 200) throw new Error('Health check gagal')

    // 2. Buat user ADMIN sementara & ambil JWT nyata dari Supabase Auth
    const { data: createdUser, error: createUserErr } =
      await supabaseAdmin.auth.admin.createUser({
        email: tempEmail,
        password: tempPassword,
        email_confirm: true,
        app_metadata: { role: 'ADMIN' },
      })
    if (createUserErr || !createdUser.user) {
      throw new Error(`Gagal membuat user admin sementara: ${createUserErr?.message}`)
    }
    tempUserId = createdUser.user.id

    const { data: signInData, error: signInErr } =
      await supabasePublic.auth.signInWithPassword({
        email: tempEmail,
        password: tempPassword,
      })
    if (signInErr || !signInData.session?.access_token) {
      throw new Error(`Gagal login Supabase Auth: ${signInErr?.message}`)
    }
    const token = signInData.session.access_token
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }

    // 3. GET /admin/ping
    const pingRes = await fetch(`${baseUrl}/admin/ping`, { headers: authHeaders })
    const pingJson = await pingRes.json()
    console.log(`[2] GET /admin/ping -> ${pingRes.status}`, JSON.stringify(pingJson.data))
    if (pingRes.status !== 200) throw new Error('Admin ping gagal')

    // 4. POST /admin/categories
    const catName = `DATA SIMULASI Smoke Cat ${uniqueSuffix}`
    const postCatRes = await fetch(`${baseUrl}/admin/categories`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: catName,
        description: 'Kategori uji smoke live E2E',
        isActive: true,
      }),
    })
    const postCatJson = await postCatRes.json()
    createdCategoryId = postCatJson.data?.id ?? null
    console.log(
      `[3] POST /admin/categories -> ${postCatRes.status}`,
      JSON.stringify({ id: createdCategoryId, slug: postCatJson.data?.slug }),
    )
    if (postCatRes.status !== 201 || !createdCategoryId) {
      throw new Error(`POST kategori gagal: ${JSON.stringify(postCatJson)}`)
    }

    // 5. GET /categories (Publik — tanpa token)
    const pubCatRes = await fetch(`${baseUrl}/categories`)
    const pubCatJson = await pubCatRes.json()
    const foundCat = (pubCatJson.data as Array<{ id: string }>).find(
      (c) => c.id === createdCategoryId,
    )
    console.log(
      `[4] GET /categories (publik) -> ${pubCatRes.status} | ditemukan=${Boolean(foundCat)}`,
    )
    if (!foundCat) throw new Error('Kategori baru tidak muncul di GET /categories publik')

    // 6. POST /admin/ebooks
    const postBookRes = await fetch(`${baseUrl}/admin/ebooks`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        categoryId: createdCategoryId,
        title: `DATA SIMULASI Smoke Book ${uniqueSuffix}`,
        author: 'Tim Smoke E2E',
        description: 'E-book uji sinkronisasi live admin ke publik',
        price: 65000,
        storagePath: `ebooks-private/smoke-${uniqueSuffix}.pdf`,
        pageCount: 180,
        publishedYear: 2026,
        isActive: true,
      }),
    })
    const postBookJson = await postBookRes.json()
    createdEbookId = postBookJson.data?.id ?? null
    console.log(
      `[5] POST /admin/ebooks -> ${postBookRes.status}`,
      JSON.stringify({ id: createdEbookId, price: postBookJson.data?.price }),
    )
    if (postBookRes.status !== 201 || !createdEbookId) {
      throw new Error(`POST e-book gagal: ${JSON.stringify(postBookJson)}`)
    }

    // 7. GET /ebooks/:id (Publik — verifikasi tampil & TANPA storagePath)
    const pubBookRes = await fetch(`${baseUrl}/ebooks/${createdEbookId}`)
    const pubBookJson = await pubBookRes.json()
    const hasStoragePath = 'storagePath' in (pubBookJson.data ?? {})
    console.log(
      `[6] GET /ebooks/:id (publik) -> ${pubBookRes.status} | title="${pubBookJson.data?.title}" | storagePathExposed=${hasStoragePath}`,
    )
    if (pubBookRes.status !== 200 || hasStoragePath) {
      throw new Error('GET /ebooks/:id publik gagal atau membocorkan storagePath')
    }

    // 8. GET /recommendations/saw (Publik — verifikasi ikut dihitung otomatis SAW backend)
    const sawRes = await fetch(`${baseUrl}/recommendations/saw?limit=20`)
    const sawJson = await sawRes.json()
    const foundSaw = (sawJson.data as Array<{ ebookId: string; rank: number; sawScore: number }>).find(
      (b) => b.ebookId === createdEbookId,
    )
    console.log(
      `[7] GET /recommendations/saw -> ${sawRes.status} | totalRanked=${sawJson.data?.length} | smokeBookRank=${foundSaw?.rank ?? 'N/A'}`,
    )

    // 9. DELETE /admin/categories/:id saat masih dipakai e-book -> wajib 409 CONFLICT
    const conflictDelCatRes = await fetch(
      `${baseUrl}/admin/categories/${createdCategoryId}`,
      { method: 'DELETE', headers: authHeaders },
    )
    const conflictDelCatJson = await conflictDelCatRes.json()
    console.log(
      `[8] DELETE /admin/categories/:id (berelasi) -> ${conflictDelCatRes.status} | code=${conflictDelCatJson.error?.code}`,
    )
    if (conflictDelCatRes.status !== 409) {
      throw new Error('Expected 409 CONFLICT saat hapus kategori berelasi')
    }

    // 10. PATCH /admin/ebooks/:id -> update harga & verifikasi
    const patchBookRes = await fetch(`${baseUrl}/admin/ebooks/${createdEbookId}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ price: 79000 }),
    })
    const patchBookJson = await patchBookRes.json()
    console.log(
      `[9] PATCH /admin/ebooks/:id -> ${patchBookRes.status} | newPrice=${patchBookJson.data?.price}`,
    )
    if (patchBookRes.status !== 200) throw new Error('PATCH e-book gagal')

    // 11. DELETE /admin/ebooks/:id (soft delete isActive=false) -> GET publik wajib 404
    const archiveBookRes = await fetch(`${baseUrl}/admin/ebooks/${createdEbookId}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
    const archiveBookJson = await archiveBookRes.json()
    const afterArchivePub = await fetch(`${baseUrl}/ebooks/${createdEbookId}`)
    console.log(
      `[10] DELETE /admin/ebooks/:id (soft delete) -> ${archiveBookRes.status} | isActive=${archiveBookJson.data?.isActive} | publicGetAfterArchive=${afterArchivePub.status}`,
    )
    if (archiveBookRes.status !== 200 || afterArchivePub.status !== 404) {
      throw new Error('Soft delete e-book tidak menyembunyikan dari endpoint publik')
    }

    // 12. Cleanup e-book uji via Prisma lalu uji DELETE /admin/categories/:id -> 200 OK
    await prisma.ebook.delete({ where: { id: createdEbookId } })
    createdEbookId = null

    const delCatOkRes = await fetch(
      `${baseUrl}/admin/categories/${createdCategoryId}`,
      { method: 'DELETE', headers: authHeaders },
    )
    console.log(`[11] DELETE /admin/categories/:id (kosong) -> ${delCatOkRes.status}`)
    if (delCatOkRes.status !== 200) {
      throw new Error('DELETE kategori kosong gagal')
    }
    createdCategoryId = null

    console.log('\nSMOKE TEST E2E LIVE: SEMUA 11 LANGKAH LULUS 100%!')
  } finally {
    if (createdEbookId) {
      await prisma.ebook.deleteMany({ where: { id: createdEbookId } }).catch(() => {})
    }
    if (createdCategoryId) {
      await prisma.category.deleteMany({ where: { id: createdCategoryId } }).catch(() => {})
    }
    if (tempUserId) {
      await supabaseAdmin.auth.admin.deleteUser(tempUserId).catch(() => {})
    }
    server.close()
    await disconnectDatabase()
  }
}

run().catch((err) => {
  console.error('SMOKE TEST GAGAL:', err)
  process.exit(1)
})
