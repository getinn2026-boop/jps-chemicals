'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function ClientCatalog({ client, clientProducts }: { client: any, clientProducts: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [negotiatedPrice, setNegotiatedPrice] = useState('');
  const router = useRouter();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 2) {
      try {
        const res = await fetch(`/api/products/suggestions?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.products);
        }
      } catch (error) {
        console.error("Search failed:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !negotiatedPrice) return;

    try {
      const res = await fetch(`/api/clients/${client.id}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterProductId: selectedProduct.id,
          negotiatedPrice: parseFloat(negotiatedPrice)
        }),
      });

      if (res.ok) {
        setIsAdding(false);
        setSelectedProduct(null);
        setSearchQuery('');
        setNegotiatedPrice('');
        router.refresh(); // Reload the page data
      }
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const handleDeleteProduct = async (clientProductId: string) => {
    if (!confirm('Are you sure you want to remove this product from the client catalog?')) return;

    try {
      const res = await fetch(`/api/clients/${client.id}/products?id=${clientProductId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 mt-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Client Catalog</h2>
          <p className="text-sm text-slate-500">Manage negotiated prices for {client.companyName || client.name}</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          {isAdding ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="font-medium text-slate-900 mb-3">Add Product from Master Catalog</h3>
          {!selectedProduct ? (
            <div className="relative">
              <input
                type="text"
                placeholder="Search master catalog by name or CAS number..."
                className="w-full p-3 border border-slate-300 rounded-lg shadow-sm"
                value={searchQuery}
                onChange={handleSearch}
              />
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((product) => (
                    <div 
                      key={product.id}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-0"
                      onClick={() => {
                        setSelectedProduct(product);
                        setNegotiatedPrice(product.price?.toString() || '');
                        setSearchResults([]);
                      }}
                    >
                      <div className="font-medium text-slate-900">{product.name}</div>
                      <div className="text-sm text-slate-500">
                        CAS: {product.casNumber || 'N/A'} • Unit: {product.unit || 'N/A'} • List Price: {product.currency} {product.price || 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSaveProduct} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-slate-700 mb-1">Selected Product</label>
                <div className="p-3 bg-white border border-slate-300 rounded-lg text-slate-900 flex justify-between items-center">
                  <span>{selectedProduct.name} ({selectedProduct.unit})</span>
                  <button type="button" onClick={() => setSelectedProduct(null)} className="text-sm text-red-600 hover:text-red-800">Change</button>
                </div>
              </div>
              <div className="w-full sm:w-48">
                <label className="block text-sm font-medium text-slate-700 mb-1">Negotiated Price ({selectedProduct.currency})</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="w-full p-3 border border-slate-300 rounded-lg shadow-sm"
                  value={negotiatedPrice}
                  onChange={(e) => setNegotiatedPrice(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 shadow-sm"
              >
                Save Price
              </button>
            </form>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500 bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 font-medium">Product Name</th>
              <th className="py-3 px-4 font-medium">SKU / CAS</th>
              <th className="py-3 px-4 font-medium">Unit</th>
              <th className="py-3 px-4 font-medium">List Price</th>
              <th className="py-3 px-4 font-medium">Client Price</th>
              <th className="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clientProducts.length === 0 ? (
              <tr>
                <td className="py-8 text-center text-slate-500" colSpan={6}>
                  No products have been assigned to this client yet.
                </td>
              </tr>
            ) : (
              clientProducts.map((cp: any) => (
                <tr key={cp.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-900">{cp.masterProduct.name}</td>
                  <td className="py-3 px-4 text-slate-600">
                    {cp.masterProduct.sku || 'N/A'} <br/>
                    <span className="text-xs text-slate-400">{cp.masterProduct.casNumber}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{cp.masterProduct.unit}</td>
                  <td className="py-3 px-4 text-slate-500 line-through">
                    {cp.masterProduct.currency} {cp.masterProduct.listPrice?.toString() || '—'}
                  </td>
                  <td className="py-3 px-4 font-semibold text-green-700">
                    {cp.masterProduct.currency} {cp.negotiatedPrice.toString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      onClick={() => handleDeleteProduct(cp.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from client catalog"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}