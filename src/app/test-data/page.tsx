import { prisma } from "@/server/db";
import { BeakerIcon, UserIcon, TruckIcon } from "@heroicons/react/24/outline";

export const dynamic = 'force-dynamic';

export default async function TestDataPage() {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-yellow-800 font-medium">⚠️ Database Configuration Missing</div>
            <div className="text-yellow-700 text-sm mt-1">
              DATABASE_URL or POSTGRES_URL environment variable is not configured. Please set up your database connection.
            </div>
            <div className="text-yellow-600 text-xs mt-2">
              For local development: Copy .env.example to .env and configure your database URL.
              
              For Vercel deployment: Connect Vercel Postgres in the Storage tab of your project settings.
            </div>
          </div>
        </div>
      );
    }

    let suppliers: any[] = [];
    let clients: any[] = [];
    let products: any[] = [];
    let error: any = null;

    try {
      // Try to fetch data from database
      const results = await Promise.allSettled([
        prisma.supplier.findMany({
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        prisma.client.findMany({
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        prisma.masterProduct.findMany({
          include: { supplier: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

      if (results[0].status === 'fulfilled') suppliers = results[0].value;
      if (results[1].status === 'fulfilled') clients = results[1].value;
      if (results[2].status === 'fulfilled') products = results[2].value;

      // Check for any rejected promises
      const rejected = results.filter(result => result.status === 'rejected');
      if (rejected.length > 0) {
        error = rejected[0].reason;
      }
    } catch (dbError: any) {
      error = dbError;
    }

    if (error) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 font-medium">❌ Database Connection Error</div>
            <div className="text-red-700 text-sm mt-1">
              {error.message || 'Unable to connect to database'}
            </div>
            <div className="text-red-600 text-xs mt-2 break-words">
              Error details: {error.code || 'Unknown error code'} - {error.stack || ''}
            </div>
            <div className="mt-4 p-3 bg-slate-50 rounded border text-xs text-slate-600">
              <strong>Quick Fix:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>For local: Ensure your database is running and DATABASE_URL is correct</li>
                <li>For Vercel: Make sure you've set up Vercel Postgres in your project</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Test Data Access</h1>
          <p className="text-slate-600">Verifying that seeded data is accessible in the web app</p>
          <div className="mt-2 text-xs text-green-600">
            ✅ Database connection successful
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Suppliers */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <TruckIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Suppliers ({suppliers.length})</h2>
            </div>
            <div className="space-y-2">
              {suppliers.map((supplier: any) => (
                <div key={supplier.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium text-slate-900">{supplier.name}</div>
                  <div className="text-sm text-slate-600">{supplier.email || "No email"}</div>
                  <div className="text-sm text-slate-500">{supplier.phone || "No phone"}</div>
                </div>
              ))}
              {suppliers.length === 0 && (
                <div className="text-slate-500 text-sm">No suppliers found</div>
              )}
            </div>
          </div>

          {/* Clients */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <UserIcon className="h-6 w-6 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-900">Clients ({clients.length})</h2>
            </div>
            <div className="space-y-2">
              {clients.map((client) => (
                <div key={client.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium text-slate-900">{client.name}</div>
                  <div className="text-sm text-slate-600">{client.companyName || "No company"}</div>
                  <div className="text-sm text-slate-500">{client.email || "No email"}</div>
                </div>
              ))}
              {clients.length === 0 && (
                <div className="text-slate-500 text-sm">No clients found</div>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <BeakerIcon className="h-6 w-6 text-purple-600" />
              <h2 className="text-lg font-semibold text-slate-900">Products ({products.length})</h2>
            </div>
            <div className="space-y-2">
              {products.map((product: any) => (
                <div key={product.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium text-slate-900">{product.name}</div>
                  <div className="text-sm text-slate-600">{product.sku || "No SKU"}</div>
                  <div className="text-sm text-slate-500">
                    {product.listPrice ? `₹${product.listPrice.toString()}/${product.unit}` : "No price"}
                    {product.supplier && (
                      <span className="ml-2 text-blue-600">from {product.supplier.name}</span>
                    )}
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div className="text-slate-500 text-sm">No products found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-800 font-medium">❌ Unexpected Error</div>
          <div className="text-red-700 text-sm mt-1">{error.message || 'Unknown error'}</div>
        </div>
      </div>
    );
  }
}