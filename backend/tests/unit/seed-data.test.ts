import { describe, expect, it } from 'vitest'
import { buildSimulationSeedData } from '../../prisma/seed-data.js'

describe('Simulation Seed Data Invariants', () => {
  it('labels all seeded entities as DATA SIMULASI', () => {
    const data = buildSimulationSeedData()

    expect(data.users.every((user) => user.fullName.includes('DATA SIMULASI'))).toBe(true)
    expect(data.categories.every((category) => category.name.includes('DATA SIMULASI'))).toBe(true)
    expect(data.ebooks.every((ebook) => ebook.title.includes('DATA SIMULASI'))).toBe(true)
    expect(data.orders.every((order) => order.orderNumber.includes('DATA-SIMULASI'))).toBe(true)
    expect(data.transactions.every((trx) => trx.transactionCode.includes('DATA-SIMULASI'))).toBe(true)
  })

  it('grants EbookAccess and Transaction ONLY for PAID orders', () => {
    const data = buildSimulationSeedData()
    const paidOrderIds = new Set(data.orders.filter((o) => o.status === 'PAID').map((o) => o.id))
    const unpaidOrderIds = new Set(data.orders.filter((o) => o.status !== 'PAID').map((o) => o.id))

    expect(unpaidOrderIds.size).toBeGreaterThan(0)

    for (const access of data.ebookAccesses) {
      expect(paidOrderIds.has(access.orderId)).toBe(true)
      expect(unpaidOrderIds.has(access.orderId)).toBe(false)
    }

    for (const transaction of data.transactions) {
      expect(paidOrderIds.has(transaction.orderId)).toBe(true)
      expect(unpaidOrderIds.has(transaction.orderId)).toBe(false)
    }
  })

  it('keeps order totalAmount aligned with sum of item unitPrice', () => {
    const data = buildSimulationSeedData()

    for (const order of data.orders) {
      const itemsTotal = order.items.reduce((sum, item) => sum + Number(item.unitPrice), 0)
      expect(Number(order.totalAmount)).toBe(itemsTotal)
      expect(Number(order.payment.amount)).toBe(itemsTotal)
    }
  })
})
