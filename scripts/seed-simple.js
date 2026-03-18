const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

const sampleProducts = [
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
    sku: 'HCL-1L',
    casNumber: '7647-01-0',
    unit: '1L',
    currency: 'INR',
    defaultPrice: 320,
    supplierName: 'Sigma-Aldrich'
  }
];

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
    
    console.log('\n🌱 Starting seeding process...');
    
    // Create suppliers first
    const createdSuppliers = [];
    const supplierNames = [...new Set(sampleProducts.map(p => p.supplierName))];
    
    for (const supplierName of supplierNames) {
      const existingSupplier = await prisma.supplier.findUnique({
        where: { name: supplierName }
      });
      
      if (!existingSupplier) {
        const newSupplier = await prisma.supplier.create({
          data: {
            name: supplierName,
            contactEmail: `contact@${supplierName.toLowerCase().replace(/\s+/g, '-')}.com`,
            phone: '+91-11-12345678',
            address: 'Industrial Area, Delhi, India'
          }
        });
        createdSuppliers.push(newSupplier);
        console.log(`✅ Created supplier: ${newSupplier.name}`);
      }
    }
    
    // Create clients
    const createdClients = [];
    for (const clientData of sampleClients) {
      const existingClient = await prisma.client.findUnique({
        where: { email: clientData.email }
      });
      
      if (!existingClient) {
        const newClient = await prisma.client.create({
          data: clientData
        });
        createdClients.push(newClient);
        console.log(`✅ Created client: ${newClient.name}`);
      }
    }
    
    // Create products
    const createdProducts = [];
    for (const productData of sampleProducts) {
      const existingProduct = await prisma.product.findUnique({
        where: { sku: productData.sku }
      });
      
      if (!existingProduct) {
        const supplier = await prisma.supplier.findUnique({
          where: { name: productData.supplierName }
        });
        
        const newProduct = await prisma.product.create({
          data: {
            name: productData.name,
            sku: productData.sku,
            casNumber: productData.casNumber,
            unit: productData.unit,
            currency: productData.currency,
            defaultPrice: productData.defaultPrice,
            supplierId: supplier.id
          }
        });
        createdProducts.push(newProduct);
        console.log(`✅ Created product: ${newProduct.name} (${newProduct.sku})`);
      }
    }
    
    // Show final counts
    const finalClients = await prisma.client.count();
    const finalProducts = await prisma.product.count();
    const finalSuppliers = await prisma.supplier.count();
    
    console.log('\n📊 Final database state:');
    console.log(`   - Clients: ${finalClients}`);
    console.log(`   - Products: ${finalProducts}`);
    console.log(`   - Suppliers: ${finalSuppliers}`);
    
    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n🧪 Sample Products Available:');
    createdProducts.forEach(product => {
      console.log(`   - ${product.name} (${product.sku}) - ₹${product.defaultPrice}/${product.unit}`);
    });
    
    console.log('\n👥 Sample Clients Available:');
    createdClients.forEach(client => {
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