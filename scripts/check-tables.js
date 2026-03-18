const sqlite3 = require('better-sqlite3');
const path = require('path');

function checkTables() {
  console.log('🔍 Checking database tables...');
  
  try {
    const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
    const db = sqlite3(dbPath);
    
    console.log(`📊 Connected to database: ${dbPath}`);
    
    // Get all tables
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('\n📋 Available tables:');
    tables.forEach(table => {
      console.log(`   - ${table.name}`);
    });
    
    // Check table structure for each table
    tables.forEach(table => {
      console.log(`\n🔍 Structure of ${table.name}:`);
      const columns = db.prepare(`PRAGMA table_info("${table.name}")`).all();
      columns.forEach(col => {
        console.log(`   - ${col.name} (${col.type}) ${col.pk ? 'PRIMARY KEY' : ''}`);
      });
    });
    
    db.close();
    console.log('\n✅ Database connection closed.');
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

checkTables();