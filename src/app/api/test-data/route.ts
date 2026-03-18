import { NextResponse } from 'next/server';
import sqlite3 from 'better-sqlite3';
import path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const db = sqlite3(dbPath);
    
    // Get all data
    const suppliers = db.prepare('SELECT * FROM "Supplier"').all();
    const clients = db.prepare('SELECT * FROM "Client"').all();
    const products = db.prepare('SELECT * FROM "Product"').all();
    
    db.close();
    
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
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}