const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleClients = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@pharmatech.com',
    phone: '+91-9876543210',
    companyName: 'PharmaTech Industries Ltd.',
    address: 'Plot No. 45, Industrial Estate, Vapi, Gujarat 396195',
    gstin: '24AABCU9603R1ZX'
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@chemcorp.in',
    phone: '+91-9823456789',
    companyName: 'Chemical Corporation of India',
    address: 'Sector 18, Udyog Vihar, Gurugram, Haryana 122015',
    gstin: '06AAACC1234F1Z5'
  },
  {
    name: 'Anand Patel',
    email: 'anand.patel@biolabs.co',
    phone: '+91-9871234567',
    companyName: 'BioLabs Research Solutions',
    address: 'A-201, Science City Road, Ahmedabad, Gujarat 380060',
    gstin: '24AABBP4567E1Z8'
  },
  {
    name: 'Meena Desai',
    email: 'meena.desai@dyechem.com',
    phone: '+91-9834567890',
    companyName: 'DyeChem Industries',
    address: 'B-12, MIDC, Andheri East, Mumbai, Maharashtra 400093',
    gstin: '27AABCD1234F1Z9'
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@petrorefine.com',
    phone: '+91-9812345678',
    companyName: 'PetroRefine Petrochemicals',
    address: 'Refinery Complex, Panipat, Haryana 132140',
    gstin: '06AAAPP9876F1Z2'
  },
  {
    name: 'Sunita Agarwal',
    email: 'sunita.agarwal@agrochem.net',
    phone: '+91-9845678901',
    companyName: 'AgroChem Fertilizers Ltd.',
    address: 'NH-8, Near Jaipur, Rajasthan 302028',
    gstin: '08AAACA1234F1Z7'
  }
];

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
  },
  {
    name: 'Sulfuric Acid',
    sku: 'H2SO4-98-500ML',
    casNumber: '7664-93-9',
    unit: '500mL',
    currency: 'INR',
    defaultPrice: 280,
    supplierName: 'Qualigens Fine Chemicals'
  },
  {
    name: 'Ethanol Absolute',
    sku: 'ETH-99-1L',
    casNumber: '64-17-5',
    unit: 'L',
    currency: 'INR',
    defaultPrice: 1200,
    supplierName: 'Sigma-Aldrich'
  },
  {
    name: 'Methanol',
    sku: 'MET-001',
    casNumber: '67-56-1',
    unit: 'L',
    currency: 'INR',
    defaultPrice: 650,
    supplierName: 'Sisco Research Laboratories'
  },
  {
    name: 'Isopropyl Alcohol',
    sku: 'IPA-99-500ML',
    casNumber: '67-63-0',
    unit: '500mL',
    currency: 'INR',
    defaultPrice: 380,
    supplierName: 'Merck Life Sciences'
  },
  {
    name: 'Ammonium Hydroxide',
    sku: 'NH4OH-25-1L',
    casNumber: '1336-21-6',
    unit: 'L',
    currency: 'INR',
    defaultPrice: 420,
    supplierName: 'Thermo Fisher Scientific'
  },
  {
    name: 'Nitric Acid',
    sku: 'HNO3-70-500ML',
    casNumber: '7697-37-2',
    unit: '500mL',
    currency: 'INR',
    defaultPrice: 520,
    supplierName: 'Loba Chemie'
  },
  {
    name: 'Chloroform',
    sku: 'CHL-001',
    casNumber: '67-66-3',
    unit: 'L',
    currency: 'INR',
    defaultPrice: 1800,
    supplierName: 'Qualigens Fine Chemicals'
  },
  {
    name: 'Toluene',
    sku: 'TOL-001',
    casNumber: '108-88-3',
    unit: 'L',
    currency: 'INR',
    defaultPrice: 950,
    supplierName: 'Sisco Research Laboratories'
  },
  {
    name: 'Benzene',
    sku: 'BEN-001',
    casNumber: '71-43-2',
    unit: 'L',
    currency: 'INR',
    defaultPrice: 2200,
    supplierName: 'Sigma-Aldrich'
  }
];

async function seedComprehensive() {
  console.log('🧪 Starting comprehensive seeding process...');
  
  try {
    // Step 1: Seed Clients
    console.log('👥 Seeding clients...');
    const createdClients = [];
    for (const client of sampleClients) {
      const existingClient = await prisma.client.findFirst({
        where: { email: client.email }
      });
      
      if (!existingClient) {
        const newClient = await prisma.client.create({
          data: client
        });
        createdClients.push(newClient);
        console.log(`✅ Created client: ${newClient.name} (${newClient.companyName})`);
      } else {
        console.log(`⏭️  Client already exists: ${existingClient.email}`);
      }
    }
    
    // Step 2: Seed Suppliers
    console.log('🏭 Seeding suppliers...');
    const supplierNames = [...new Set(chemicalProducts.map(p => p.supplierName))];
    const createdSuppliers = [];
    
    for (const supplierName of supplierNames) {
      let supplier = await prisma.supplier.findFirst({
        where: { name: supplierName }
      });
      
      if (!supplier) {
        supplier = await prisma.supplier.create({
          data: {
            name: supplierName,
            email: `contact@${supplierName.toLowerCase().replace(/\s+/g, '-')}.com`,
            phone: `+91-${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
            address: 'Industrial Area, Mumbai, Maharashtra'
          }
        });
        console.log(`✅ Created supplier: ${supplier.name}`);
      } else {
        console.log(`⏭️  Supplier already exists: ${supplier.name}`);
      }
      createdSuppliers.push(supplier);
    }
    
    // Step 3: Seed Products
    console.log('🧪 Seeding chemical products...');
    const createdProducts = [];
    for (const product of chemicalProducts) {
      const existingProduct = await prisma.product.findFirst({
        where: { sku: product.sku }
      });
      
      if (!existingProduct) {
        const supplier = createdSuppliers.find(s => s.name === product.supplierName);
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
        createdProducts.push(newProduct);
        console.log(`✅ Created product: ${newProduct.name} (${newProduct.sku})`);
      } else {
        console.log(`⏭️  Product already exists: ${existingProduct.sku}`);
      }
    }
    
    console.log('\n🎉 Seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Clients created/updated: ${createdClients.length}`);
    console.log(`   - Suppliers created/updated: ${createdSuppliers.length}`);
    console.log(`   - Products created/updated: ${createdProducts.length}`);
    
    // Display sample data for testing
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
seedComprehensive();