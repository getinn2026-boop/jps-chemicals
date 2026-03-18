const Database = require('better-sqlite3');

function getClientIds() {
  try {
    console.log('Getting client information...');
    
    // Connect to the database
    const db = new Database('./prisma/dev.db');
    
    // Get all clients
    const clients = db.prepare(`
      SELECT id, name, companyName, email, phone, address, gstNumber
      FROM Client 
      ORDER BY name
    `).all();
    
    console.log(`Found ${clients.length} clients:`);
    clients.forEach(client => {
      console.log(`- ID: ${client.id}`);
      console.log(`  Name: ${client.name}`);
      console.log(`  Company: ${client.companyName || 'N/A'}`);
      console.log(`  Email: ${client.email || 'N/A'}`);
      console.log(`  Phone: ${client.phone || 'N/A'}`);
      console.log(`  Address: ${client.address || 'N/A'}`);
      console.log(`  GST Number: ${client.gstNumber || 'N/A'}`);
      console.log('');
    });
    
    console.log('Client data retrieved successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

getClientIds();