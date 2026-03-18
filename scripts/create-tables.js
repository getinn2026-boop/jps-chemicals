const sqlite3 = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

function createTables() {
  try {
    const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
    
    // Delete existing database if it exists
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('🗑️  Deleted existing database');
    }
    
    const db = sqlite3(dbPath);
    console.log(`📊 Created new database: ${dbPath}`);
    
    // Read the migration SQL
    const migrationPath = path.join(__dirname, '..', 'prisma', 'migrations', '20260316183325_init', 'migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📝 Executing migration SQL...');
    
    // Execute the SQL statements one by one
    const statements = migrationSQL.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed && !trimmed.startsWith('--')) {
        try {
          db.exec(trimmed);
          console.log(`✅ Executed: ${trimmed.substring(0, 50)}...`);
        } catch (error) {
          console.error(`❌ Error executing: ${trimmed.substring(0, 50)}...`);
          console.error(error.message);
        }
      }
    }
    
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

createTables();