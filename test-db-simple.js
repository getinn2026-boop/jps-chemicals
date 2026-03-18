const Database = require('better-sqlite3');

function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Connect to the database
    const db = new Database('./prisma/dev.db');
    
    console.log('Database connected successfully');
    
    // Check if products exist
    const productCount = db.prepare('SELECT COUNT(*) as count FROM Product').get();
    console.log(`Total products in database: ${productCount.count}`);
    
    if (productCount.count > 0) {
      // Get first few products
      const products = db.prepare(`
        SELECT p.*, s.name as supplier_name 
        FROM Product p 
        LEFT JOIN Supplier s ON p.supplierId = s.id 
        LIMIT 5
      `).all();
      console.log('Sample products:');
      products.forEach(product => {
        console.log(`- ${product.name} (${product.sku}) - ${product.supplier_name}`);
      });
    } else {
      console.log('No products found in database');
    }
    
    // Check suppliers
    const supplierCount = db.prepare('SELECT COUNT(*) as count FROM Supplier').get();
    console.log(`Total suppliers: ${supplierCount.count}`);
    
    // Check clients
    const clientCount = db.prepare('SELECT COUNT(*) as count FROM Client').get();
    console.log(`Total clients: ${clientCount.count}`);
    
    // Check quotes
    const quoteCount = db.prepare('SELECT COUNT(*) as count FROM Quote').get();
    console.log(`Total quotes: ${quoteCount.count}`);
    
    console.log('\nDatabase test completed successfully!');
    
  } catch (error) {
    console.error('Database error:', error);
  }
}

testDatabase();