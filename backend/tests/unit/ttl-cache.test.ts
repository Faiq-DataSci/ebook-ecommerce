import { describe, expect, it, vi } from 'vitest'
import {
  authCache,
  catalogCache,
  invalidateAuthCache,
  invalidateCatalogAndSawCache,
  sawCache,
  TtlCache,
} from '../../src/utils/ttl-cache.js'

describe('TtlCache Unit Tests', () => {
  it('stores and retrieves values within TTL and expires afterwards', () => {
    vi.useFakeTimers()
    try {
      const cache = new TtlCache<string>(1000)
      cache.set('k1', 'value-1')
      expect(cache.get('k1')).toBe('value-1')

      vi.advanceTimersByTime(1001)
      expect(cache.get('k1')).toBeUndefined()
    } finally {
      vi.useRealTimers()
    }
  })

  it('evicts oldest entry when maxEntries limit is reached', () => {
    const cache = new TtlCache<number>(10_000, 2)
    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('c', 3)

    expect(cache.get('a')).toBeUndefined()
    expect(cache.get('b')).toBe(2)
    expect(cache.get('c')).toBe(3)
  })

  it('deletes entries by prefix and supports global invalidation helpers', () => {
    catalogCache.set('ebooks:page1', [{ id: '1' }])
    sawCache.set('saw:all:10', [{ rank: 1 }])
    authCache.set('hash-1', { id: 'u1', email: 'a@b.com', role: 'CUSTOMER' })

    invalidateCatalogAndSawCache()
    expect(catalogCache.get('ebooks:page1')).toBeUndefined()
    expect(sawCache.get('saw:all:10')).toBeUndefined()
    expect(authCache.get('hash-1')).toBeDefined()

    invalidateAuthCache()
    expect(authCache.get('hash-1')).toBeUndefined()
  })
})
