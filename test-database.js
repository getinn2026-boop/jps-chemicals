const { PrismaClient } = require('./scripts/src/generated/prisma/client.js');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('Database connected successfully');
    
    // Check if products exist
    const productCount = await prisma.product.count();
    console.log(`Total products in database: ${productCount}`);
    
    if (productCount > 0) {
      // Get first few products
      const products = await prisma.product.findMany({
        take: 5,
        include: { supplier: true }
      });
      console.log('Sample products:');
      products.forEach(product => {
        console.log(`- ${product.name} (${product.sku}) - ${product.supplier.name}`);
      });
    } else {
      console.log('No products found in database');
    }
    
    // Check suppliers
    const supplierCount = await prisma.supplier.count();
    console.log(`Total suppliers: ${supplierCount}`);
    
    // Check clients
    const clientCount = await prisma.client.count();
    console.log(`Total clients: ${clientCount}`);
    
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();