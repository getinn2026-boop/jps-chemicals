import { prisma } from "@/server/db";
import { BeakerIcon, UserIcon, TruckIcon } from "@heroicons/react/24/outline";

export const dynamic = 'force-dynamic';

export default async function TestDataPage() {
  try {
    const [suppliers, clients, products] = await Promise.all([
      prisma.supplier.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.client.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.product.findMany({
        include: { supplier: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Test Data Access</h1>
          <p className="text-slate-600">Verifying that seeded data is accessible in the web app</p>
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
                  <div className="text-sm text-slate-600">{supplier.contactPerson}</div>
                  <div className="text-sm text-slate-500">{supplier.email}</div>
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
                  <div className="text-sm text-slate-600">{client.companyName}</div>
                  <div className="text-sm text-slate-500">{client.email}</div>
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
                  <div className="text-sm text-slate-600">{product.sku}</div>
                  <div className="text-sm text-slate-500">
                    ₹{product.defaultPrice?.toString()}/{product.unit}
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

        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-green-800 font-medium">✅ Data Access Test Successful!</div>
          <div className="text-green-700 text-sm mt-1">
            Successfully loaded {suppliers.length} suppliers, {clients.length} clients, and {products.length} products from the database.
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-800 font-medium">❌ Data Access Error</div>
          <div className="text-red-700 text-sm mt-1">{error.message || 'Unknown error'}</div>
          <div className="text-red-600 text-xs mt-2">{error.stack || ''}</div>
        </div>
      </div>
    );
  }
}