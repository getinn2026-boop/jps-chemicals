import { PrismaClient } from './src/generated/prisma/client';

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
          name: 'Global Chemicals Ltd',
          email: 'info@globalchem.com',
          phone: '+91-79-56789012',
          address: 'Ahmedabad Industrial Area, Ahmedabad, Gujarat'
        }
      })
    ]);

    console.log('Created suppliers:', suppliers.length);

    // Create test products
    const products = await Promise.all([
      // Acids
      prisma.product.create({
        data: {
          name: 'Acetic Acid',
          sku: 'ACA-001',
          casNumber: '64-19-7',
          unit: 'L',
          defaultPrice: 450.00,
          supplierId: suppliers[0].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Acetone',
          sku: 'ACE-002',
          casNumber: '67-64-1',
          unit: 'L',
          defaultPrice: 380.00,
          supplierId: suppliers[0].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Ammonium Chloride',
          sku: 'AMC-003',
          casNumber: '12125-02-9',
          unit: 'kg',
          defaultPrice: 120.00,
          supplierId: suppliers[1].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Benzene',
          sku: 'BEN-004',
          casNumber: '71-43-2',
          unit: 'L',
          defaultPrice: 890.00,
          supplierId: suppliers[1].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Calcium Carbonate',
          sku: 'CAC-005',
          casNumber: '471-34-1',
          unit: 'kg',
          defaultPrice: 45.00,
          supplierId: suppliers[2].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Citric Acid',
          sku: 'CIT-006',
          casNumber: '77-92-9',
          unit: 'kg',
          defaultPrice: 180.00,
          supplierId: suppliers[2].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Ethanol',
          sku: 'ETH-007',
          casNumber: '64-17-5',
          unit: 'L',
          defaultPrice: 320.00,
          supplierId: suppliers[0].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Formaldehyde',
          sku: 'FOR-008',
          casNumber: '50-00-0',
          unit: 'L',
          defaultPrice: 280.00,
          supplierId: suppliers[1].id
        }
      })
    ]);

    console.log('Created products:', products.length);

    // Create test clients
    const clients = await Promise.all([
      prisma.client.create({
        data: {
          name: 'Rajesh Kumar',
          companyName: 'Kumar Industries',
          email: 'rajesh@kumarindustries.com',
          phone: '+91-9876543210',
          address: '123 Industrial Area, Delhi 110001',
          gstin: '07AAACK1234A1ZP'
        }
      }),
      prisma.client.create({
        data: {
          name: 'Priya Sharma',
          companyName: 'Sharma Chemicals Pvt Ltd',
          email: 'priya@sharmachemicals.com',
          phone: '+91-8765432109',
          address: '456 Chemical Complex, Mumbai 400001',
          gstin: '27AABCS5678B2ZQ'
        }
      }),
      prisma.client.create({
        data: {
          name: 'Amit Patel',
          companyName: 'Patel Manufacturing',
          email: 'amit@patelmfg.com',
          phone: '+91-7654321098',
          address: '789 Factory Road, Ahmedabad 380001',
          gstin: '24AAACP9012C3ZR'
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