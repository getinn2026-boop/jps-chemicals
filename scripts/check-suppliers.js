const sqlite3 = require('better-sqlite3');
const path = require('path');

function checkSuppliers() {
  try {
    const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
    const db = sqlite3(dbPath);
    
    console.log(`📊 Connected to database: ${dbPath}`);
    
    // Get all suppliers
    const suppliers = db.prepare('SELECT * FROM "Supplier"').all();
    console.log('\n📋 Suppliers in database:');
    suppliers.forEach(supplier => {
      console.log(`   - ID: ${supplier.id}, Name: ${supplier.name}`);
    });
    
    db.close();
    console.log('\n✅ Database connection closed.');
    
  } catch (error) {
    console.error('❌ Error checking suppliers:', error);
  }
}

checkSuppliers();