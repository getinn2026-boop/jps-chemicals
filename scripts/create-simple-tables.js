const sqlite3 = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

function createSimpleTables() {
  try {
    const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
    
    // Delete existing database if it exists
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('🗑️  Deleted existing database');
    }
    
    const db = sqlite3(dbPath);
    console.log(`📊 Created new database: ${dbPath}`);
    
    // Create tables one by one with simple SQL
    console.log('📝 Creating tables...');
    
    // Create Supplier table
    db.exec(`
      CREATE TABLE "Supplier" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "contactPerson" TEXT,
        "email" TEXT,
        "phone" TEXT,
        "address" TEXT,
        "gstNumber" TEXT,
        "notes" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      )
    `);
    console.log('✅ Created Supplier table');
    
    // Create Client table
    db.exec(`
      CREATE TABLE "Client" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT,
        "phone" TEXT,
        "companyName" TEXT,
        "address" TEXT,
        "gstNumber" TEXT,
        "notes" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      )
    `);
    console.log('✅ Created Client table');
    
    // Create Product table
    db.exec(`
      CREATE TABLE "Product" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "sku" TEXT,
        "casNumber" TEXT,
        "unit" TEXT,
        "currency" TEXT NOT NULL DEFAULT 'INR',
        "defaultPrice" DECIMAL,
        "supplierId" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
      )
    `);
    console.log('✅ Created Product table');
    
    // Create Quote table
    db.exec(`
      CREATE TABLE "Quote" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "quoteNumber" TEXT NOT NULL,
        "clientId" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'DRAFT',
        "validUntil" DATETIME,
        "notes" TEXT,
        "subtotal" DECIMAL NOT NULL DEFAULT 0,
        "tax" DECIMAL NOT NULL DEFAULT 0,
        "total" DECIMAL NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);
    console.log('✅ Created Quote table');
    
    // Create QuoteItem table
    db.exec(`
      CREATE TABLE "QuoteItem" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "quoteId" TEXT NOT NULL,
        "productId" TEXT,
        "description" TEXT NOT NULL,
        "quantity" DECIMAL NOT NULL,
        "unit" TEXT,
        "unitPrice" DECIMAL NOT NULL,
        "lineTotal" DECIMAL NOT NULL,
        FOREIGN KEY ("quoteId") REFERENCES "Quote" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
      )
    `);
    console.log('✅ Created QuoteItem table');
    
    // Create Sequence table
    db.exec(`
      CREATE TABLE "Sequence" (
        "key" TEXT NOT NULL PRIMARY KEY,
        "value" INTEGER NOT NULL
      )
    `);
    console.log('✅ Created Sequence table');
    
    // Verify tables were created
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('\n📋 Created tables:');
    tables.forEach(table => {
      console.log(`   - ${table.name}`);
    });
    
    db.close();
    console.log('\n✅ Database setup completed!');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
}

createSimpleTables();