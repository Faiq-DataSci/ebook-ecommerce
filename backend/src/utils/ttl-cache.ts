interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class TtlCache<T = unknown> {
  private readonly store = new Map<string, CacheEntry<T>>()

  constructor(
    private readonly defaultTtlMs: number,
    private readonly maxEntries = 500,
  ) {}

  get(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }
    return entry.value
  }

  set(key: string, value: T, ttlMs = this.defaultTtlMs): void {
    if (this.store.size >= this.maxEntries && !this.store.has(key)) {
      const oldestKey = this.store.keys().next().value
      if (oldestKey !== undefined) {
        this.store.delete(oldestKey)
      }
    }
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    })
  }

  delete(key: string): void {
    this.store.delete(key)
  }

  deleteByPrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key)
      }
    }
  }

  clear(): void {
    this.store.clear()
  }

  get size(): number {
    return this.store.size
  }
}

export const authCache = new TtlCache<{
  id: string
  email: string
  role: 'CUSTOMER' | 'ADMIN'
}>(30_000, 500)

export const catalogCache = new TtlCache<unknown>(45_000, 300)

export const sawCache = new TtlCache<unknown>(45_000, 100)

export function invalidateCatalogAndSawCache(): void {
  catalogCache.clear()
  sawCache.clear()
}

export function invalidateAuthCache(): void {
  authCache.clear()
}
