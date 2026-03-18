const sqlite3 = require('better-sqlite3');
const path = require('path');

function checkDatabase() {
  try {
    const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
    const db = sqlite3(dbPath);
    
    console.log(`📊 Connected to database: ${dbPath}`);
    
    // Get all tables
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('\n📋 Available tables:');
    if (tables.length === 0) {
      console.log('   No tables found!');
    } else {
      tables.forEach(table => {
        console.log(`   - ${table.name}`);
      });
    }
    
    db.close();
    console.log('\n✅ Database connection closed.');
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

checkDatabase();