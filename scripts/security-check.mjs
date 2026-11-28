#!/usr/bin/env node
/**
 * Pemindai Keamanan Pra-Commit / Pra-Push (Zero-Dependency)
 * Memblokir commit jika ditemukan file sensitif atau pola kredensial rahasia.
 */
import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

const FORBIDDEN_FILE_PATTERNS = [
  /(^|\/)\.env($|\.(?!example$))/i,
  /\.(keystore|jks|pem|key|p8|p12|pfx|sqlite|db)$/i,
  /(^|\/)key\.properties$/i,
  /(^|\/)google-services\.json$/i,
  /(^|\/)GoogleService-Info\.plist$/i,
  /service-account.*\.json$/i,
  /firebase-adminsdk.*\.json$/i,
]

const SECRET_PATTERNS = [
  { name: 'Private Key Block', regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'Supabase Secret Key', regex: /\bsb_secret_[A-Za-z0-9_-]{16,}\b/ },
  { name: 'Xendit Secret API Key', regex: /\bxnd_(development|production)_[A-Za-z0-9_-]{16,}\b/ },
  {
    name: 'Hardcoded Service Role Key in Frontend/Mobile',
    regex: /\bVITE_.*(SERVICE_ROLE|SECRET_KEY|SERVER_KEY|DATABASE_URL)\b/,
    codeOnly: true,
  },
  {
    name: 'Hardcoded Supabase JWT Token',
    regex: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]{20,}/,
  },
]

const mode = process.argv.includes('--staged') ? 'staged' : 'tracked'
const rawList = execSync(
  mode === 'staged'
    ? 'git diff --cached --name-only --diff-filter=ACM'
    : 'git ls-files',
  { encoding: 'utf8' },
)

const files = rawList
  .split(/\r?\n/)
  .map((f) => f.trim())
  .filter(Boolean)

const violations = []

for (const filePath of files) {
  for (const pattern of FORBIDDEN_FILE_PATTERNS) {
    if (pattern.test(filePath)) {
      violations.push(`[FILE SENSITIF] ${filePath} tidak boleh masuk repositori Git.`)
    }
  }

  // Lewati file biner atau file skrip pemindai ini sendiri
  if (
    filePath === 'scripts/security-check.mjs' ||
    /\.(png|jpg|jpeg|webp|ico|pdf|woff2?|ttf|eot|lock)$/i.test(filePath)
  ) {
    continue
  }

  if (!existsSync(filePath)) continue

  const isDocFile = filePath.startsWith('docs/') || filePath.endsWith('.md')
  const content = readFileSync(filePath, 'utf8')
  const lines = content.split(/\r?\n/)
  lines.forEach((line, idx) => {
    for (const rule of SECRET_PATTERNS) {
      if (rule.codeOnly && isDocFile) continue
      if (rule.regex.test(line)) {
        violations.push(
          `[SECRET TERDETEKSI] ${rule.name} pada ${filePath}:${idx + 1}`,
        )
      }
    }
  })
}

if (violations.length > 0) {
  console.error('\n[SECURITY GUARD] Ditemukan potensi kebocoran keamanan:')
  for (const v of violations) {
    console.error(`  - ${v}`)
  }
  console.error('\nCommit/audit diblokir. Hapus kredensial atau tambahkan ke .gitignore.\n')
  process.exit(1)
}

console.log(
  `[SECURITY GUARD] PASS (${files.length} file ${mode} diperiksa, 0 kebocoran terdeteksi).`,
)
