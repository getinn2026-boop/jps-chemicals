import { NextResponse } from 'next/server';
import { prisma } from '@/server/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    if (!query) {
      return NextResponse.json({ products: [] });
    }

    // Search products by name, starting with the query
    const products = await prisma.masterProduct.findMany({
      where: {
        name: {
          startsWith: query,
          mode: 'insensitive'
        }
      },
      take: 10, // Limit results
      select: {
        id: true,
        name: true,
        sku: true,
        unit: true,
        listPrice: true,
        currency: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku || "",
        unit: p.unit || "",
        price: p.listPrice ? Number(p.listPrice) : null,
        currency: p.currency,
      })),
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to fetch products',
      products: []
    }, { status: 500 });
  }
}