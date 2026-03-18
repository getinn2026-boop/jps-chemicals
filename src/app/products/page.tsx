import { prisma } from "@/server/db";
import { createProduct, importProductsCsv } from "./actions";
import { BeakerIcon, PlusIcon, MagnifyingGlassIcon, ChartBarIcon } from "@heroicons/react/24/outline";

export const dynamic = 'force-dynamic';

type ProductsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = (await searchParams) ?? {};
  const qParam = params.q;
  const q = typeof qParam === "string" ? qParam.trim() : "";

  const products = await prisma.product.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
            { casNumber: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { supplier: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  // Calculate product statistics
  const totalProducts = await prisma.product.count();
  const productsWithPrices = await prisma.product.count({
    where: { defaultPrice: { not: null } }
  });
  const recentProducts = await prisma.product.count({
    where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <div className="px-8 pt-16 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-3xl mx-auto mb-6 w-24 h-24 flex items-center justify-center shadow-2xl">
              <BeakerIcon className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent mb-3">
              Chemical Products
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Comprehensive catalog of industrial chemicals and reagents</p>
          </div>

          {/* Product Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-9 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-lg font-medium mb-2">Total Products</p>
                  <p className="text-4xl font-bold text-blue-900 mb-2">{totalProducts}</p>
                  <p className="text-blue-700 text-xs font-medium">Items in catalog</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all">
                  <BeakerIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-9 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-lg font-medium mb-2">Products with Prices</p>
                  <p className="text-4xl font-bold text-green-900 mb-2">{productsWithPrices}</p>
                  <p className="text-green-700 text-xs font-medium">Ready for quotations</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all">
                  <ChartBarIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-9 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-lg font-medium mb-2">New This Month</p>
                  <p className="text-4xl font-bold text-purple-900 mb-2">{recentProducts}</p>
                  <p className="text-purple-700 text-xs font-medium">Recently added</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all">
                  <ChartBarIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-16 space-y-16">
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg">
            <div className="p-8 border-b border-slate-200">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                    <BeakerIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Chemical Products</h1>
                    <p className="text-base text-slate-600">Your comprehensive chemical catalog</p>
                  </div>
                </div>
                <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-base font-semibold px-3 py-2 rounded-full shadow-md">
                  {products.length} products
                </span>
              </div>
              <form action="/products" className="flex items-center gap-4 mt-6">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    name="q"
                    defaultValue={q}
                    placeholder="Search by name, SKU, or CAS number..."
                    className="w-full pl-12 pr-5 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base shadow-sm"
                  />
                </div>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl">
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  Search
                </button>
              </form>
            </div>

            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-slate-600 border-b-2 border-slate-200">
                    <tr>
                      <th className="py-5 pr-6 font-semibold text-base">Product Name</th>
                      <th className="py-5 pr-6 font-semibold text-base">SKU</th>
                      <th className="py-5 pr-6 font-semibold text-base">CAS Number</th>
                      <th className="py-5 pr-6 font-semibold text-base">Supplier</th>
                      <th className="py-5 pr-6 font-semibold text-base">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.length === 0 ? (
                      <tr>
                        <td className="py-12 text-center text-slate-500 text-lg" colSpan={5}>
                          <div className="flex flex-col items-center gap-3">
                            <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-6 rounded-3xl animate-bounce">
                              <BeakerIcon className="h-12 w-12 text-slate-400" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 mb-1">No chemical products found</h3>
                              <p className="text-base text-slate-600 max-w-md mx-auto">Add your first chemical product to build your catalog</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      products.map((p: any) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="py-5 pr-6">
                            <div className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{p.name}</div>
                            {p.unit ? (
                              <div className="text-sm text-slate-500 mt-1">{p.unit}</div>
                            ) : null}
                          </td>
                          <td className="py-5 pr-6 font-mono text-sm">{p.sku ?? "—"}</td>
                          <td className="py-5 pr-6 font-mono text-sm">{p.casNumber ?? "—"}</td>
                          <td className="py-5 pr-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 shadow-sm">
                              {p.supplier?.name ?? "—"}
                            </span>
                          </td>
                          <td className="py-5 pr-6 font-semibold text-lg text-slate-900">
                            {p.defaultPrice ? `${p.currency} ${p.defaultPrice}` : "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-2xl shadow-lg">
                <PlusIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Add New Product</h2>
                <p className="text-base text-slate-600">Add a new chemical product to your catalog</p>
              </div>
            </div>
          </div>
          <form action={createProduct} className="p-6 space-y-4">
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Product Name *</label>
              <input
                name="name"
                required
                placeholder="e.g., Acetone, Sodium Hydroxide"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base shadow-sm"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-slate-700 mb-2">SKU</label>
                <input
                  name="sku"
                  placeholder="Internal product code"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base shadow-sm"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-slate-700 mb-2">CAS Number</label>
                <input
                  name="casNumber"
                  placeholder="e.g., 67-64-1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-slate-700 mb-2">Unit of Measure</label>
                <input
                  name="unit"
                  placeholder="kg, L, drum, bottle"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base shadow-sm"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-slate-700 mb-2">Currency</label>
                <input
                  name="currency"
                  defaultValue="INR"
                  placeholder="INR, USD, EUR"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-slate-700 mb-2">Default Price</label>
                <input
                  name="defaultPrice"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base shadow-sm"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-slate-700 mb-2">Supplier Name</label>
                <input
                  name="supplierName"
                  placeholder="e.g., Merck, Sigma-Aldrich"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base shadow-sm"
                />
              </div>
            </div>
            <button className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-base">
              <PlusIcon className="h-5 w-5" />
              Add Product
            </button>
          </form>
        </section>

        <section className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Bulk Import</h2>
                <p className="text-base text-slate-600">Upload multiple products via CSV file</p>
              </div>
            </div>
          </div>
          <form action={importProductsCsv} className="p-6 space-y-4">
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">CSV File</label>
              <input
                type="file"
                name="csvFile"
                accept=".csv"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base shadow-sm"
              />
              <p className="text-sm text-slate-500 mt-2">
                CSV format: name, sku, casNumber, unit, defaultPrice, currency, supplierName
              </p>
            </div>
            <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-base">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Import Products
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

