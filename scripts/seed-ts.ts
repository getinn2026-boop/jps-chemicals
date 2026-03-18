import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient();

// Generate a simple ID
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function seedData() {
  console.log('🧪 Starting seeding process...');
  
  try {
    // Check existing data first
    const existingClients = await prisma.client.count();
    const existingProducts = await prisma.product.count();
    const existingSuppliers = await prisma.supplier.count();
    
    console.log(`📊 Current database state:`);
    console.log(`   - Clients: ${existingClients}`);
    console.log(`   - Products: ${existingProducts}`);
    console.log(`   - Suppliers: ${existingSuppliers}`);
    
    if (existingClients > 0 && existingProducts > 0) {
      console.log('✅ Database already has data. Skipping seeding.');
      return;
    }
    
    // Sample Clients
    const sampleClients = [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@pharmatech.com',
        phone: '+91-9876543210',
        companyName: 'PharmaTech Industries Ltd.',
        address: 'Plot No. 45, Industrial Estate, Vapi, Gujarat 396195',
        gstNumber: '24AABCU9603R1ZX',
        notes: 'Regular customer for pharmaceutical intermediates. 30-day payment terms.'
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@chemcorp.in',
        phone: '+91-9823456789',
        companyName: 'Chemical Corporation of India',
        address: 'Sector 18, Udyog Vihar, Gurugram, Haryana 122015',
        gstNumber: '06AAACC1234F1Z5',
        notes: 'Bulk orders for industrial solvents. Requires MSDS for all products.'
      },
      {
        name: 'Anand Patel',
        email: 'anand.patel@biolabs.co',
        phone: '+91-9871234567',
        companyName: 'BioLabs Research Solutions',
        address: 'A-201, Science City Road, Ahmedabad, Gujarat 380060',
        gstNumber: '24AABBP4567E1Z8',
        notes: 'Specializes in biotechnology reagents. Always requests COA documents.'
      }
    ];
    
    // Create clients
    const createdClients = [];
    for (const clientData of sampleClients) {
      const existingClient = await prisma.client.findFirst({
        where: { email: clientData.email }
      });
      
      if (!existingClient) {
        const newClient = await prisma.client.create({
          data: clientData
        });
        createdClients.push(newClient);
        console.log(`✅ Created client: ${newClient.name} (${newClient.companyName})`);
      } else {
        console.log(`⏭️  Client already exists: ${existingClient.email}`);
      }
    }
    
    // Sample Suppliers
    const sampleSuppliers = [
      {
        name: 'Merck Life Sciences',
        contactPerson: 'Ramesh Iyer',
        email: 'ramesh.iyer@merck.com',
        phone: '+91-22-66688800',
        address: '126, Andheri Industrial Estate, Mumbai, Maharashtra 400093',
        gstNumber: '27AAACM1234F1Z8',
        notes: 'Premium supplier for analytical grade chemicals'
      },
      {
        name: 'Thermo Fisher Scientific',
        contactPerson: 'Sunita Desai',
        email: 'sunita.desai@thermofisher.com',
        phone: '+91-80-66688800',
        address: '403-404, Embassy Tech Square, Bangalore, Karnataka 560103',
        gstNumber: '29AABCT5678E1Z2',
        notes: 'Leading supplier for research chemicals and lab equipment'
      }
    ];
    
    // Create suppliers
    const createdSuppliers = [];
    for (const supplierData of sampleSuppliers) {
      const existingSupplier = await prisma.supplier.findFirst({
        where: { email: supplierData.email }
      });
      
      if (!existingSupplier) {
        const newSupplier = await prisma.supplier.create({
          data: supplierData
        });
        createdSuppliers.push(newSupplier);
        console.log(`✅ Created supplier: ${newSupplier.name}`);
      } else {
        console.log(`⏭️  Supplier already exists: ${existingSupplier.email}`);
      }
    }
    
    // Sample Products
    const sampleProducts = [
      {
        name: 'Acetone',
        sku: 'ACE-001',
        casNumber: '67-64-1',
        unit: 'L',
        currency: 'INR',
        defaultPrice: 850,
        supplierId: createdSuppliers[0]?.id || 1
      },
      {
        name: 'Sodium Hydroxide',
        sku: 'NAOH-500G',
        casNumber: '1310-73-2',
        unit: '500g',
        currency: 'INR',
        defaultPrice: 450,
        supplierId: createdSuppliers[0]?.id || 1
      },
      {
        name: 'Hydrochloric Acid',
        sku: 'HCL-1L',
        casNumber: '7647-01-0',
        unit: 'L',
        currency: 'INR',
        defaultPrice: 320,
        supplierId: createdSuppliers[0]?.id || 1
      },
      {
        name: 'Methanol',
        sku: 'MET-500ML',
        casNumber: '67-56-1',
        unit: '500mL',
        currency: 'INR',
        defaultPrice: 680,
        supplierId: createdSuppliers[1]?.id || 2
      },
      {
        name: 'Ethanol',
        sku: 'ETH-1L',
        casNumber: '64-17-5',
        unit: 'L',
        currency: 'INR',
        defaultPrice: 950,
        supplierId: createdSuppliers[1]?.id || 2
      }
    ];
    
    // Create products
    const createdProducts = [];
    for (const productData of sampleProducts) {
      const existingProduct = await prisma.product.findFirst({
        where: { sku: productData.sku }
      });
      
      if (!existingProduct) {
        const newProduct = await prisma.product.create({
          data: productData
        });
        createdProducts.push(newProduct);
        console.log(`✅ Created product: ${newProduct.name} (${newProduct.sku}) - ₹${newProduct.defaultPrice}/${newProduct.unit}`);
      } else {
        console.log(`⏭️  Product already exists: ${existingProduct.sku}`);
      }
    }
    
    // Show final counts
    const finalClients = await prisma.client.count();
    const finalProducts = await prisma.product.count();
    const finalSuppliers = await prisma.supplier.count();
    
    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📊 Final database state:');
    console.log(`   - Clients: ${finalClients}`);
    console.log(`   - Products: ${finalProducts}`);
    console.log(`   - Suppliers: ${finalSuppliers}`);
    
    console.log('\n🧪 Sample Products Available:');
    createdProducts.slice(0, 5).forEach(product => {
      console.log(`   - ${product.name} (${product.sku}) - ₹${product.defaultPrice}/${product.unit}`);
    });
    
    console.log('\n👥 Sample Clients Available:');
    createdClients.slice(0, 3).forEach(client => {
      console.log(`   - ${client.name} (${client.companyName})`);
    });
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedData().catch(console.error);