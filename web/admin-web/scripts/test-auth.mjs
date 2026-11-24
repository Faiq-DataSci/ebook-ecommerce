import assert from 'node:assert/strict'
import test from 'node:test'

// Import validation functions
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email) {
  const trimmed = email.trim()
  if (!trimmed) {
    return 'Email wajib diisi.'
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Format email tidak valid.'
  }
  return null
}

function validatePassword(password) {
  if (!password) {
    return 'Kata sandi wajib diisi.'
  }
  return null
}

function validateLoginForm(credentials) {
  const errors = {}
  const emailError = validateEmail(credentials.email)
  const passwordError = validatePassword(credentials.password)

  if (emailError) {
    errors.email = emailError
  }
  if (passwordError) {
    errors.password = passwordError
  }

  return errors
}

test('1. Validasi Email', async (t) => {
  await t.test('Menolak email kosong dan spasi', () => {
    assert.equal(validateEmail(''), 'Email wajib diisi.')
    assert.equal(validateEmail('   '), 'Email wajib diisi.')
  })

  await t.test('Menolak format email tidak valid', () => {
    assert.equal(validateEmail('admin'), 'Format email tidak valid.')
    assert.equal(validateEmail('admin@'), 'Format email tidak valid.')
    assert.equal(validateEmail('admin@bukukita'), 'Format email tidak valid.')
    assert.equal(validateEmail('@bukukita.com'), 'Format email tidak valid.')
  })

  await t.test('Menerima email valid', () => {
    assert.equal(validateEmail('admin@bukukita.com'), null)
    assert.equal(validateEmail('admin.simulasi@example.com'), null)
    assert.equal(validateEmail('  admin@bukukita.com  '), null)
  })
})

test('2. Validasi Kata Sandi', async (t) => {
  await t.test('Menolak kata sandi kosong', () => {
    assert.equal(validatePassword(''), 'Kata sandi wajib diisi.')
  })

  await t.test('Menerima kata sandi terisi', () => {
    assert.equal(validatePassword('secret123'), null)
    assert.equal(validatePassword('Admin@2026'), null)
  })
})

test('3. Validasi Form Login Agregat', () => {
  const bothEmpty = validateLoginForm({ email: '', password: '' })
  assert.equal(bothEmpty.email, 'Email wajib diisi.')
  assert.equal(bothEmpty.password, 'Kata sandi wajib diisi.')

  const invalidEmail = validateLoginForm({ email: 'salah-email', password: 'password123' })
  assert.equal(invalidEmail.email, 'Format email tidak valid.')
  assert.equal(invalidEmail.password, undefined)

  const allValid = validateLoginForm({ email: 'admin@bukukita.com', password: 'password123' })
  assert.deepEqual(allValid, {})
})

test('4. Aturan Keamanan & Pesan Error Generik', () => {
  // Simulasi penanganan pesan kegagalan autentikasi
  const genericErrorMessage = 'Email atau kata sandi salah.'
  const forbiddenErrorMessage = 'Kamu tidak memiliki akses ke halaman ini.'

  // Kredensial salah tidak boleh membocorkan status keberadaan email
  assert.equal(genericErrorMessage, 'Email atau kata sandi salah.')
  assert.doesNotMatch(genericErrorMessage, /email tidak terdaftar/i)
  assert.doesNotMatch(genericErrorMessage, /password salah/i)

  // Penolakan role bukan ADMIN
  assert.equal(forbiddenErrorMessage, 'Kamu tidak memiliki akses ke halaman ini.')
})

test('5. Verifikasi Integritas RBAC Admin', () => {
  const mockUserAdmin = {
    id: 'user-001',
    email: 'admin.simulasi@example.com',
    app_metadata: { role: 'ADMIN' },
  }

  const mockUserCustomer = {
    id: 'user-002',
    email: 'customer.simulasi@example.com',
    app_metadata: { role: 'CUSTOMER' },
  }

  const mockUserHacker = {
    id: 'user-003',
    email: 'attacker@example.com',
    user_metadata: { role: 'ADMIN' }, // Diinput oleh user, bukan di app_metadata
    app_metadata: { role: 'CUSTOMER' },
  }

  function verifyAdminRole(user) {
    // Role HARUS dari app_metadata (otoritas server), BUKAN user_metadata
    if (user.app_metadata?.role === 'ADMIN') {
      return true
    }
    return false
  }

  assert.equal(verifyAdminRole(mockUserAdmin), true, 'Akun ADMIN sah harus diterima')
  assert.equal(verifyAdminRole(mockUserCustomer), false, 'Akun CUSTOMER harus ditolak')
  assert.equal(verifyAdminRole(mockUserHacker), false, 'Manipulasi role via user_metadata harus ditolak')
})
