import 'dotenv/config'
import { disconnectDatabase, prisma } from '../src/config/prisma.js'
import { SIMULATION_SAW_CRITERIA } from '../src/services/saw.service.js'
import { buildSimulationSeedData } from './seed-data.js'

async function main(): Promise<void> {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SIMULATION_SEED !== 'true') {
    throw new Error('Seeder DATA SIMULASI ditolak pada NODE_ENV=production')
  }

  const data = buildSimulationSeedData()

  for (const user of data.users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
      create: user,
    })
  }

  for (const category of data.categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        isActive: category.isActive,
      },
      create: category,
    })
  }

  for (const ebook of data.ebooks) {
    await prisma.ebook.upsert({
      where: { id: ebook.id },
      update: {
        categoryId: ebook.categoryId,
        title: ebook.title,
        author: ebook.author,
        description: ebook.description,
        price: ebook.price,
        coverUrl: ebook.coverUrl,
        storagePath: ebook.storagePath,
        pageCount: ebook.pageCount,
        publishedYear: ebook.publishedYear,
        ratingAvg: ebook.ratingAvg,
        salesCount: ebook.salesCount,
        isActive: ebook.isActive,
      },
      create: ebook,
    })
  }

  for (const order of data.orders) {
    await prisma.order.upsert({
      where: { orderNumber: order.orderNumber },
      update: {
        totalAmount: order.totalAmount,
        status: order.status,
        expiresAt: order.expiresAt,
      },
      create: {
        id: order.id,
        userId: order.userId,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        expiresAt: order.expiresAt,
      },
    })

    for (const item of order.items) {
      await prisma.orderItem.upsert({
        where: {
          orderId_ebookId: {
            orderId: order.id,
            ebookId: item.ebookId,
          },
        },
        update: {
          unitPrice: item.unitPrice,
        },
        create: {
          id: item.id,
          orderId: order.id,
          ebookId: item.ebookId,
          unitPrice: item.unitPrice,
        },
      })
    }

    await prisma.payment.upsert({
      where: { externalRef: order.payment.externalRef },
      update: {
        provider: order.payment.provider,
        paymentMethod: order.payment.paymentMethod,
        amount: order.payment.amount,
        status: order.payment.status,
        paidAt: order.payment.paidAt,
      },
      create: {
        id: order.payment.id,
        orderId: order.id,
        provider: order.payment.provider,
        paymentMethod: order.payment.paymentMethod,
        amount: order.payment.amount,
        status: order.payment.status,
        externalRef: order.payment.externalRef,
        paidAt: order.payment.paidAt,
      },
    })
  }

  for (const transaction of data.transactions) {
    await prisma.transaction.upsert({
      where: { transactionCode: transaction.transactionCode },
      update: {
        amount: transaction.amount,
        recordedAt: transaction.recordedAt,
      },
      create: transaction,
    })
  }

  for (const access of data.ebookAccesses) {
    await prisma.ebookAccess.upsert({
      where: {
        userId_ebookId: {
          userId: access.userId,
          ebookId: access.ebookId,
        },
      },
      update: {
        orderId: access.orderId,
        grantedAt: access.grantedAt,
        isRevoked: access.isRevoked,
      },
      create: access,
    })
  }

  for (const [idx, criterion] of SIMULATION_SAW_CRITERIA.entries()) {
    await prisma.sawCriterion.upsert({
      where: { code: criterion.id },
      update: {
        name: criterion.name,
        field: criterion.field,
        type: criterion.type,
        weight: criterion.weight,
        isActive: true,
        sortOrder: idx,
      },
      create: {
        code: criterion.id,
        name: criterion.name,
        field: criterion.field,
        type: criterion.type,
        weight: criterion.weight,
        isActive: true,
        sortOrder: idx,
      },
    })
  }

  console.log(
    `Seed DATA SIMULASI selesai: ${data.users.length} users, ${data.categories.length} categories, ${data.ebooks.length} ebooks, ${data.orders.length} orders, ${data.transactions.length} transactions, ${data.ebookAccesses.length} ebook accesses, ${SIMULATION_SAW_CRITERIA.length} saw criteria.`,
  )
}

main()
  .catch((err) => {
    console.error('Seed DATA SIMULASI gagal:', err)
    process.exitCode = 1
  })
  .finally(async () => {
    await disconnectDatabase()
  })
