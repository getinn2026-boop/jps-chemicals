import { NextResponse } from 'next/server';
import { prisma } from '@/server/db-simple';

export async function GET() {
  try {
    // Get all clients
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Get stats
    const totalClients = await prisma.client.count();
    const companies = await prisma.client.count({
      where: { companyName: { not: null } }
    });
    const recentClients = await prisma.client.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });
    
    return NextResponse.json({
      clients,
      stats: {
        totalClients,
        companies,
        recentClients
      }
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { 
        clients: [], 
        stats: { totalClients: 0, companies: 0, recentClients: 0 },
        error: 'Failed to fetch clients' 
      },
      { status: 500 }
    );
  }
}