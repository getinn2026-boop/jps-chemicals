const sqlite3 = require('better-sqlite3');
const path = require('path');

// Generate simple IDs
function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function seedSQLite() {
  console.log('🧪 Starting SQLite seeding process...');
  
  try {
    // Connect to the database
    const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
    const db = sqlite3(dbPath);
    
    console.log(`📊 Connected to database: ${dbPath}`);
    
    // Check existing data
    const clientCount = db.prepare('SELECT COUNT(*) as count FROM "Client"').get().count;
    const productCount = db.prepare('SELECT COUNT(*) as count FROM "Product"').get().count;
    const supplierCount = db.prepare('SELECT COUNT(*) as count FROM "Supplier"').get().count;
    
    console.log(`📊 Current database state:`);
    console.log(`   - Clients: ${clientCount}`);
    console.log(`   - Products: ${productCount}`);
    console.log(`   - Suppliers: ${supplierCount}`);
    
    if (clientCount > 0 && productCount > 0) {
      console.log('✅ Database already has data. Skipping seeding.');
      db.close();
      return;
    }
    
    // Sample Suppliers
    const sampleSuppliers = [
      {
        id: generateId('supp'),
        name: 'Merck Life Sciences',
        contactPerson: 'Ramesh Iyer',
        email: 'ramesh.iyer@merck.com',
        phone: '+91-22-66688800',
        address: '126, Andheri Industrial Estate, Mumbai, Maharashtra 400093',
        gstNumber: '27AAACM1234F1Z8',
        notes: 'Premium supplier for analytical grade chemicals',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateId('supp'),
        name: 'Thermo Fisher Scientific',
        contactPerson: 'Sunita Desai',
        email: 'sunita.desai@thermofisher.com',
        phone: '+91-80-66688800',
        address: '403-404, Embassy Tech Square, Bangalore, Karnataka 560103',
        gstNumber: '29AABCT5678E1Z2',
        notes: 'Leading supplier for research chemicals and lab equipment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    // Insert suppliers
    const supplierStmt = db.prepare(`
      INSERT INTO "Supplier" (id, name, contactPerson, email, phone, address, gstNumber, notes, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const createdSuppliers = [];
    for (const supplier of sampleSuppliers) {
      const existingSupplier = db.prepare('SELECT id FROM "Supplier" WHERE email = ?').get(supplier.email);
      if (!existingSupplier) {
        const result = supplierStmt.run(
          supplier.id,
          supplier.name,
          supplier.contactPerson,
          supplier.email,
          supplier.phone,
          supplier.address,
          supplier.gstNumber,
          supplier.notes,
          supplier.createdAt,
          supplier.updatedAt
        );
        createdSuppliers.push(supplier);
        console.log(`✅ Created supplier: ${supplier.name}`);
      } else {
        console.log(`⏭️  Supplier already exists: ${supplier.email}`);
      }
    }
    
    // Sample Clients
    const sampleClients = [
      {
        id: generateId('client'),
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@pharmatech.com',
        phone: '+91-9876543210',
        companyName: 'PharmaTech Industries Ltd.',
        address: 'Plot No. 45, Industrial Estate, Vapi, Gujarat 396195',
        gstNumber: '24AABCU9603R1ZX',
        notes: 'Regular customer for pharmaceutical intermediates. 30-day payment terms.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateId('client'),
        name: 'Priya Sharma',
        email: 'priya.sharma@chemcorp.in',
        phone: '+91-9823456789',
        companyName: 'Chemical Corporation of India',
        address: 'Sector 18, Udyog Vihar, Gurugram, Haryana 122015',
        gstNumber: '06AAACC1234F1Z5',
        notes: 'Bulk orders for industrial solvents. Requires MSDS for all products.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateId('client'),
        name: 'Anand Patel',
        email: 'anand.patel@biolabs.co',
        phone: '+91-9871234567',
        companyName: 'BioLabs Research Solutions',
        address: 'A-201, Science City Road, Ahmedabad, Gujarat 380060',
        gstNumber: '24AABBP4567E1Z8',
        notes: 'Specializes in biotechnology reagents. Always requests COA documents.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    // Insert clients
    const clientStmt = db.prepare(`
      INSERT INTO "Client" (id, name, email, phone, companyName, address, gstNumber, notes, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const createdClients = [];
    for (const client of sampleClients) {
      const existingClient = db.prepare('SELECT id FROM "Client" WHERE email = ?').get(client.email);
      if (!existingClient) {
        const result = clientStmt.run(
          client.id,
          client.name,
          client.email,
          client.phone,
          client.companyName,
          client.address,
          client.gstNumber,
          client.notes,
          client.createdAt,
          client.updatedAt
        );
        createdClients.push(client);
        console.log(`✅ Created client: ${client.name} (${client.companyName})`);
      } else {
        console.log(`⏭️  Client already exists: ${client.email}`);
      }
    }
    
    // Sample Products
    const sampleProducts = [
      {
        id: generateId('prod'),
        name: 'Acetone',
        sku: 'ACE-001',
        casNumber: '67-64-1',
        unit: 'L',
        currency: 'INR',
        defaultPrice: 850,
        supplierId: createdSuppliers[0]?.id || 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateId('prod'),
        name: 'Sodium Hydroxide',
        sku: 'NAOH-500G',
        casNumber: '1310-73-2',
        unit: '500g',
        currency: 'INR',
        defaultPrice: 450,
        supplierId: createdSuppliers[0]?.id || 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateId('prod'),
        name: 'Hydrochloric Acid',
        sku: 'HCL-1L',
        casNumber: '7647-01-0',
        unit: 'L',
        currency: 'INR',
        defaultPrice: 320,
        supplierId: createdSuppliers[0]?.id || 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateId('prod'),
        name: 'Methanol',
        sku: 'MET-500ML',
        casNumber: '67-56-1',
        unit: '500mL',
        currency: 'INR',
        defaultPrice: 680,
        supplierId: createdSuppliers[1]?.id || 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateId('prod'),
        name: 'Ethanol',
        sku: 'ETH-1L',
        casNumber: '64-17-5',
        unit: 'L',
        currency: 'INR',
        defaultPrice: 950,
        supplierId: createdSuppliers[1]?.id || 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    // Get actual supplier IDs from database
    const actualSuppliers = db.prepare('SELECT id FROM "Supplier" ORDER BY createdAt').all();
    console.log(`📋 Found ${actualSuppliers.length} suppliers in database`);
    
    // Update product supplierIds with actual IDs
    const updatedProducts = sampleProducts.map((product, index) => ({
      ...product,
      supplierId: actualSuppliers[index % actualSuppliers.length]?.id || actualSuppliers[0]?.id
    }));
    
    // Insert products
    const productStmt = db.prepare(`
      INSERT INTO "Product" (id, name, sku, casNumber, unit, currency, defaultPrice, supplierId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const createdProducts = [];
    for (const product of updatedProducts) {
      const existingProduct = db.prepare('SELECT id FROM "Product" WHERE sku = ?').get(product.sku);
      if (!existingProduct) {
        const result = productStmt.run(
          product.id,
          product.name,
          product.sku,
          product.casNumber,
          product.unit,
          product.currency,
          product.defaultPrice,
          product.supplierId,
          product.createdAt,
          product.updatedAt
        );
        createdProducts.push(product);
        console.log(`✅ Created product: ${product.name} (${product.sku}) - ₹${product.defaultPrice}/${product.unit}`);
      } else {
        console.log(`⏭️  Product already exists: ${product.sku}`);
      }
    }
    
    // Show final counts
    const finalClientCount = db.prepare('SELECT COUNT(*) as count FROM "Client"').get().count;
    const finalProductCount = db.prepare('SELECT COUNT(*) as count FROM "Product"').get().count;
    const finalSupplierCount = db.prepare('SELECT COUNT(*) as count FROM "Supplier"').get().count;
    
    console.log('\n🎉 SQLite seeding completed successfully!');
    console.log('\n📊 Final database state:');
    console.log(`   - Clients: ${finalClientCount}`);
    console.log(`   - Products: ${finalProductCount}`);
    console.log(`   - Suppliers: ${finalSupplierCount}`);
    
    console.log('\n🧪 Sample Products Available:');
    createdProducts.slice(0, 5).forEach(product => {
      console.log(`   - ${product.name} (${product.sku}) - ₹${product.defaultPrice}/${product.unit}`);
    });
    
    console.log('\n👥 Sample Clients Available:');
    createdClients.slice(0, 3).forEach(client => {
      console.log(`   - ${client.name} (${client.companyName})`);
    });
    
    db.close();
    console.log('\n✅ Database connection closed.');
    
  } catch (error) {
    console.error('❌ Error during SQLite seeding:', error);
  }
}

// Run the seeding
seedSQLite().catch(console.error);