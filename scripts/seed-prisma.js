const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

    // Sample chemical suppliers
    const sampleSuppliers = [
      {
        name: "Sigma-Aldrich Chemicals",
        contactPerson: "Dr. Sarah Johnson",
        email: "contact@sigma-aldrich.com",
        phone: "+1-800-325-3010",
        address: "3050 Spruce St, St. Louis, MO 63103, USA",
        gstNumber: "27AABCS1234A1Z5",
        notes: "Premium chemical supplier, 2-3 day delivery"
      },
      {
        name: "Merck Life Sciences",
        contactPerson: "Mr. Rajesh Kumar",
        email: "orders@merckgroup.com",
        phone: "+91-22-6661-4600",
        address: "8th Floor, Godrej One, Pirojshanagar, Mumbai 400079",
        gstNumber: "27AAECM1234A1Z8",
        notes: "Global pharmaceutical chemicals, bulk orders available"
      },
      {
        name: "Thermo Fisher Scientific",
        contactPerson: "Ms. Priya Sharma",
        email: "india@thermofisher.com",
        phone: "+91-124-4343-000",
        address: "Block A, Phase III, DLF Cyber City, Gurgaon 122002",
        gstNumber: "27AADCT1234A1Z2",
        notes: "Analytical reagents and lab equipment"
      }
    ];

    // Sample chemical products
    const sampleProducts = [
      {
        name: "Sodium Hydroxide Pellets",
        sku: "NaOH-PEL-500G",
        casNumber: "1310-73-2",
        unit: "kg",
        currency: "INR",
        defaultPrice: 450,
        supplierId: null
      },
      {
        name: "Hydrochloric Acid 37%",
        sku: "HCL-37-1L",
        casNumber: "7647-01-0",
        unit: "L",
        currency: "INR",
        defaultPrice: 280,
        supplierId: null
      },
      {
        name: "Sulfuric Acid 98%",
        sku: "H2SO4-98-500ML",
        casNumber: "7664-93-9",
        unit: "L",
        currency: "INR",
        defaultPrice: 320,
        supplierId: null
      },
      {
        name: "Acetone HPLC Grade",
        sku: "ACE-HPLC-1L",
        casNumber: "67-64-1",
        unit: "L",
        currency: "INR",
        defaultPrice: 850,
        supplierId: null
      },
      {
        name: "Methanol HPLC Grade",
        sku: "MET-HPLC-1L",
        casNumber: "67-56-1",
        unit: "L",
        currency: "INR",
        defaultPrice: 1200,
        supplierId: null
      },
      {
        name: "Ethanol Absolute",
        sku: "ETH-ABS-500ML",
        casNumber: "64-17-5",
        unit: "L",
        currency: "INR",
        defaultPrice: 680,
        supplierId: null
      },
      {
        name: "Potassium Permanganate",
        sku: "KMN04-CRY-100G",
        casNumber: "7722-64-7",
        unit: "kg",
        currency: "INR",
        defaultPrice: 1200,
        supplierId: null
      },
      {
        name: "Calcium Chloride Anhydrous",
        sku: "CACL2-ANH-500G",
        casNumber: "10043-52-4",
        unit: "kg",
        currency: "INR",
        defaultPrice: 380,
        supplierId: null
      }
    ];

    // Sample clients
    const sampleClients = [
      {
        name: "Dr. Amit Patel",
        email: "amit.patel@pharmatech.com",
        phone: "+91-98765-43210",
        companyName: "PharmaTech Industries Ltd.",
        address: "Plot 25, GIDC Industrial Estate, Vapi 396195, Gujarat",
        gstNumber: "24AABCP1234A1Z5",
        notes: "Regular customer, prefers bulk orders"
      },
      {
        name: "Ms. Deepika Singh",
        email: "deepika.singh@biolabs.co.in",
        phone: "+91-98765-12345",
        companyName: "BioLabs Research Center",
        address: "A-201, Technopark, Kinfra, Trivandrum 695581, Kerala",
        gstNumber: "32AABCB1234A1Z8",
        notes: "Research lab, needs small quantities frequently"
      },
      {
        name: "Mr. Vikram Desai",
        email: "vikram.desai@chemsolutions.net",
        phone: "+91-98765-67890",
        companyName: "Chemical Solutions India Pvt. Ltd.",
        address: "302, Corporate House, MG Road, Pune 411001, Maharashtra",
        gstNumber: "27AABCC1234A1Z2",
        notes: "Chemical distributor, negotiates on price"
      }
    ];

    // Insert suppliers
    const createdSuppliers = [];
    for (const supplierData of sampleSuppliers) {
      const existingSupplier = await prisma.supplier.findFirst({
        where: { email: supplierData.email }
      });
      
      if (!existingSupplier) {
        const supplier = await prisma.supplier.create({
          data: {
            ...supplierData,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        createdSuppliers.push(supplier);
        console.log(`✅ Created supplier: ${supplier.name}`);
      } else {
        createdSuppliers.push(existingSupplier);
        console.log(`ℹ️  Supplier already exists: ${existingSupplier.name}`);
      }
    }

    // Insert clients
    const createdClients = [];
    for (const clientData of sampleClients) {
      const existingClient = await prisma.client.findFirst({
        where: { email: clientData.email }
      });
      
      if (!existingClient) {
        const client = await prisma.client.create({
          data: {
            ...clientData,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        createdClients.push(client);
        console.log(`✅ Created client: ${client.name}`);
      } else {
        createdClients.push(existingClient);
        console.log(`ℹ️  Client already exists: ${existingClient.name}`);
      }
    }

    // Insert products with supplier references
    const createdProducts = [];
    for (let i = 0; i < sampleProducts.length; i++) {
      const productData = sampleProducts[i];
      const supplier = createdSuppliers[i % createdSuppliers.length];
      
      const existingProduct = await prisma.product.findFirst({
        where: { sku: productData.sku }
      });
      
      if (!existingProduct) {
        const product = await prisma.product.create({
          data: {
            ...productData,
            supplierId: supplier.id,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        createdProducts.push(product);
        console.log(`✅ Created product: ${product.name} (${product.sku})`);
      } else {
        createdProducts.push(existingProduct);
        console.log(`ℹ️  Product already exists: ${existingProduct.name}`);
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