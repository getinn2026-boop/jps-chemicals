import { NextResponse } from 'next/server';
import { prisma } from '@/server/db';

export async function GET() {
  try {
    // Get all data using Prisma
    const suppliers = await prisma.supplier.findMany();
    const clients = await prisma.client.findMany();
    const products = await prisma.product.findMany();
    
    return NextResponse.json({
      success: true,
      data: {
        suppliers,
        clients,
        products,
        counts: {
          suppliers: suppliers.length,
          clients: clients.length,
          products: products.length
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'An error occurred fetching test data'
    }, { status: 500 });
  }
}