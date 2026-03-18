const Database = require('better-sqlite3');

function checkSchema() {
  try {
    const db = new Database('./prisma/dev.db');
    
    // Get table info for Client
    const clientInfo = db.prepare("PRAGMA table_info(Client)").all();
    console.log('Client table columns:');
    clientInfo.forEach(col => {
      console.log(`- ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
    });
    
    console.log('\n---\n');
    
    // Get all table names
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('All tables in database:');
    tables.forEach(table => {
      console.log(`- ${table.name}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkSchema();