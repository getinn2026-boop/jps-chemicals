const { PrismaClient } = require('d:/Projects/JPS Chemicals/jps-chemicals/src/generated/prisma/client.js');

const prisma = new PrismaClient();

async function seedData() {
  console.log('🧪 Starting comprehensive seeding process...');
  
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
    
    // Sample Products
    const chemicalProducts = [
      {
        name: 'Acetone',
        sku: 'ACE-001',
        casNumber: '67-64-1',
        unit: 'L',
        currency: 'INR',
        defaultPrice: 850,
        supplierName: 'Merck Life Sciences'
      },
      {
        name: 'Sodium Hydroxide',
        sku: 'NAOH-500G',
        casNumber: '1310-73-2',
        unit: '500g',
        currency: 'INR',
        defaultPrice: 450,
        supplierName: 'Thermo Fisher Scientific'
      },
      {
        name: 'Hydrochloric Acid',
        sku: 'HCL-37-1L',
        casNumber: '7647-01-0',
        unit: 'L',
        currency: 'INR',
        defaultPrice: 320,
        supplierName: 'Loba Chemie'
      }
    ];
    
    // Create clients if none exist
    if (existingClients === 0) {
      console.log('👥 Creating sample clients...');
      for (const client of sampleClients) {
        await prisma.client.create({ data: client });
        console.log(`✅ Created client: ${client.name} (${client.companyName})`);
      }
    }
    
    // Create suppliers and products if none exist
    if (existingProducts === 0) {
      console.log('🏭 Creating suppliers and products...');
      
      for (const product of chemicalProducts) {
        // Find or create supplier
        let supplier = await prisma.supplier.findFirst({
          where: { name: product.supplierName }
        });
        
        if (!supplier) {
          supplier = await prisma.supplier.create({
            data: {
              name: product.supplierName,
              email: `contact@${product.supplierName.toLowerCase().replace(/\s+/g, '-')}.com`,
              phone: `+91-${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
              address: 'Industrial Area, Mumbai, Maharashtra'
            }
          });
          console.log(`✅ Created supplier: ${supplier.name}`);
        }
        
        // Create product
        const newProduct = await prisma.product.create({
          data: {
            name: product.name,
            sku: product.sku,
            casNumber: product.casNumber,
            unit: product.unit,
            currency: product.currency,
            defaultPrice: product.defaultPrice,
            supplierId: supplier.id
          }
        });
        
        console.log(`✅ Created product: ${newProduct.name} (${newProduct.sku})`);
      }
    }
    
    console.log('\n🎉 Seeding completed successfully!');
    
    // Show final counts
    const finalClients = await prisma.client.count();
    const finalProducts = await prisma.product.count();
    const finalSuppliers = await prisma.supplier.count();
    
    console.log('\n📊 Final database state:');
    console.log(`   - Clients: ${finalClients}`);
    console.log(`   - Products: ${finalProducts}`);
    console.log(`   - Suppliers: ${finalSuppliers}`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedData().catch(console.error);