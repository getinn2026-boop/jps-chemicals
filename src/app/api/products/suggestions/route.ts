import { NextResponse } from 'next/server';
import { prisma } from '@/server/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    if (!query) {
      return NextResponse.json({ products: [] });
    }

    // Search products by name, starting with the query
    const products = await prisma.product.findMany({
      where: {
        name: {
          startsWith: query,
          mode: 'insensitive'
        }
      },
      include: {
        supplier: true
      },
      take: 10,
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ 
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        unit: product.unit,
        defaultPrice: product.defaultPrice,
        supplier: {
          name: product.supplier?.name || 'Unknown Supplier'
        }
      }))
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to fetch products',
      products: []
    }, { status: 500 });
  }
}