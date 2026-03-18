const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getClientIds() {
  try {
    const clients = await prisma.client.findMany({
      select: { id: true, name: true, companyName: true }
    });
    
    console.log('Available clients:');
    clients.forEach(client => {
      console.log(`- ID: ${client.id}, Name: ${client.name}, Company: ${client.companyName || 'N/A'}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getClientIds();