const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    // Create test suppliers
    const suppliers = await Promise.all([
      prisma.supplier.create({
        data: {
          name: 'ChemCorp Industries',
          email: 'contact@chemcorp.com',
          phone: '+91-22-23456789',
          address: 'Mumbai Industrial Estate, Mumbai, Maharashtra'
        }
      }),
      prisma.supplier.create({
        data: {
          name: 'PureChem Solutions',
          email: 'sales@purechem.com',
          phone: '+91-44-45678901',
          address: 'Chennai Chemical Complex, Chennai, Tamil Nadu'
        }
      }),
      prisma.supplier.create({
        data: {
          name: 'TechChem Supplies',
          email: 'info@techchem.com',
          phone: '+91-80-67890123',
          address: 'Bangalore Tech Park, Bangalore, Karnataka'
        }
      })
    ]);

    console.log('Created suppliers:', suppliers.length);

    // Create test products
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: 'Acetone Technical Grade',
          sku: 'ACE-001',
          unit: 'Litre',
          defaultPrice: 85.50,
          supplierId: suppliers[0].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Hydrochloric Acid 35%',
          sku: 'HCL-035',
          unit: 'Litre',
          defaultPrice: 45.25,
          supplierId: suppliers[0].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Sodium Hydroxide Flakes',
          sku: 'NAOH-FL',
          unit: 'Kg',
          defaultPrice: 120.75,
          supplierId: suppliers[1].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Methanol Industrial',
          sku: 'MET-IND',
          unit: 'Litre',
          defaultPrice: 92.30,
          supplierId: suppliers[1].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Isopropyl Alcohol 99%',
          sku: 'IPA-099',
          unit: 'Litre',
          defaultPrice: 78.60,
          supplierId: suppliers[2].id
        }
      })
    ]);

    console.log('Created products:', products.length);

    // Create test clients
    const clients = await Promise.all([
      prisma.client.create({
        data: {
          name: 'Rajesh Kumar',
          companyName: 'Kumar Chemicals Pvt Ltd',
          email: 'rajesh@kumarchemicals.com',
          phone: '+91-9876543210',
          address: '123 Industrial Area, Delhi 110001',
          gstin: '27AABCU9603R1ZX'
        }
      }),
      prisma.client.create({
        data: {
          name: 'Priya Sharma',
          companyName: 'Sharma Industries',
          email: 'priya@sharmaindustries.com',
          phone: '+91-8765432109',
          address: '456 Chemical Complex, Mumbai 400001',
          gstin: '27AABCS5678B2ZQ'
        }
      })
    ]);

    console.log('Created clients:', clients.length);

    console.log('Database seed completed successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();