const sqlite3 = require('better-sqlite3');
const path = require('path');

function testDataAccess() {
  try {
    const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
    const db = sqlite3(dbPath);
    
    console.log(`📊 Testing data access for: ${dbPath}`);
    
    // Get all suppliers
    const suppliers = db.prepare('SELECT * FROM "Supplier"').all();
    console.log(`\n📋 Suppliers (${suppliers.length}):`);
    suppliers.forEach(supplier => {
      console.log(`   - ${supplier.name} (${supplier.id})`);
    });
    
    // Get all clients
    const clients = db.prepare('SELECT * FROM "Client"').all();
    console.log(`\n👥 Clients (${clients.length}):`);
    clients.forEach(client => {
      console.log(`   - ${client.name} (${client.companyName})`);
    });
    
    // Get all products with supplier info
    const products = db.prepare(`
      SELECT p.*, s.name as supplierName 
      FROM "Product" p 
      LEFT JOIN "Supplier" s ON p.supplierId = s.id
    `).all();
    console.log(`\n🧪 Products (${products.length}):`);
    products.forEach(product => {
      console.log(`   - ${product.name} (${product.sku}) - ₹${product.defaultPrice}/${product.unit} from ${product.supplierName}`);
    });
    
    db.close();
    console.log('\n✅ Data access test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing data access:', error);
  }
}

testDataAccess();